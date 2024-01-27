import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>ClubCompass</title>
      <meta name="description" content="Redefining Club Discovery" />
      <link rel="icon" type="image/png" href="/static/favicons/favicon@0.5x.png" sizes="16x16" />
      <link rel="icon" type="image/png" href="/static/favicons/favicon@1x.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/static/favicons/favicon@2x.png" sizes="64x64" />
      <link rel="icon" type="image/png" href="/static/favicons/favicon@3x.png" sizes="96x96" />
      <link rel="icon" type="image/png" href="/static/favicons/favicon@4x.png" sizes="128x128" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="ClubCompass" key="title" />
      <meta property="og:description" content="Redefining Club Discovery" key="description" />
      <meta property="og:image" content="/logo.png" key="image" />
      <Main />
      <NextScript />
    </Html>
  );
}
