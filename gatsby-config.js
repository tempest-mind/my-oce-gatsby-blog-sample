/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

require('dotenv').config();

let serverUrl;
let channelToken;
let proxyUrl;
console.log('process.env.INCOMING_HOOK_BODY', process.env.INCOMING_HOOK_BODY);
let incomingHookBody = decodeURIComponent(process.env.INCOMING_HOOK_BODY || '');
if (incomingHookBody) {
  try {
    incomingHookBody = JSON.parse(incomingHookBody);
    serverUrl = incomingHookBody.SERVER_URL;
    channelToken = incomingHookBody.CHANNEL_TOKEN;
    proxyUrl = incomingHookBody.PROXY_URL;
    console.log('INCOMING_HOOK_BODY.SERVER_URL', serverUrl);
    console.log('INCOMING_HOOK_BODY.CHANNEL_TOKEN', channelToken);
    console.log('INCOMING_HOOK_BODY.PROXY_URL', proxyUrl);
  } catch (e) {
    console.error('Error parsing INCOMING_HOOK_BODY', incomingHookBody);
  }
}

module.exports = {
  pathPrefix: process.env.PATH_PREFIX,
  siteMetadata: {
    title: 'Blog Gatsby Sample',
    description: '',
    author: 'Oracle America, Inc.',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: '@oracle/gatsby-source-oce',
      options: {
        name: 'oce',
        contentServer: serverUrl || process.env.SERVER_URL,
        channelToken: channelToken || process.env.CHANNEL_TOKEN,
        proxyUrl: proxyUrl || process.env.PROXY_URL,
        items: {
          limit: 4,
          query: '',
        },
        renditions: 'none',
        // if true then digital assets are downloaded locally
        staticAssetDownload: true,
        // This determines the base directory in the path for the assets.
        //  Used when staticAssetDownload is true
        staticAssetRootDir: 'contentServer',
        staticUrlPrefix: process.env.PATH_PREFIX,
        authStr: process.env.AUTH,
        oAuthSettings: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          clientScopeUrl: process.env.CLIENT_SCOPE_URL,
          idpUrl: process.env.IDP_URL,
        },
        preview: process.env.PREVIEW,
        debug: false,
      },
    },
    'gatsby-plugin-react-helmet',
  ],
};
