#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

DESKTOP_EXPORT=1 npm run build
rm -rf desktop/out
cp -a out desktop/out

(
  cd desktop
  GOOS=windows GOARCH=amd64 CGO_ENABLED=0 \
    go build -ldflags "-s -w" -o "青囊起名.exe" .
)
echo "built desktop/青囊起名.exe"
