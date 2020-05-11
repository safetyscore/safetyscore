import Document, { Main, Head, NextScript } from 'next/document'

import { getAppConfig } from '../src/frontend/appConfig'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    const ret = {
      ...initialProps,
      appConfig: getAppConfig(),
    }

    return ret
  }

  render () {
    return (
      <html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no"
          />
          <link rel='stylesheet' href='https://unpkg.com/@fortawesome/fontawesome-svg-core@1.2.28/styles.css' crossOrigin='anonymous'></link>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
          <link rel="manifest" href="/site.webmanifest"></link>        
          </Head>
        <body>
          <Main />
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
              window.appConfig = ${JSON.stringify(this.props.appConfig, null, 2)};
            `
          }}></script>
          <NextScript />
        </body>
      </html>
    )
  }
}
