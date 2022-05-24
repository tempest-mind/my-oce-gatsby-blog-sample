/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable react/prop-types */

import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import ArticlesListItem from '../components/ArticlesListItem';
import Breadcrumbs from '../components/Breadcrumbs';
import { getImageObject } from '../scripts/utils';

export const query = graphql`query ($topicId: String!) {
  topLevelQuery: allOceAsset(
    filter: {oceType: {eq: "OCEGettingStartedArticle"}, topic: {id: {eq: $topicId}}}
  ) {
    nodes {
      topic {
        name
        id
      }
      oceId
      name
      published_date
      description
      image {
        id
      }
    }
  }
  oceToFileQuery: allOceAsset(filter: {staticURL: {ne: null}}) {
    nodes {
      oceId
      staticURL
    }
  }
 
}
`;

/**
 * Template for the Articles List Page.
 */
const ArticlesListTemplate = ({ pageContext: { buildTag }, data }) => {
  const articles = data.topLevelQuery.nodes;
  const oceToFile = data.oceToFileQuery.nodes;

  const breadcrumbsData = [
    {
      linkParams: { pathname: '/' },
      text: 'Home',
    },
    {
      linkParams: {},
      text: articles[0].topic.name,
    },
  ];

  const BUILD_TAG = buildTag || 'none';
  const sdkPackage = require('/node_modules/@oracle/gatsby-source-oce/package.json');
  const SDK_VERSION = sdkPackage.version;

  return (
    <div data-testid="ArticlesListContainer">
      <Helmet>
        <meta name="description" content="Sample Blog app created in Gatsby that uses Oracle Content Management" />
        <meta name="BUILD_TAG" content={`${BUILD_TAG}`} />
        <meta name="@oracle/gatsby-source-oce" content={`${SDK_VERSION}`} />
      </Helmet>
      <Breadcrumbs breadcrumbsData={breadcrumbsData} />
      {data && (
        <div id="articles">
          {articles.map((article) => {
            const articleImageObj = getImageObject(
              oceToFile,
              article.image.id,
            );
            return (
              <ArticlesListItem
                article={article}
                key={article.oceId}
                image={articleImageObj}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArticlesListTemplate;

ArticlesListTemplate.propTypes = {
  data: PropTypes.shape({
    topLevelQuery: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.shape({
        topic: PropTypes.shape({
          name: PropTypes.string,
        }),
      })),
    }).isRequired,
    oceToFileQuery: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
  }).isRequired,
};
