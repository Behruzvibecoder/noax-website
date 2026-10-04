#!/usr/bin/env bash
# GitHub'ga push + Pages yoqish.
#   ./push.sh <user>/<repo> <token> [public|private]
set -euo pipefail

SLUG="${1:?foydalanish: ./push.sh user/repo TOKEN [public|private]}"
TOKEN="${2:?token kerak}"
VIS="${3:-public}"
USER="${SLUG%%/*}"
REPO="${SLUG##*/}"
API="https://api.github.com"
PRIVATE=$([ "$VIS" = "private" ] && echo true || echo false)

cd "$(dirname "$0")"

echo "1/5  Repo yaratilmoqda: $SLUG ($VIS)"
curl -sS -X POST "$API/user/repos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d "{\"name\":\"$REPO\",\"private\":$PRIVATE,\"description\":\"trevornoah.com — to'liq lokal nusxa (o'rganish uchun)\",\"has_issues\":false,\"has_wiki\":false}" \
  -o /tmp/repo.json -w "     HTTP %{http_code}\n" || true
grep -q '"full_name"' /tmp/repo.json || echo "     (repo allaqachon mavjud bo'lishi mumkin — davom etamiz)"

echo "2/5  GitHub Pages uchun base path: /$REPO"
python3 set_base.py "/$REPO"

echo "3/5  Commit"
git add -A
git commit -qm "GitHub Pages uchun base path: /$REPO" || echo "     (o'zgarish yo'q)"

echo "4/5  Push"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "https://${USER}:${TOKEN}@github.com/${SLUG}.git"
git push -u origin main --force
git remote set-url origin "https://github.com/${SLUG}.git"   # tokenni remote'dan tozalash

echo "5/5  Pages yoqilmoqda (main / root)"
curl -sS -X POST "$API/repos/$SLUG/pages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d '{"source":{"branch":"main","path":"/"}}' \
  -o /tmp/pages.json -w "     HTTP %{http_code}\n" || true

echo
echo "Tayyor:  https://${USER}.github.io/${REPO}/"
echo "Repo:    https://github.com/${SLUG}"
echo "Eslatma: lokalda qayta sinash uchun  python3 set_base.py /"
