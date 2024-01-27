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
      <meta property="og:type" content="website" key="type" />
      {/* <meta property="og:url" content="https://www.club-compass.com" key="url" /> */}
      <meta property="og:image" content="/static/images/og-image.png" key="image" />
      <meta property="og:image:width" content="1200" key="image-width" />
      <meta property="og:image:height" content="630" key="image-height" />
      <meta property="og:image:alt" content="ClubCompass Banner" key="image-alt" />
      <meta property="og:locale" content="en_US" key="locale" />
      <meta property="og:site_name" content="ClubCompass" key="site-name" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:site" content="@clubcompass_" key="twitter-site" />
      <meta name="twitter:creator" content="@clubcompass_" key="twitter-creator" />
      <meta name="twitter:title" content="ClubCompass" key="twitter-title" />
      <meta name="twitter:description" content="Redefining Club Discovery" key="twitter-description" />
      <meta name="twitter:image" content="/static/images/og-image.png" key="twitter-image" />
      <meta name="twitter:image:alt" content="ClubCompass Banner" key="twitter-image-alt" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/images/apple-touch-icon.png"></link>
      <Main />
      <NextScript />
    </Html>
  );
}
