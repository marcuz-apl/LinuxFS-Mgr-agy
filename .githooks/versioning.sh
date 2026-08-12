#!/usr/bin/env sh
set -e

VERSION_FILE="VERSION"

if [ ! -f "$VERSION_FILE" ]; then
    echo "1.0.0" > "$VERSION_FILE"
fi

VERSION_STR=$(cat "$VERSION_FILE" | tr -d '\r\n')
IFS='.' read -r m n p <<EOF
$VERSION_STR
EOF

m=${m:-1}
n=${n:-0}
p=${p:-0}

p=$((p + 1))
if [ "$p" -gt 9 ]; then
    p=0
    n=$((n + 1))
fi

if [ "$n" -gt 9 ]; then
    n=0
    m=$((m + 1))
fi

NEW_VERSION="${m}.${n}.${p}"
echo "$NEW_VERSION" > "$VERSION_FILE"
git add "$VERSION_FILE"
echo "Alfazen Versioning: Bumped VERSION to $NEW_VERSION"
