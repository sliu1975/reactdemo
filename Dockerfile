# 启动环境
FROM nginx:1.17.10-alpine

ENV API_URL http://127.0.0.1:8010/
ENV OSS_URL http://127.0.0.1:8010/
ENV DISPATCHER_URL http://127.0.0.1:8013/

COPY ./docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template

COPY ./dist  /usr/share/nginx/html

EXPOSE 80

COPY ./docker/docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
