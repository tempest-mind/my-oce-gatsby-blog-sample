/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/** hola! */

require('dotenv').config();

let serverUrl;
let channelToken;
let proxyUrl;
let clientScopeUrl;
let clientId;
let clientSecret;
let idpUrl;
let isPreview = false;
console.log('process.env.INCOMING_HOOK_BODY', process.env.INCOMING_HOOK_BODY);
let incomingHookBody = decodeURIComponent(process.env.INCOMING_HOOK_BODY || '');
if (incomingHookBody) {
  try {
    incomingHookBody = JSON.parse(incomingHookBody);
    serverUrl = incomingHookBody.SERVER_URL;
    channelToken = incomingHookBody.CHANNEL_TOKEN;
    proxyUrl = incomingHookBody.PROXY_URL;
    clientScopeUrl = incomingHookBody.CLIENT_SCOPE_URL;
    clientId = incomingHookBody.CLIENT_ID;
    clientSecret = incomingHookBody.CLIENT_SECRET;
    idpUrl = incomingHookBody.IDP_URL;
    isPreview = incomingHookBody.PREVIEW;
    console.log('INCOMING_HOOK_BODY.SERVER_URL', serverUrl);
    console.log('INCOMING_HOOK_BODY.CHANNEL_TOKEN', channelToken);
    console.log('INCOMING_HOOK_BODY.PROXY_URL', proxyUrl);
    console.log('INCOMING_HOOK_BODY.CLIENT_SCOPE_URL', clientScopeUrl);
    console.log('INCOMING_HOOK_BODY.CLIENT_ID', clientId);
    console.log('INCOMING_HOOK_BODY.CLIENT_SECRET', clientSecret);
    console.log('INCOMING_HOOK_BODY.IDP_URL', idpUrl);
    console.log('INCOMING_HOOK_BODY.PREVIEW', incomingHookBody);
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
          clientId: clientId || process.env.CLIENT_ID,
          clientSecret: clientSecret || process.env.CLIENT_SECRET,
          clientScopeUrl: clientScopeUrl || process.env.CLIENT_SCOPE_URL,
          idpUrl: idpUrl || process.env.IDP_URL,
        },
        preview: isPreview || process.env.PREVIEW,
        debug: false,
      },
    },
    'gatsby-plugin-react-helmet',
  ],
};
