# Mainsite

https://safetyscore.app

## Dev guide

Install pre-requisites:

```shell
npm install
```

Now, ensure you [authenticate with Google APIs](https://cloud.google.com/docs/authentication/getting-started):

```shell
gcloud auth login
```

Now fetch the dev secrets:

```shell
gcloud secrets versions access latest --secret="mainsite-dev" > .env
```

Now run the dev server:

```shell
npm run dev
```

Build and deploy production:

```shell
npm run deploy
```

## Deploy to production

```shell
npm run deploy
```

## Storing secrets

We store API keys using [Google Cloud Secrets manager](https://cloud.google.com/secret-manager).

To view dev environment secrets:

```shell
gcloud secrets versions access latest --secret="mainsite-dev"
```

For live env:

```shell
gcloud secrets versions access latest --secret="mainsite-live"
```
