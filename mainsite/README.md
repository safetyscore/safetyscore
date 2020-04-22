# Mainsite

https://safetyscore.app

## Dev guide

Install pre-requisites:

```shell
npm install
```

You will need to create a `.env` file with the following content:

```
SLACK_TOKEN=...
STRIPE_PUBLIC_KEY=...
STRIPE_PRIVATE_KEY=...
```

Now run the dev server:

```shell
npm run dev
```

Build and deploy production:

```shell
npm run deploy
```
