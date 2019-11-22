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
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
//import CastPlayer from './Cast';

import play from './images/play.png';
import pause from './images/pause.png';
import pauseHover from './images/pause-hover.png';
import pausePress from './images/pause-press.png';
import playHover from './images/play-hover.png';
import playPress from './images/play-press.png';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { makeSelectMedia } from './selectors';
import { checkMedia, setMedia } from './actions';

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

export function ViewerPage(props) {
  const classes = useStyles();

  console.log("props", props)

  const { media, onCheckMedia, onSetMedia } = props

  onCheckMedia()

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
      { media.map(med => (
        <div key={ med.imdbID } onClick={() => onSetMedia(med)} style={{ height: '5em', display: 'flex', background: 'antiquewhite', border: '.2em solid black', margin: '1em', padding: '.2em', cursor: 'pointer' }}>
          <img src={med.Poster} style={{ height: '100%', maxWidth: '4em' }}/>
          <span>
            { med.Title }
          </span>
        </div>
      )) }
    </div>
  )
}

ViewerPage.propTypes = {
  media: PropTypes.array,
  onCheckMedia: PropTypes.func,
  onSetMedia: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  media: makeSelectMedia(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
    onSetMedia: (media) => dispatch(setMedia(media)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerPage);
