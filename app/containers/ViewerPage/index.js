/*
 * FeaturePage
 *
 * List all the features
 */
import React, { useState, memo } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import CastPlayer from 'components/CastPlayer';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
// import CastPlayer from './Cast';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import CollectionsIcon from '@material-ui/icons/Collections';
import Grid from '@material-ui/core/Grid';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import TvIcon from '@material-ui/icons/Tv';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import playPress from './images/play-press.png';
import playHover from './images/play-hover.png';
import pausePress from './images/pause-press.png';
import pauseHover from './images/pause-hover.png';
import pause from './images/pause.png';
import play from './images/play.png';
import messages from './messages';

import {
  makeSelectCurrentMedia,
  makeSelectMedia,
  makeSelectChannels,
  makeSelectCurrentChannel,
  makeSelectEpisode,
} from './selectors';
import { checkMedia, checkNextMedia, setChannel, setShow } from './actions';
import { initialState } from './reducer';

// const useStyles = makeStyles(theme => {
//  return {
//    fab: {
//      margin: theme.spacing(1),
//    },
//    mediaWrap: {
//      height: '4em',
//      background: '#000000',
//    },
//    play: {
//      height: '3em',
//      margin: '1em',
//      backgroundImage: 'url("' + play + '")',
//      '&:hover': {
//        backgroundImage: 'url("' + playHover + '")',
//      },
//      '&:press': {
//        backgroundImage: 'url("' + playPress + '")',
//      },
//    },
//    pause: {
//      height: '3em',
//      margin: '1em',
//      backgroundImage: 'url("' + pause + '")',
//      '&:hover': {
//        backgroundImage: 'url("' + pauseHover + '")',
//      },
//      '&:press': {
//        backgroundImage: 'url("' + pausePress + '")',
//      },
//    },
//  };
// });

export function ViewerPage(props) {
  //  const classes = useStyles();

  console.log('props ViewerPage', props);

  const {
    media,
    channels,
    selectedChannel,
    onCheckMedia,
    onSetMedia,
    onSetChannel,
    onSetShow,
    selected,
    episode,
  } = props;

  onCheckMedia();

  return (
    <div>
      <Helmet>
        <title>ArkTv2</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <div style={{ display: 'flex' }}>
        <CastPlayer
          selected={selected}
          channel={selectedChannel}
          onSetMedia={onSetMedia}
        />
      </div>
    </div>
  );
}

ViewerPage.propTypes = {
  media: PropTypes.array,
  channels: PropTypes.array,
  selectedChannel: PropTypes.object,
  onCheckMedia: PropTypes.func,
  onSetMedia: PropTypes.func,
  onSetChannel: PropTypes.func,
  onSelectLoadingMedia: PropTypes.func,
  onSetShow: PropTypes.func,
  episode: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  media: makeSelectMedia(),
  selectedChannel: makeSelectCurrentChannel(),
  channels: makeSelectChannels(),
  selected: makeSelectCurrentMedia(),
  episode: makeSelectEpisode(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onCheckMedia: () => dispatch(checkMedia()),
    onSetMedia: () => dispatch(checkNextMedia()),
    onSetShow: media => dispatch(setShow(media)),
    onSetChannel: channel => dispatch(setChannel(channel)),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerPage);
