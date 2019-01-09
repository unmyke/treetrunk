import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';

export const ContainerTemplate = ({ children }) => (
  <Grid item xs={10} align-self="center">
    {children}
  </Grid>
);

ContainerTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};
