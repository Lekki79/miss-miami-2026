#!/usr/bin/env python3
"""Build a byte-identical, allowlisted Pages artifact from committed HEAD only."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import posixpath
import re
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
PAGES = frozenset(f'{name}.html' for name in (
    'index', 'about', 'competition', 'apply', 'sponsors', 'faq', 'contact',
    'gallery', 'privacy', 'terms', 'refund', 'dashboard'))
ASSETS = frozenset('''
about-bg.jpg
assets/brand/miss-miami-logo-official.svg
assets/css/about.css
assets/css/bronze-cta.css
assets/css/competition.css
assets/css/contact.css
assets/css/faq.css
assets/css/home-unified-preview.css
assets/css/legal.css
assets/css/site-header.css
assets/css/sponsors.css
assets/docs/miss-miami-2027-partnership-deck.pdf
assets/images/about-hero-crown-ivory-desktop-v2.png
assets/images/about-hero-crown-ivory-mobile-v3.png
assets/images/about-portrait-champagne-v2.png
assets/images/contact-hero-beach-mobile-preview.png
assets/images/contact-hero-waterfront-desktop-preview.png
assets/images/miss-miami-brand-star.svg
assets/images/sponsor-deck-light-approved.png
assets/js/contact.js
assets/js/faq.js
assets/js/site-header-scroll.js
competition-final-cta-v2.png
competition-hero-approved.png
hero-bg-champagne-mobile.png
hero-bg-champagne-v2.png
hero-bg.jpg
logo-transparent.png
team-1.jpg
team-2.jpg
team-3.jpg
'''.split())
ALLOWLIST = PAGES | ASSETS
# Explicitly approved production dependencies; no other preview names allowed.
NAME_EXCEPTIONS = frozenset({
    'assets/css/home-unified-preview.css',
    'assets/images/contact-hero-waterfront-desktop-preview.png',
    'assets/images/contact-hero-beach-mobile-preview.png',
})
BLOCKED_PARTS = {'.git', '.github', 'node_modules', '.pnpm-store', 'functions',
                 'unpacked_v3', 'output', 'tmp', 'tools', 'admin.html'}
BLOCKED_SUFFIXES = {'.docx', '.doc', '.md', '.py', '.log', '.zip', '.tar', '.gz',
                    '.env', '.ai', '.psd', '.eps'}

def require(condition, message):
    if not condition:
        raise ValueError(message)

def check_name(name):
    p = Path(name)
    require(not p.is_absolute() and '..' not in p.parts, f'Unsafe path: {name}')
    require(not set(p.parts) & BLOCKED_PARTS, f'Forbidden path: {name}')
    require(p.suffix.lower() not in BLOCKED_SUFFIXES, f'Forbidden file: {name}')
    if name not in NAME_EXCEPTIONS:
        require(not re.search(r'preview|recovery|review|output|(?:^|[./_-])logs?(?:[./_-]|$)',
                              name, re.I), f'Temporary file: {name}')
    require(name in ALLOWLIST, f'Not allowlisted: {name}')

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value and key in ('href', 'src', 'poster'):
                self.refs.append(value)
            elif value and key == 'srcset':
                self.refs.extend(item.strip().split()[0] for item in value.split(','))

def local_target(source, ref):
    u = urlsplit(ref.strip())
    if u.netloc:
        if u.netloc.lower() != 'lekki79.github.io':
            return None
        prefix = '/miss-miami-2026/'
        if not u.path.startswith(prefix):
            return None
        path = unquote(u.path[len(prefix):])
    elif u.scheme or not u.path:
        return None
    elif u.path.startswith('/'):
        prefix = '/miss-miami-2026/'
        require(u.path.startswith(prefix), f'Unexpected root URL: {source}: {ref}')
        path = unquote(u.path[len(prefix):])
    else:
        path = posixpath.join(posixpath.dirname(source), unquote(u.path))
    if not path or path.endswith('/'):
        path += 'index.html'
    return posixpath.normpath(path)

def check_links(files):
    count = 0
    for name, data in files.items():
        if not name.endswith(('.html', '.css', '.js', '.svg')):
            continue
        text = data.decode('utf-8')
        refs = []
        if name.endswith(('.html', '.svg')):
            parser = References()
            parser.feed(text)
            refs.extend(parser.refs)
        text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
        refs.extend(re.findall(r'url\(\s*[\"\x27]?([^\)\"\x27]+)', text))
        refs.extend(re.findall(r'@import\s+[\"\x27]([^\"\x27]+)', text))
        for ref in refs:
            target = local_target(name, ref)
            if target is not None:
                require(target in files, f'Missing local dependency: {name} -> {ref}')
                count += 1
    return count

def committed_files():
    """Use one Git batch, never copy dirty/untracked worktree assets."""
    names = sorted(ALLOWLIST)
    request = ''.join(f'HEAD:{name}\n' for name in names).encode()
    result = subprocess.run(['git', 'cat-file', '--batch'], cwd=ROOT,
                            input=request, capture_output=True, check=True).stdout
    files = {}
    offset = 0
    for name in names:
        end = result.index(b'\n', offset)
        header = result[offset:end].split()
        require(len(header) == 3 and header[1] == b'blob', f'Missing Git blob: {name}')
        size = int(header[2])
        offset = end + 1
        files[name] = result[offset:offset + size]
        offset += size + 1
    return files

def verify(directory, expected):
    actual = {}
    for path in directory.rglob('*'):
        require(not path.is_symlink(), f'Symlink in artifact: {path}')
        if path.is_dir():
            require(any(name.startswith(path.relative_to(directory).as_posix() + '/')
                        for name in ALLOWLIST), f'Unexpected directory: {path}')
            continue
        name = path.relative_to(directory).as_posix()
        check_name(name)
        actual[name] = path.read_bytes()
    require(actual.keys() == expected.keys(), 'Artifact file list differs from allowlist')
    require(actual == expected, 'Artifact differs from committed source bytes')
    return check_links(actual)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path, help='New or empty artifact directory')
    parser.add_argument('--verify-only', action='store_true')
    args = parser.parse_args()
    for name in ALLOWLIST:
        check_name(name)
    files = committed_files()
    check_links(files)
    destination = args.directory.absolute()
    require(not destination.is_symlink(), 'Output must not be a symlink')
    if not args.verify_only:
        require(not destination.exists() or not any(destination.iterdir()),
                'Refusing to overwrite a non-empty output directory')
        destination.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            target = destination / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
    references = verify(destination, files)
    print('\n'.join(sorted(files)))
    print(f'PASS: {len(PAGES)} pages, {len(ASSETS)} assets, {references} local references; '
          'all artifact bytes match committed HEAD')

if __name__ == '__main__':
    main()
