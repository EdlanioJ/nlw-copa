#!/bin/sh

if [ ! -f ".env" ]; then
   cp .env.example .env
fi

yarn install

yarn run prisma migrate dev

yarn run prisma db seed

yarn dev
