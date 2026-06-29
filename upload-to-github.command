#!/bin/bash
cd "$(dirname "$0")"

# Copy about-hero photo from Desktop if exists
if [ -f "$HOME/Desktop/about-hero.jpg" ]; then
  cp "$HOME/Desktop/about-hero.jpg" "$(dirname "$0")/about-hero.jpg"
  echo "📸 Фото about-hero.jpg скопировано"
fi

git add -A
git commit -m "Update site"
git push
echo "✅ Сайт обновлён!"
sleep 2
