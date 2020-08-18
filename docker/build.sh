read -p 'please input you version: ' version

docker build -t ssr-admin-web:"$version" ./

docker tag ssr-admin-web:"$version" ssr-admin-web:latest
