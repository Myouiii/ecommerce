import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { Fab, Zoom, makeStyles, useScrollTrigger } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 11
  }
}));

const ScrollToTop = (props) => {
  const { window } = props;
  const ref = useRef(null);
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: false,
    threshold: 100
  });
  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root} ref={ref}>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
};

export default ScrollToTop;
