FROM node:16.14-alpine3.15

WORKDIR /usr/src/ligo

RUN wget https://gitlab.com/ligolang/ligo/-/jobs/2332031981/artifacts/raw/ligo
RUN chmod +x ./ligo

RUN mkdir -p /usr/src/tmp

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./apps/ligo/package.json ./apps/ligo/

RUN yarn install

COPY ./.eslintrc.json ./
COPY ./.prettierignore ./
COPY ./.prettierrc ./
COPY ./tsconfig.json ./
ADD ./apps/ligo ./apps/ligo/

WORKDIR /usr/src/app/apps/ligo

RUN yarn workspace @monorepo/ligo build

EXPOSE 4000

CMD ["yarn", "workspace", "@monorepo/ligo", "start"]
