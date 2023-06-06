FROM postgres:15.1-alpine

LABEL author="Your Name"
LABEL description="Postgres Image for demo"
LABEL version="1.0"

COPY ./sql/*.sql /docker-entrypoint-initdb.d/