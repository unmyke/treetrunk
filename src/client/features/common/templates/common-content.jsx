import React from 'react';
import PropTypes from 'prop-types';

import { MainTemplate } from '@ui/templates';
import { Header, Footer } from '../organizms';
import { ContainerTemplate } from './container';

export const CommonContentTemplate = ({ header, children, footer }) => (
  <MainTemplate header={header} footer={footer}>
    <ContainerTemplate>{children}</ContainerTemplate>
  </MainTemplate>
);

CommonContentTemplate.propTypes = {
  // header: PropTypes.node,
  // children: PropTypes.node.isRequired,
  // footer: PropTypes.node,
};

CommonContentTemplate.defaultProps = {
  // header: <Header />,
  // footer: <Footer />,
};
