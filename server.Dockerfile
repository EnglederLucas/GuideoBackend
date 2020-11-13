FROM node AS builder
COPY . .
RUN npm install && npm install -g typescript
RUN tsc

FROM node AS orderer
WORKDIR /app
COPY --from=builder ./build .
COPY --from=builder ./public ./public
COPY --from=builder ./package.json .
COPY --from=builder ./vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json .

FROM node
ARG PORT=3030
WORKDIR /app
COPY --from=orderer ./app .
ENV CRED_PATH=/vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json PUBLIC_PATH=/public
ENV PORT=${PORT}
RUN npm install --production
# RUN ls -la
EXPOSE ${PORT}
CMD ["node", "app.js"]