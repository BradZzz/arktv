import React from 'react';

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

import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { setMediaPlayerAvailable } from '../../containers/ViewerPage/actions';
import { makeSelectPlayerAvailable, makeSelectCurrentMedia, makeSelectSignedUrl } from '../../containers/ViewerPage/selectors';

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

  this.initializeCastPlayer = function () {
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
//      this.switchPlayer(e.value);
      console.log("switchPlayer")
    }.bind(this)
  );
  };

  this.setupRemotePlayer = function() {
  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
    function (event) {
      console.log('CURRENT_TIME_CHANGED', event);
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
  var playerTarget = {}

  playerTarget.getCurrentMediaTime = function () {
    return this.remotePlayer.currentTime;
  }.bind(this);

  playerTarget.getMediaDuration = function () {
    return this.remotePlayer.duration;
  }.bind(this);

  playerTarget.seekTo = function (percent) {
    console.log("playerTarget.seekTo", percent)
    console.log("playerHandler.getMediaDuration()", remotePlayer.duration)
    console.log("remotePlayer", remotePlayer)
    var seek = (remotePlayer.duration / parseFloat(100)) * percent
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
    if (cast.framework.CastContext.getInstance().getCurrentSession() === null)
      return

    let mediaInfo = new chrome.cast.media.MediaInfo(meta.url, 'video/mp4');
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.metadata = new chrome.cast.media.TvShowMediaMetadata();
    mediaInfo.metadata.title = meta.title;
    mediaInfo.metadata.subtitle = meta.subtitle;
    mediaInfo.metadata.images = [{
      'url': meta.thumb
    }];

    let request = new chrome.cast.media.LoadRequest(mediaInfo);
//          request.currentTime = this.currentMediaTime;

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

  this.loadMedia = function (media) {
    this.playerHandler.load(media);
  }

  this.handleSeek = function (val) {
    this.playerHandler.seekTo(val)
  }

  this.handleVolume = function (val) {
    this.playerHandler.setVolume(val / parseFloat(100))
  }

  this.handlePause = function () {
    this.playerHandler.pause()
  }

  this.handlePlay = function () {
    this.playerHandler.play()
  }
}

export default new CastWrapper()

//module.exports = new CastWrapper()
