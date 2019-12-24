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

import LocalPlayer from '../LocalPlayer';
import {
  setMediaPlayerObject,
  setMediaPlayerAvailable,
  setLoadingMedia,
} from '../../containers/ViewerPage/actions';
import {
  makeSelectPlayerAvailable,
  makeSelectPlayer,
  makeSelectLoadingMedia,
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

/** @enum {string} Constants of states for media for both local and remote playback */
const PLAYER_STATE = {
  // No media is loaded into the player. For remote playback, maps to
  // the PlayerState.IDLE state.
  IDLE: 'IDLE',
  // Player is in PLAY mode but not actively playing content. For remote
  // playback, maps to the PlayerState.BUFFERING state.
  BUFFERING: 'BUFFERING',
  // The media is loaded but not playing.
  LOADED: 'LOADED',
  // The media is playing. For remote playback, maps to the PlayerState.PLAYING state.
  PLAYING: 'PLAYING',
  // The media is paused. For remote playback, maps to the PlayerState.PAUSED state.
  PAUSED: 'PAUSED',
};

const PlayerHandler = () => {
  let currentTarget = {};

  this.playerState = PLAYER_STATE.IDLE;
  this.currentMedia = {};

  this.setTarget = target => {
    currentTarget = target;
  };

  this.play = () => {
    currentTarget.play();
    this.playerState = PLAYER_STATE.PLAYING;
  };

  this.pause = () => {
    currentTarget.pause();
    this.playerState = PLAYER_STATE.PAUSED;
  };

  this.load = media => {
    this.currentMedia = media;
    if (currentTarget != null && 'load' in currentTarget) {
      currentTarget.load(media);
    }
  };

  this.getCurrentMediaTime = () => currentTarget.getCurrentMediaTime();

  this.getMediaDuration = () => currentTarget.getMediaDuration();

  this.seekTo = time => {
    currentTarget.seekTo(time);
  };

  this.setVolume = pos => {
    currentTarget.setVolume(pos);
  };
};

const CastWrapper = () => {
  this.playerHandler = new PlayerHandler(this);
  this.playerHandler.lastPosRecorded = 0;
};

CastWrapper.prototype.initializeCastPlayer = () => {
  const options = {};

  // Set the receiver application ID to your own (created in the
  // Google Cast Developer Console), or optionally
  // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  options.receiverApplicationId = '72A3C8A4';

  // Auto join policy can be one of the following three:
  // ORIGIN_SCOPED - Auto connect from same appId and page origin
  // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
  // PAGE_SCOPED - No auto connect
  options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

  cast.framework.CastContext.getInstance().setOptions(options);

  this.remotePlayer = new cast.framework.RemotePlayer();
  this.remotePlayerController = new cast.framework.RemotePlayerController(
    this.remotePlayer,
  );
  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
    function(e) {
      this.setPlayer(e.value);
    }.bind(this),
  );
  this.setupRemotePlayer();
};

CastWrapper.prototype.setPlayer = isCast => {
  // If the player is remote
  if (isCast) {
    this.playerHandler.setIsLocalPlayer(false);
    this.loadMedia(this.playerHandler.currentMedia);
    if (this.playerHandler.localPlayer) this.playerHandler.localPlayer.pause();
  } else {
    // The player is local
    this.playerHandler.setIsLocalPlayer(true);
    // Start the local playback
    if (this.playerHandler.localPlayer) {
      if (this.playerHandler.localPlayer.getState().player.hasStarted) {
        this.playerHandler.localPlayer.seek(this.playerHandler.lastPosRecorded);
        this.playerHandler.localPlayer.play();
      } else {
        this.playerHandler.localPlayer.load();
      }
    }
  }
};

CastWrapper.prototype.setupRemotePlayer = () => {
  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
    function(event) {
      //      console.log('CURRENT_TIME_CHANGED', event.value);
      //      console.log('duration', this.remotePlayer.duration);
      if (event.value !== 0) {
        this.playerHandler.lastPosRecorded = event.value;
        this.playerHandler.onSelectLoadingMedia(false);
      }
      if (this.remotePlayer.duration > 0) {
        const seekPercent = parseInt(
          (event.value / this.remotePlayer.duration) * 100,
          10,
        );
        //        console.log(
        //          'this.playerHandler.thisSeek != seekPercent',
        //          this.playerHandler.thisSeek,
        //          seekPercent,
        //        );
        if (this.playerHandler.thisSeek !== seekPercent) {
          this.playerHandler.setSeek(seekPercent);
        }
      }
    }.bind(this),
  );

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
    function() {
      const session = cast.framework.CastContext.getInstance().getCurrentSession();
      if (!session) {
        this.mediaInfo = null;
        this.isLiveContent = false;
        return;
      }

      const media = session.getMediaSession();
      //      console.log('media', media);
      if (!media) {
        this.mediaInfo = null;
        this.isLiveContent = false;
      }
    }.bind(this),
  );

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.VIDEO_INFO_CHANGED,
    function(event) {
      console.info('VIDEO_INFO_CHANGED', event);
    },
  );

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
    function(event) {
      console.info('IS_MEDIA_LOADED_CHANGED', event);
      if (!event.value && !this.playerHandler.loadingMedia) {
        console.info('Media Has Ended!');
        this.playerHandler.lastPosRecorded = 0;
        this.setNextChannelMedia();
      } else {
        console.info('Media Has Loaded!');
      }
    }.bind(this),
  );

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.DURATION_CHANGED,
    function(event) {
      console.info('DURATION_CHANGED', event);
    },
  );

  //  this.remotePlayerController.addEventListener(
  //    cast.framework.RemotePlayerEventType.ANY_CHANGE,
  //    function (event) {
  //      console.log('ANY_CHANGE', event);
  //    }.bind(this)
  //  )

  const playerTarget = {};

  playerTarget.getCurrentMediaTime = function() {
    return this.remotePlayer.currentTime;
  }.bind(this);

  playerTarget.getMediaDuration = function() {
    return this.remotePlayer.duration;
  }.bind(this);

  playerTarget.seekTo = function(percent) {
    const seek = (this.remotePlayer.duration / parseFloat(100)) * percent;
    console.info('playerTarget.seekTo', seek);
    this.remotePlayer.currentTime = seek;
    this.remotePlayerController.seek();
  }.bind(this);

  playerTarget.setVolume = function(pos) {
    console.info('playerTarget.setVolume', pos);
    this.remotePlayer.volumeLevel = pos;
    this.remotePlayerController.setVolumeLevel();
  }.bind(this);

  playerTarget.play = function() {
    console.info('playerTarget.play');
    if (this.remotePlayer.isPaused) {
      this.remotePlayerController.playOrPause();
    }
  }.bind(this);

  playerTarget.pause = function() {
    console.info('playerTarget.pause');
    if (!this.remotePlayer.isPaused) {
      this.remotePlayerController.playOrPause();
    }
  }.bind(this);

  playerTarget.load = function(meta) {
    // The remote player isn't available. Load into the local player instead
    if (cast.framework.CastContext.getInstance().getCurrentSession() === null) {
      this.playerHandler.localPlayer.load();
      return;
    }

    const mediaInfo = new chrome.cast.media.MediaInfo(meta.url, 'video/mp4');
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.metadata = new chrome.cast.media.TvShowMediaMetadata();
    mediaInfo.metadata.title = meta.title;
    mediaInfo.metadata.subtitle = meta.subtitle;
    mediaInfo.metadata.images = [
      {
        url: meta.thumb,
      },
    ];

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    if (
      this.playerHandler.localPlayer &&
      this.playerHandler.localPlayer.getState().player.hasStarted
    ) {
      request.currentTime = this.playerHandler.localPlayer.getState().player.currentTime;
      this.playerHandler.localPlayer.seek(0);
    }
    request.autoplay = true;

    cast.framework.CastContext.getInstance()
      .getCurrentSession()
      .loadMedia(request)
      .then(
        function() {
          console.info('Remote media loaded', request);
        },
        function(errorCode) {
          console.error('Cast Error:', errorCode);
          this.playerHandler.playerState = PLAYER_STATE.IDLE;
        },
      );
  }.bind(this);

  this.playerHandler.setTarget(playerTarget);
};

CastWrapper.prototype.checkLoaded = () =>
  cast.framework.CastContext.getInstance().getCurrentSession() !== null;

CastWrapper.prototype.loadMedia = media => {
  this.playerHandler.load(media);
};

CastWrapper.prototype.handleSeek = val => {
  this.playerHandler.seekTo(val);
};

CastWrapper.prototype.handleVolume = val => {
  this.playerHandler.setVolume(val / parseFloat(100));
};

CastWrapper.prototype.handlePause = () => {
  this.playerHandler.pause();
};

CastWrapper.prototype.handlePlay = () => {
  this.playerHandler.play();
};

CastWrapper.prototype.currentMedia = () => this.playerHandler.currentMedia;

CastWrapper.prototype.setSeekBarRef = (thisSeek, setSeek) => {
  this.playerHandler.thisSeek = thisSeek;
  this.playerHandler.setSeek = setSeek;
};

CastWrapper.prototype.setIsLocalPlayerRef = (
  isLocalPlayer,
  setIsLocalPlayer,
) => {
  this.playerHandler.isLocalPlayer = isLocalPlayer;
  this.playerHandler.setIsLocalPlayer = setIsLocalPlayer;
};

CastWrapper.prototype.setLocalPlayerRef = localPlayer => {
  this.playerHandler.localPlayer = localPlayer;
};

CastWrapper.prototype.setMediaController = onSetMedia => {
  this.playerHandler.onSetMedia = onSetMedia;
};

CastWrapper.prototype.setChannel = channel => {
  this.playerHandler.channel = channel;
};

CastWrapper.prototype.setMediaLoadingFlags = (
  loadingMedia,
  onSelectLoadingMedia,
) => {
  this.playerHandler.loadingMedia = loadingMedia;
  this.playerHandler.onSelectLoadingMedia = onSelectLoadingMedia;
};

CastWrapper.prototype.setNextChannelMedia = () => {
  //  console.log("this.playerHandler.channel", this.playerHandler.channel)
  //  var newMedia = this.playerHandler.channel.media[Math.floor(Math.random() * this.playerHandler.channel.media.length)];
  this.playerHandler.onSetMedia();
};

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
  } = props;

  //  console.log('props CastPlayer', props);

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

    /* eslint-disable-next-line no-unused-vars */
    const handleSeek = (e, val) => {
      player.handleSeek(val);
    };

    /* eslint-disable-next-line no-unused-vars */
    const handleVolume = (e, val) => {
      player.handleVolume(val);
    };

    /* eslint-disable-next-line no-unused-vars */
    const handlePause = (e, val) => {
      player.handlePause();
    };

    /* eslint-disable-next-line no-unused-vars */
    const handlePlay = (e, val) => {
      player.handlePlay();
    };

    if (player.currentMedia().url !== curMedia.url) {
      player.loadMedia(curMedia);
    }

    const handleLocalPlayerStateChange = state => {
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
        !player.checkLoaded() &&
        state.ended &&
        hasPlayedLocal &&
        state.currentSrc === curMedia.url
      ) {
        localLoading = true;
        player.setNextChannelMedia();
      }
    };

    if ('subscribeToStateChange' in localPlayer) {
      localPlayer.subscribeToStateChange(handleLocalPlayerStateChange);
    }
  } else {
    const castWrapper = new CastWrapper();
    castWrapper.initializeCastPlayer();
    onSelectPlayer(castWrapper);
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
