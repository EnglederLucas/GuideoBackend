FROM node AS builder
RUN npm install -g typescript
COPY ./package*.json ./
RUN npm install
COPY ./tsconfig.json .
COPY ./src ./
RUN tsc

FROM node
ARG PORT=3030
WORKDIR /app
ENV CRED_PATH=/vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json PUBLIC_PATH=/public
ENV PORT=${PORT}
COPY ./vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json .
COPY ./package*.json ./
RUN npm install --production
COPY --from=builder ./build .
EXPOSE ${PORT}
CMD ["node", "app.js"]