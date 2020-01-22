/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint no-undef: 0, func-names: 0 */

import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import play from './images/play.png';
import pause from './images/pause.png';
import pauseHover from './images/pause-hover.png';
import pausePress from './images/pause-press.png';
import playHover from './images/play-hover.png';
import playPress from './images/play-press.png';
import audioOff from './images/audio_off.png';
import audioOn from './images/audio_on.png';

/* Local Player Class */
import LocalPlayer from '../LocalPlayer';

/* Chromecast Class */
import CastWrapper from '../CastWrapper';

import {
  setMediaPlayerObject,
  setMediaPlayerAvailable,
  setLoadingMedia,
} from '../../containers/ViewerPage/actions';
import {
  makeSelectPlayerAvailable,
  makeSelectPlayer,
  makeSelectLoadingMedia,
  makeSelectSignedUrl,
} from '../../containers/ViewerPage/selectors';

const useStyles = makeStyles(() => ({
  castWrap: {
    width: '3em',
    height: '3em',
    display: 'inline-flex',
    right: 0,
    position: 'absolute',
    margin: '.5em 1em',
  },
  mediaWrap: {
    height: '8em',
    background: '#000000',
    position: 'relative',
  },
  audioWrap: {
    right: '5em',
    display: 'inline-flex',
    position: 'absolute',
    width: '12em',
    height: '3em',
    margin: '.5em 1em',
  },
  audioOff: {
    height: '3em',
    width: '3em',
    backgroundPosition: 'center',
    backgroundImage: `url("${audioOff}")`,
  },
  audioOn: {
    height: '3em',
    width: '3em',
    backgroundPosition: 'center',
    backgroundImage: `url("${audioOn}")`,
  },
  audioSlider: {
    margin: '.8em 1em',
  },
  play: {
    height: '3em',
    margin: '1em',
    backgroundImage: `url("${play}")`,
    '&:hover': {
      backgroundImage: `url("${playHover}")`,
    },
    '&:press': {
      backgroundImage: `url("${playPress}")`,
    },
  },
  pause: {
    height: '3em',
    margin: '1em',
    backgroundImage: `url("${pause}")`,
    '&:hover': {
      backgroundImage: `url("${pauseHover}")`,
    },
    '&:press': {
      backgroundImage: `url("${pausePress}")`,
    },
  },
}));

function CastPlayer(props) {
  const {
    selected,
    url,
    player,
    playerAvailable,
    channel,
    onSetMedia,
    loadingMedia,
    onSelectLoadingMedia,
    onSelectPlayer,
  } = props;

  const curMedia = {
    title: selected.Title,
    subtitle: selected.Plot,
    thumb: selected.Poster,
    url,
  };

  const [seek, setSeek] = useState(0);
  const [isLocalPlayer, setIsLocalPlayer] = useState(true);
  const [localPlayer, setLocalPlayerRef] = useState(React.createRef());
  let localLoading = false;
  let hasPlayedLocal = false;
  const classes = useStyles();

  /* eslint-disable-next-line no-unused-vars */
  const handleSeek = (e, val) => {
    if (player) player.handleSeek(val);
  };

  /* eslint-disable-next-line no-unused-vars */
  const handleVolume = (e, val) => {
    if (player) player.handleVolume(val);
  };

  /* eslint-disable-next-line no-unused-vars */
  const handlePause = (e, val) => {
    if (player) player.handlePause();
  };

  /* eslint-disable-next-line no-unused-vars */
  const handlePlay = (e, val) => {
    if (player) player.handlePlay();
  };

  if (playerAvailable) {
    // For the chromecast to access the seekbar locally and movie it with media
    player.setSeekBarRef(seek, setSeek);
    // A reference to the localplayer, so that chromecast can move it's seek and play when chromecast is stopped
    player.setLocalPlayerRef(localPlayer);
    // Shows chromecast when the local player is active and when it isn't
    player.setIsLocalPlayerRef(isLocalPlayer, setIsLocalPlayer);
    // Allows the chromecast to pick the next show
    player.setMediaController(onSetMedia);
    // Allows the chromecast to change channels
    player.setChannel(channel);
    // Prevents the chromecast from loading another media until the next media loads correctly
    player.setMediaLoadingFlags(loadingMedia, onSelectLoadingMedia);

    if (player.currentMedia().url !== curMedia.url) {
      player.loadMedia(curMedia);
    }

    /* Local player handler */
    if (localPlayer && 'subscribeToStateChange' in localPlayer) {
      const handleLocalPlayerStateChange = function(state) {
        if (
          state.duration !== state.currentTime &&
          state.currentTime > 0 &&
          state.duration > 0
        ) {
          hasPlayedLocal = true;
          onSelectLoadingMedia(false);
        }
        if (
          !localLoading &&
          playerAvailable &&
          !player.checkLoaded() &&
          state.ended &&
          hasPlayedLocal &&
          state.currentSrc === curMedia.url
        ) {
          localLoading = true;
          player.setNextChannelMedia();
        }
      };
      localPlayer.subscribeToStateChange(handleLocalPlayerStateChange);
    }
  } else {
    const castWrapper = new CastWrapper();
    // Run the init to setup the player locally first.
    castWrapper.initializeCastPlayer();
    onSelectPlayer(castWrapper);

    // If the chromecast becomes available after load,
    // run init again to resync
    /* eslint-disable-next-line no-underscore-dangle */
    window.__onGCastApiAvailable = function(isAvailable) {
      if (isAvailable) {
        castWrapper.initializeCastPlayer();
        onSelectPlayer(castWrapper);
      } else {
        console.error('error loading chromecast');
      }
    };
  }

  return (
    <div style={{ width: '100%' }}>
      <LocalPlayer
        channel={channel}
        onSetMedia={onSetMedia}
        thumb={curMedia.thumb}
        src={curMedia.url}
        setLocalPlayerRef={setLocalPlayerRef}
        isLocal={isLocalPlayer}
      />
      <div
        className={classes.mediaWrap}
        style={{ border: '.5em solid red', width: '100%' }}
      >
        <div style={{ margin: '.2em', padding: '0 .8em' }}>
          <Slider
            defaultValue={0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            onChange={handleSeek}
            min={0}
            max={100}
            value={seek}
            style={{ display: isLocalPlayer ? 'None' : 'Block' }}
          />
        </div>
        <div style={{ display: 'inline-flex' }}>
          <Button
            id="play"
            className={classes.play}
            onClick={handlePlay}
            style={{ display: isLocalPlayer ? 'None' : 'Block' }}
          />
          <Button
            id="pause"
            className={classes.pause}
            onClick={handlePause}
            style={{ display: isLocalPlayer ? 'None' : 'Block' }}
          />
          <div
            className={classes.audioWrap}
            style={{ display: isLocalPlayer ? 'None' : 'flex' }}
          >
            <div className={classes.audioOff} />
            <Slider
              defaultValue={0}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              onChange={handleVolume}
              className={classes.audioSlider}
              min={0}
              max={100}
            />
            <div className={classes.audioOn} />
          </div>
          <div className={classes.castWrap}>
            <google-cast-launcher id="castbutton" />
          </div>
        </div>
      </div>
    </div>
  );
}

CastPlayer.defaultProps = {
  selected: {},
  url: '',
};

CastPlayer.propTypes = {
  onSelectLoadingMedia: PropTypes.func,
  selected: PropTypes.object,
  playerAvailable: PropTypes.bool,
  player: PropTypes.object,
  url: PropTypes.string,
  loadingMedia: PropTypes.bool,
  channel: PropTypes.object,
  onSetMedia: PropTypes.func,
  onSelectPlayer: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  playerAvailable: makeSelectPlayerAvailable(),
  player: makeSelectPlayer(),
  url: makeSelectSignedUrl(),
  loadingMedia: makeSelectLoadingMedia(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSelectAvailable: avail => dispatch(setMediaPlayerAvailable(avail)),
    onSelectPlayer: player => dispatch(setMediaPlayerObject(player)),
    onSelectLoadingMedia: loading => dispatch(setLoadingMedia(loading)),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CastPlayer);
