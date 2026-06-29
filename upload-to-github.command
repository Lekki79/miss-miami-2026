#!/bin/bash
cd "$(dirname "$0")"
git add -A
git commit -m "Update site"
git push
echo "✅ Сайт обновлён!"
sleep 2
