import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang='em'>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body className=' bg-gray font-jost'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
