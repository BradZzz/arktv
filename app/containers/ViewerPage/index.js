/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import CastPlayer from 'components/CastPlayer';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';
//import CastPlayer from './Cast';

import play from './images/play.png';
import pause from './images/pause.png';
import pauseHover from './images/pause-hover.png';
import pausePress from './images/pause-press.png';
import playHover from './images/play-hover.png';
import playPress from './images/play-press.png';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    mediaWrap: {
      height: '4em',
      background: '#000000',
    },
    play: {
      height: '3em',
      margin: '1em',
      backgroundImage: 'url("' + play + '")',
      '&:hover': {
        backgroundImage: 'url("' + playHover + '")',
      },
      '&:press': {
        backgroundImage: 'url("' + playPress + '")',
      },
    },
    pause: {
      height: '3em',
      margin: '1em',
      backgroundImage: 'url("' + pause + '")',
      '&:hover': {
        backgroundImage: 'url("' + pauseHover + '")',
      },
      '&:press': {
        backgroundImage: 'url("' + pausePress + '")',
      },
    },
  };
});

export default function ViewerPage() {
  const classes = useStyles();

  let player = (<></>)
  window['__onGCastApiAvailable'] = function (isAvailable) {
    if (isAvailable) {
      console.log('available')
      player = (<CastPlayer/>)
    }
  };

  return (
    <div>
      <Helmet>
        <title>Viewer Page</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <CastPlayer/>
    </div>
  )
}
