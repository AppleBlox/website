#!/bin/bash

get_macos_codename() {
  local version="$1"
  case "$version" in
    14*) echo "Sonoma" ;;
    13*) echo "Ventura" ;;
    12*) echo "Monterey" ;;
    11*) echo "Big Sur" ;;
    10.16|10.15*) echo "Catalina" ;;
    10.14*) echo "Mojave" ;;
    10.13*) echo "High Sierra" ;;
    10.12*) echo "Sierra" ;;
    10.11*) echo "El Capitan" ;;
    10.10*) echo "Yosemite" ;;
    10.9*)  echo "Mavericks" ;;
    10.8*)  echo "Mountain Lion" ;;
    10.7*)  echo "Lion" ;;
    10.6*)  echo "Snow Leopard" ;;
    *) echo "Unknown" ;;
  esac
}

product_version=$(sw_vers -productVersion)
codename=$(get_macos_codename "$product_version")
echo "macOS: $product_version - Codename: $codename"
find /Applications "$HOME/Applications" -maxdepth 1 -iname 'roblox.app' -exec stat -f '%a %N' {} + 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-
