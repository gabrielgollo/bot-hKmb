FROM --platform=arm64 node:20-alpine

WORKDIR /botHamsterKombat

ENV NODE_ENV=build
ENV PORT=3330

COPY . .

RUN npm ci --only=production

USER node

EXPOSE $PORT

CMD ["npm", "start"]
