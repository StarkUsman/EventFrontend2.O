#!/bin/sh

echo "Injecting backend URL: $BACKEND_URL"

cat <<EOF > /usr/share/nginx/html/assets/env.json
{
  "backendUrl": "${BACKEND_URL}"
}
EOF

nginx -g 'daemon off;'
