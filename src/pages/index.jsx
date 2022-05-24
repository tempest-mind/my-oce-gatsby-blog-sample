/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/* eslint-disable camelcase */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */

import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';

import Header from '../components/Header';
import TopicsListItem from '../components/TopicsListItem';
import { getImageObject } from '../scripts/utils';

/**
 * Query to fetch the topics, the oceId to fileId map and all the image files
 */
export const query = graphql`{
  topLevelQuery: allOceAsset(
    filter: {oceType: {eq: "OCEGettingStartedHomePage"}, name: {eq: "HomePage"}}
  ) {
    nodes {
      about_url
      company_name
      company_logo {
        id
      }
      contact_url
      topics {
        description
        name
        id
        fields {
          thumbnail {
            id
          }
        }
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
 * Component for the Topics List Page.
 */
const IndexPage = () => {
  const data = useStaticQuery(query);
  const oceToFile = data.oceToFileQuery.nodes;
  const toplevel = data.topLevelQuery.nodes[0];
  const { company_logo } = toplevel;
  const companyLogoImageObj = getImageObject(
    oceToFile,
    company_logo.id,
  );
  const { topics } = toplevel;
  const BUILD_TAG = process.env.GATSBY_BUILD_TAG || 'none';
  const sdkPackage = require('/node_modules/@oracle/gatsby-source-oce/package.json');
  const SDK_VERSION = sdkPackage.version;
  return (
    <div data-testid="TopicsListContainer">
      <Helmet>
        <meta name="description" content="Sample Blog app created in Gatsby that uses Oracle Content Management" />
        <meta name="BUILD_TAG" content={`${BUILD_TAG}`} />
        <meta name="@oracle/gatsby-source-oce" content={`${SDK_VERSION}`} />
      </Helmet>
      <Header
        companyTitle={toplevel.company_name}
        companyLogoImageObj={companyLogoImageObj}
        aboutUrl={toplevel.about_url}
        contactUrl={toplevel.contact_url}
      />
      {topics && (
        <div id="topics">
          {topics.map((topic) => {
            const topicImageObj = getImageObject(
              oceToFile,
              topic.fields.thumbnail.id,
            );
            return (
              <TopicsListItem
                topic={topic}
                key={topic.id}
                image={topicImageObj}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
