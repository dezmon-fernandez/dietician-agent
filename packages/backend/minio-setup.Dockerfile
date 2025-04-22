FROM minio/mc

WORKDIR /usr/src/app
COPY init-minio.sh .
RUN chmod +x init-minio.sh

ENTRYPOINT ["/bin/sh", "./init-minio.sh"]
