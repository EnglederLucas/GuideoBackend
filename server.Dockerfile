FROM node AS builder

COPY . .
RUN npm install
RUN npm install -g typescript
RUN tsc

FROM node:alpine
WORKDIR /app
COPY --from=builder ./build .
COPY --from=builder ./public ./public
COPY --from=builder ./package.json .
COPY --from=builder ./vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json .
ENV CRED_PATH /vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json
ENV PUBLIC_PATH /public
RUN npm install
RUN ls -la
EXPOSE 3030
CMD ["node", "app.js"]