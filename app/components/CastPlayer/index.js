import React, { useState } from 'react';

import play from './images/play.png';
import pause from './images/pause.png';
import pauseHover from './images/pause-hover.png';
import pausePress from './images/pause-press.png';
import playHover from './images/play-hover.png';
import playPress from './images/play-press.png';
import audioOff from './images/audio_off.png';
import audioOn from './images/audio_on.png';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Player } from 'video-react';

import LocalPlayer from '../LocalPlayer';
import { setMediaPlayerObject, setMediaPlayerAvailable, setLoadingMedia } from '../../containers/ViewerPage/actions';
import { makeSelectPlayerAvailable, makeSelectCurrentMedia, makeSelectSignedUrl, makeSelectPlayer, makeSelectLoadingMedia } from '../../containers/ViewerPage/selectors';

const useStyles = makeStyles(theme => {
  return {
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
      backgroundImage: 'url("' + audioOff + '")',
    },
    audioOn: {
      height: '3em',
      width: '3em',
      backgroundPosition: 'center',
      backgroundImage: 'url("' + audioOn + '")',
    },
    audioSlider: {
      margin: '.8em 1em'
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
  PAUSED: 'PAUSED'
};

let playerState = PLAYER_STATE.IDLE;

var PlayerHandler = function (player) {
  let current_target = {};
  this.currentMedia = {}

  this.setTarget = function (target) {
    current_target = target;
  };

  this.play = function () {
    console.log('this.target play', current_target)
    current_target.play();
    playerState = PLAYER_STATE.PLAYING;
  };

  this.pause = function () {
    console.log('this.target pause', current_target)
    current_target.pause();
    playerState = PLAYER_STATE.PAUSED;
  };

  this.load = function (media) {
    console.log("loading...", media, current_target)
    this.currentMedia = media
    if (current_target != null && 'load' in current_target) {
      current_target.load(media);
      console.log('this.target load', current_target)
    }
  };

  this.getCurrentMediaTime = function () {
    console.log("current_target.getCurrentMediaTime()", current_target)
    return current_target.getCurrentMediaTime();
  };

  this.getMediaDuration = function () {
    console.log("current_target.getMediaDuration()", current_target)
    return current_target.getMediaDuration();
  };

  this.seekTo = function (time) {
    current_target.seekTo(time);
  };

  this.setVolume = function (pos) {
    current_target.setVolume(pos);
  };
}

var CastWrapper = function () {
  this.playerHandler = new PlayerHandler(this);
  this.playerHandler.lastPosRecorded = 0
}

CastWrapper.prototype.initializeCastPlayer = function () {
  var options = {};

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
  this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
    function (e) {
      this.setPlayer(e.value)
    }.bind(this)
  );
  this.setupRemotePlayer();
};

CastWrapper.prototype.setPlayer = function(isCast) {
  // If the player is remote
  if (isCast) {
    this.playerHandler.setIsLocalPlayer(false)
    this.loadMedia(this.playerHandler.currentMedia)
    if (this.playerHandler.localPlayer)
      this.playerHandler.localPlayer.pause()
  } else {
  //The player is local
    this.playerHandler.setIsLocalPlayer(true)
    //Start the local playback
    if (this.playerHandler.localPlayer) {
      if (this.playerHandler.localPlayer.getState().player.hasStarted) {
        this.playerHandler.localPlayer.seek(this.playerHandler.lastPosRecorded)
        this.playerHandler.localPlayer.play()
      } else {
        this.playerHandler.localPlayer.load()
      }
    }
  }
}

CastWrapper.prototype.setupRemotePlayer = function() {
  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
    function (event) {
      console.log('CURRENT_TIME_CHANGED', event.value);
      console.log('duration', this.remotePlayer.duration);
      if (event.value !== 0) {
        this.playerHandler.lastPosRecorded = event.value
        this.playerHandler.onSelectLoadingMedia(false)
      }
      if (this.remotePlayer.duration > 0){
        const seekPercent = parseInt((event.value / this.remotePlayer.duration) * 100)
        console.log("this.playerHandler.thisSeek != seekPercent", this.playerHandler.thisSeek, seekPercent)
        if (this.playerHandler.thisSeek != seekPercent) {
          this.playerHandler.setSeek(seekPercent)
        }
      }
    }.bind(this)
  );

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
    function (event) {
      let session = cast.framework.CastContext.getInstance().getCurrentSession();
      if (!session) {
        this.mediaInfo = null;
        this.isLiveContent = false;
        return;
      }

      let media = session.getMediaSession();
      console.log("media", media)
      if (!media) {
        this.mediaInfo = null;
        this.isLiveContent = false;
        return;
      }
    }.bind(this)
  )

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.VIDEO_INFO_CHANGED,
    function (event) {
      console.log('VIDEO_INFO_CHANGED', event);
    }.bind(this)
  )

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
    function (event) {
      console.log('IS_MEDIA_LOADED_CHANGED', event, this.playerHandler);
      if (!event.value && !this.playerHandler.loadingMedia) {
        console.log('Media Has Ended!');
        this.playerHandler.lastPosRecorded = 0
        this.setNextChannelMedia()
      } else {
        console.log('Media Has Loaded!');
//        this.playerHandler.onSelectLoadingMedia(false)
      }
    }.bind(this)
  )

  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.DURATION_CHANGED,
    function (event) {
      console.log('DURATION_CHANGED', event);
    }.bind(this)
  )

//  this.remotePlayerController.addEventListener(
//    cast.framework.RemotePlayerEventType.ANY_CHANGE,
//    function (event) {
//      console.log('ANY_CHANGE', event);
//    }.bind(this)
//  )

  var playerTarget = {}

  playerTarget.getCurrentMediaTime = function () {
    return this.remotePlayer.currentTime;
  }.bind(this);

  playerTarget.getMediaDuration = function () {
    return this.remotePlayer.duration;
  }.bind(this);

  playerTarget.seekTo = function (percent) {
    console.log("playerTarget.seekTo", percent)
    console.log("playerHandler.getMediaDuration()", this.remotePlayer.duration)
    console.log("remotePlayer", this.remotePlayer)
    var seek = (this.remotePlayer.duration / parseFloat(100)) * percent
    console.log("playerTarget.seekTo", seek)
    this.remotePlayer.currentTime = seek;
    this.remotePlayerController.seek();
  }.bind(this);

  playerTarget.setVolume = function (pos) {
    console.log("playerTarget.setVolume", pos)
    this.remotePlayer.volumeLevel = pos;
    this.remotePlayerController.setVolumeLevel();
  }.bind(this);

  playerTarget.play = function () {
    console.log("playerTarget.play")
    if (this.remotePlayer.isPaused) {
      this.remotePlayerController.playOrPause();
    }
  }.bind(this);

  playerTarget.pause = function () {
    console.log("playerTarget.pause")
    if (!this.remotePlayer.isPaused) {
      this.remotePlayerController.playOrPause();
    }
  }.bind(this);

  playerTarget.load = function (meta) {
    // The remote player isn't available. Load into the local player instead
    if (cast.framework.CastContext.getInstance().getCurrentSession() === null) {
      this.playerHandler.localPlayer.load()
      return
    }

    let mediaInfo = new chrome.cast.media.MediaInfo(meta.url, 'video/mp4');
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.metadata = new chrome.cast.media.TvShowMediaMetadata();
    mediaInfo.metadata.title = meta.title;
    mediaInfo.metadata.subtitle = meta.subtitle;
    mediaInfo.metadata.images = [{
      'url': meta.thumb
    }];

    let request = new chrome.cast.media.LoadRequest(mediaInfo);
    if (this.playerHandler.localPlayer && this.playerHandler.localPlayer.getState().player.hasStarted) {
      request.currentTime = this.playerHandler.localPlayer.getState().player.currentTime
    }
    request.autoplay = true;

    cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request).then(
      function () {
        console.log('Remote media loaded', request);
      }.bind(this),
      function (errorCode) {
        playerState = PLAYER_STATE.IDLE;
      }.bind(this));
  }.bind(this);

  this.playerHandler.setTarget(playerTarget);
}

CastWrapper.prototype.checkLoaded = function () {
  return cast.framework.CastContext.getInstance().getCurrentSession() !== null
}

CastWrapper.prototype.loadMedia = function (media) {
  console.log("Loaded", this.checkLoaded())
  this.playerHandler.load(media);
}

CastWrapper.prototype.handleSeek = function (val) {
  this.playerHandler.seekTo(val)
}

CastWrapper.prototype.handleVolume = function (val) {
  this.playerHandler.setVolume(val / parseFloat(100))
}

CastWrapper.prototype.handlePause = function () {
  this.playerHandler.pause()
}

CastWrapper.prototype.handlePlay = function () {
  this.playerHandler.play()
}

CastWrapper.prototype.currentMedia = function () {
  return this.playerHandler.currentMedia
}

CastWrapper.prototype.setSeekBarRef = function (thisSeek, setSeek) {
  this.playerHandler.thisSeek = thisSeek;
  this.playerHandler.setSeek = setSeek;
}

CastWrapper.prototype.setIsLocalPlayerRef = function (isLocalPlayer, setIsLocalPlayer) {
  this.playerHandler.isLocalPlayer = isLocalPlayer;
  this.playerHandler.setIsLocalPlayer = setIsLocalPlayer;
}

CastWrapper.prototype.setLocalPlayerRef = function (localPlayer) {
  this.playerHandler.localPlayer = localPlayer;
}

CastWrapper.prototype.setMediaController = function (onSetMedia) {
  this.playerHandler.onSetMedia = onSetMedia
}

CastWrapper.prototype.setChannel = function (channel) {
  this.playerHandler.channel = channel
}

CastWrapper.prototype.setMediaLoadingFlags = function (loadingMedia, onSelectLoadingMedia) {
  this.playerHandler.loadingMedia = loadingMedia
  this.playerHandler.onSelectLoadingMedia = onSelectLoadingMedia
}

CastWrapper.prototype.setNextChannelMedia = function () {
//  console.log("this.playerHandler.channel", this.playerHandler.channel)
//  var newMedia = this.playerHandler.channel.media[Math.floor(Math.random() * this.playerHandler.channel.media.length)];
  this.playerHandler.onSetMedia();
}


function CastPlayer(props) {
  const { selected, url, onSelectAvailable, onSelectPlayer, player, playerAvailable, channel, onSetMedia, loadingMedia, onSelectLoadingMedia } = props

  console.log("props CastPlayer", props)

  const curMedia = {
                      title: selected.Title,
                      subtitle: selected.Plot,
                      thumb: selected.Poster,
                      url: url,
                    }

  const [seek, setSeek] = useState(0);
  const [isLocalPlayer, setIsLocalPlayer] = useState(true);
  const [localPlayer, setLocalPlayerRef] = useState(React.createRef());
  let localLoading = false
  let hasPlayedLocal = false

  const classes = useStyles();

  if (playerAvailable) {
    // For the chromecast to access the seekbar locally and movie it with media
    player.setSeekBarRef(seek, setSeek)
    // A reference to the localplayer, so that chromecast can move it's seek and play when chromecast is stopped
    player.setLocalPlayerRef(localPlayer)
    // Shows chromecast when the local player is active and when it isn't
    player.setIsLocalPlayerRef(isLocalPlayer, setIsLocalPlayer)
    // Allows the chromecast to pick the next show
    player.setMediaController(onSetMedia)
    // Allows the chromecast to change channels
    player.setChannel(channel)
    // Prevents the chromecast from loading another media until the next media loads correctly
    player.setMediaLoadingFlags(loadingMedia, onSelectLoadingMedia)

    var handleSeek = (e, val) => {
      console.log("handleSeek", val)
      player.handleSeek(val)
    }

    var handleVolume = (e, val) => {
      console.log("handleVolume", val)
      player.handleVolume(val)
    }

    var handlePause = (e, val) => {
      console.log("handlePause")
      player.handlePause()
    }

    var handlePlay = (e, val) => {
      console.log("handlePlay")
      player.handlePlay()
    }

    if (player.currentMedia().url != curMedia.url) {
      player.loadMedia(curMedia)
    }

    const handleLocalPlayerStateChange = function(state, prevState) {
      if (state.duration !== state.currentTime && state.currentTime > 0 && state.duration > 0) {
        hasPlayedLocal = true
        onSelectLoadingMedia(false)
      }
      if (!localLoading && !player.checkLoaded() && state.ended && hasPlayedLocal && state.currentSrc === curMedia.url) {
        console.log("handleLocalPlayerStateChange", state, prevState)
        localLoading = true
        player.setNextChannelMedia()
      }
    }

    if ('subscribeToStateChange' in localPlayer) {
      localPlayer.subscribeToStateChange(handleLocalPlayerStateChange);
    }
  } else {
    var castWrapper = new CastWrapper()
    castWrapper.initializeCastPlayer()
    onSelectPlayer(castWrapper)
  }

  return (
    <div style={{ width: '100%' }}>
      <LocalPlayer channel={channel} onSetMedia={onSetMedia} thumb={curMedia.thumb} src={curMedia.url} setLocalPlayerRef={setLocalPlayerRef} isLocal={isLocalPlayer}/>
      <div className={classes.mediaWrap} style={{ border: '.5em solid red', width: '100%' }}>
        <div style={{ margin: '.2em', padding: '0 .8em' }}>
          <Slider
            defaultValue={0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            onChange={handleSeek}
            min={0}
            max={100}
            value={seek}
            style={{ display: (isLocalPlayer ? 'None' : 'Block') }}
          />
        </div>
        <div style={{ display: 'inline-flex' }}>
          <Button id="play" className={classes.play} onClick={ handlePlay } style={{ display: (isLocalPlayer ? 'None' : 'Block') }}/>
          <Button id="pause" className={classes.pause} onClick={ handlePause } style={{ display: (isLocalPlayer ? 'None' : 'Block') }}/>
          <div className={classes.audioWrap} style={{ display: (isLocalPlayer ? 'None' : 'flex') }}>
            <div className={classes.audioOff}></div>
            <Slider
              defaultValue={0}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              onChange={handleVolume}
              className={classes.audioSlider}
              min={0}
              max={100}
            />
            <div className={classes.audioOn}></div>
          </div>
          <div className={classes.castWrap}>
            <google-cast-launcher id="castbutton"></google-cast-launcher>
          </div>
        </div>
      </div>
    </div>
  );
}

CastPlayer.defaultProps = {
  onSelectAvailable: () => {},
  selected: {},
  url: '',
};

CastPlayer.propTypes = {
  onSelectAvailable: PropTypes.func,
  onSelectLoadingMedia: PropTypes.func,
  selected: PropTypes.object,
  playerAvailable: PropTypes.bool,
  player: PropTypes.object,
  url: PropTypes.string,
  loadingMedia: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  playerAvailable: makeSelectPlayerAvailable(),
  player: makeSelectPlayer(),
  url: makeSelectSignedUrl(),
  loadingMedia: makeSelectLoadingMedia(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onSelectAvailable: avail => dispatch(setMediaPlayerAvailable(avail)),
    onSelectPlayer: player => dispatch(setMediaPlayerObject(player)),
    onSelectLoadingMedia: loading => dispatch(setLoadingMedia(loading)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);
