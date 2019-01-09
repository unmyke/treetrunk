import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';

export const MainTemplate = ({ header, children, footer }) => (
  <Grid container spacing={32}>
    {header && (
      <Grid item xs={12}>
        {header}
      </Grid>
    )}
    {children}
    {footer && (
      <Grid item xs={12}>
        {footer}
      </Grid>
    )}
  </Grid>
);

MainTemplate.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

MainTemplate.defaultProps = {
  header: null,
  footer: null,
};
