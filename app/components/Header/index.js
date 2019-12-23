import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';

function Header(props) {
  const { onCloseClick, onOpenClick, showingNav } = props;

  let bView = (
    <ButtonGroup
      size="small"
      aria-label="small outlined button group"
      style={{ display: 'flex', height: '3em' }}
    >
      <Button onClick={onOpenClick} style={{ flex: 1 }}>
        <ExpandLessIcon />
      </Button>
    </ButtonGroup>
  );
  if (showingNav) {
    bView = (
      <ButtonGroup
        size="small"
        aria-label="small outlined button group"
        style={{ display: 'flex', height: '3em' }}
      >
        <Button onClick={onCloseClick} style={{ flex: 1 }}>
          <ExpandMoreIcon />
        </Button>
        <Button href="/" style={{ flex: 1 }}>
          <FormattedMessage {...messages.home} />
        </Button>
        <Button href="/viewer" style={{ flex: 1 }}>
          <FormattedMessage {...messages.viewer} />
        </Button>
        <Button href="/features" style={{ flex: 1 }}>
          <FormattedMessage {...messages.features} />
        </Button>
      </ButtonGroup>
    );
  }

  return <Grid item>{bView}</Grid>;
}

export default Header;
