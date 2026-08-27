#!/bin/sh
# Point the site at its real domain.
#
#   ./set-domain.sh https://mitjagodnic.com
#
# Every absolute URL on the site — canonical links, Open Graph, Twitter cards,
# the sitemap, robots.txt and the JSON-LD — is written out in full, because
# social crawlers will not resolve a relative one. This rewrites all of them
# at once. Run it whenever the domain changes; it is safe to run twice.
set -e
NEW="${1%/}"
[ -n "$NEW" ] || { echo "usage: ./set-domain.sh https://your-domain.com"; exit 1; }
OLD=$(grep -o 'https://[^"/]*' index.html | grep -v fonts | head -1)
[ -n "$OLD" ] || { echo "could not find the current domain in index.html"; exit 1; }
[ "$OLD" = "$NEW" ] && { echo "already set to $NEW"; exit 0; }
for f in *.html robots.txt sitemap.xml site.webmanifest; do
  [ -f "$f" ] || continue
  sed -i '' "s|$OLD|$NEW|g" "$f"
done
echo "rewrote $OLD  ->  $NEW"
grep -c "$NEW" sitemap.xml | sed 's/^/  sitemap entries: /'
