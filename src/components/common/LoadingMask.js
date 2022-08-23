import React from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  mask: {
    position: 'fixed',
    zIndex: 999,
    overflow: 'visible',
    margin: 'auto',
    backgroundColor: 'rgba(0,0,0,0.3)',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    radius: 20,
  },

  center: {
    zIndex: 1000,
    color: 'white',
    position: 'absolute',
    margin: 'auto',
    opacity: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}));

const LoadingMask = () => {
  const classes = useStyles();
  return (
    <div className={classes.mask}>
      <CircularProgress thickness={5} size={60} className={classes.center} />
    </div>
  );
};

export default LoadingMask;
