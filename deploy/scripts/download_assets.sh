#!/bin/bash

echo
echo "⬇️  Downloading external assets..."

if [ "$#" -ne 1 ]; then
  echo "🛑 Error: incorrect amount of arguments. Usage: $0 <ASSETS_DIR>."
  exit 1
fi

ASSETS_DIR="$1"

ASSETS_ENVS=(
    "NEXT_PUBLIC_MARKETPLACE_CONFIG_URL"
    "NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL"
    "NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL"
    "NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL"
    "NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL"
    "NEXT_PUBLIC_FEATURED_NETWORKS"
    "NEXT_PUBLIC_FOOTER_LINKS"
    "NEXT_PUBLIC_NETWORK_LOGO"
    "NEXT_PUBLIC_NETWORK_LOGO_DARK"
    "NEXT_PUBLIC_NETWORK_ICON"
    "NEXT_PUBLIC_NETWORK_ICON_DARK"
    "NEXT_PUBLIC_OG_IMAGE_URL"
    "NEXT_PUBLIC_AD_CUSTOM_CONFIG_URL"
)

mkdir -p "$ASSETS_DIR"

get_target_filename() {
    local env_var="$1"
    local url="${!env_var}"

    local name_prefix="${env_var#NEXT_PUBLIC_}"
    local name_suffix="${name_prefix%_URL}"
    local name_lc
    name_lc="$(echo "$name_suffix" | tr '[:upper:]' '[:lower:]')"

    local extension

    if [[ "$url" == file://* ]]; then
        local file_path="${url#file://}"
        local filename
        filename=$(basename "$file_path")
        extension="${filename##*.}"
    elif [[ "$url" == http* ]]; then
        local filename
        filename=$(basename "${url%%\?*}")
        extension="${filename##*.}"
    else
        extension="json"
    fi

    extension="$(echo "$extension" | tr '[:upper:]' '[:lower:]')"

    echo "$name_lc.$extension"
}

download_and_save_asset() {
    local env_var="$1"
    local url="$2"
    local filename="$3"
    local destination="$ASSETS_DIR/$filename"

    if [ "$NEXT_PUBLIC_DISABLE_DOWNLOAD_AT_RUN_TIME" = "true" ]; then
        echo "   [.] Download disabled at runtime. Skipping download."
        return 1
    fi

    if [ -z "${!env_var}" ]; then
        echo "   [.] $env_var: Variable is not set. Skipping download."
        return 1
    fi

    if [[ "$url" == file://* ]]; then
        cp "${url#file://}" "$destination"
    elif [[ "$url" == http* ]]; then
        if ! curl -f -s --connect-timeout 5 --max-time 15 -o "$destination" "$url"; then
            echo "   [-] $env_var: Failed to download from $url"
            return 1
        fi
    else
        local json_content
        json_content=$(echo "${!env_var}" | sed "s/'/\"/g")
        echo "$json_content" > "$destination"
    fi

    if [ $? -eq 0 ]; then
        echo "   [+] $env_var: Saved to $destination."
        return 0
    else
        echo "   [-] $env_var: Failed to save file."
        return 1
    fi
}

for env_var in "${ASSETS_ENVS[@]}"; do
    url="${!env_var}"
    filename=$(get_target_filename "$env_var")
    download_and_save_asset "$env_var" "$url" "$filename"
done

echo "✅ Done."
echo