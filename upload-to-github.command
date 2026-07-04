#!/bin/bash
cd "$(dirname "$0")"

# Удалить блокировку git если есть
rm -f "$(dirname "$0")/.git/index.lock" 2>/dev/null

# ── Hero background photo ──────────────────────────────────
# Если на рабочем столе есть готовый JPG — берём его
if [ -f "$HOME/Desktop/hero-bg.jpg" ]; then
  cp "$HOME/Desktop/hero-bg.jpg" "$(dirname "$0")/hero-bg.jpg"
  echo "📸 hero-bg.jpg скопировано с рабочего стола"
fi

# Если на рабочем столе есть HEIC — конвертируем через sips
if [ -f "$HOME/Desktop/IMG_4019.HEIC" ] && [ ! -f "$(dirname "$0")/hero-bg.jpg" ]; then
  sips -s format jpeg "$HOME/Desktop/IMG_4019.HEIC" --out "$(dirname "$0")/hero-bg.jpg" 2>/dev/null
  echo "📸 hero-bg.jpg конвертировано из HEIC (рабочий стол)"
fi

# Если HEIC есть в папке загрузок сессии — конвертируем
SESSION_HEIC="/Users/elenakuzmenko/Library/Application Support/Claude/local-agent-mode-sessions/fbdb8e3c-9211-4314-ad94-35f3c479dc51/5c1539dc-5d68-44b5-a16f-be806043832c/local_360b5222-b2a5-416b-a63b-e37996e471df/uploads/IMG_4019.HEIC"
if [ ! -f "$(dirname "$0")/hero-bg.jpg" ] && [ -f "$SESSION_HEIC" ]; then
  sips -s format jpeg "$SESSION_HEIC" --out "$(dirname "$0")/hero-bg.jpg" 2>/dev/null
  echo "📸 hero-bg.jpg конвертировано из HEIC (сессия)"
fi

# ── About page hero photo ──────────────────────────────────
if [ -f "$HOME/Desktop/about-hero.jpg" ]; then
  cp "$HOME/Desktop/about-hero.jpg" "$(dirname "$0")/about-hero.jpg"
  echo "📸 about-hero.jpg скопировано"
fi

# ── Push to GitHub ─────────────────────────────────────────
git add -A
git commit -m "Update site"
git push
echo "✅ Сайт обновлён!"
sleep 2
