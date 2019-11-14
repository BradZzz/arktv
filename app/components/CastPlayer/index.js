import React from 'react';

import play from './images/play.png';
import pause from './images/pause.png';
import pauseHover from './images/pause-hover.png';
import pausePress from './images/pause-press.png';
import playHover from './images/play-hover.png';
import playPress from './images/play-press.png';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    castWrap: {
      height: '3em',
      display: 'inline-flex',
      right: 0,
      position: 'absolute',
      margin: '.5em 1em',
    },
    mediaWrap: {
      height: '4em',
      background: '#000000',
      position: 'relative',
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

const demo_media = {
                    title: 'Malcolm in the middle',
                    subtitle: 'Description',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/M/MV5BODQ0NTE3Mjg3N15BMl5BanBnXkFtZTcwNDY2MDMwNw@@._V1_SX300.jpg',
                    url: 'https://s3.amazonaws.com/mytv.media.out.video/tv2/Malcolm_In_The_Middle/0513/index.mp4',
                  }

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

  this.load = function () {
    current_target.load(demo_media);
    console.log('this.target load', current_target)
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
}

function CastPlayer() {
  const classes = useStyles();

  var playerHandler = new PlayerHandler(this);

  var options = {};
  window['__onGCastApiAvailable'] = function (isAvailable) {
    if (isAvailable) {
      options.receiverApplicationId = '72A3C8A4';
      options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
      cast.framework.CastContext.getInstance().setOptions(options);
      var remotePlayer = new cast.framework.RemotePlayer();
      var remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
      remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        function (event) {
        console.log("Connected!")

        remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
          function (event) {
            console.log('CURRENT_TIME_CHANGED', event);
          }.bind(this)
        );

        remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
          function (event) {
            let session = cast.framework.CastContext.getInstance().getCurrentSession();
            if (!session) {
              this.mediaInfo = null;
              this.isLiveContent = false;
//              playerHandler.updateDisplay();
              return;
            }

            let media = session.getMediaSession();
            console.log("media", media)
            if (!media) {
              this.mediaInfo = null;
              this.isLiveContent = false;
//              playerHandler.updateDisplay();
              return;
            }

//            if (media.playerState == PLAYER_STATE.PLAYING && this.playerState !== PLAYER_STATE.PLAYING) {
//              playerHandler.prepareToPlay();
//            }

//            playerHandler.updateDisplay();
          }.bind(this)
        )
        var playerTarget = {}

        playerTarget.getCurrentMediaTime = function () {
          return remotePlayer.currentTime;
        }.bind(this);

        playerTarget.getMediaDuration = function () {
          return remotePlayer.duration;
        }.bind(this);

        playerTarget.seekTo = function (time) {
          remotePlayer.currentTime = time;
          remotePlayerController.seek();
        }.bind(this);

        playerTarget.play = function () {
          if (remotePlayer.isPaused) {
            remotePlayerController.playOrPause();
          }
        }.bind(this);

        playerTarget.pause = function () {
          if (!remotePlayer.isPaused) {
            remotePlayerController.playOrPause();
          }
        }.bind(this);

        playerTarget.load = function (meta) {
//          console.log('Loading...' + this.mediaContents[mediaIndex]['title']);

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
              console.log('Remote media load error: ', errorCode, request)
//                CastPlayer.getErrorMessage(errorCode));
//              playerHandler.updateDisplay();
            }.bind(this));
        }.bind(this);

        playerHandler.setTarget(playerTarget);
        playerHandler.load();
      });
    }
  };

  var handleSeek = (e, val) => {
    console.log("handleSeek", val)
    playerHandler.seekTo((playerHandler.getMediaDuration() / 100) * val)
  }

  return (
    <div>
      <Slider
        defaultValue={0}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        onChange={handleSeek}
        min={0}
        max={100}
      />
      <div className={classes.mediaWrap}>
        <Button id="play" className={classes.play} onClick={ playerHandler.play }/>
        <Button id="pause" className={classes.pause} onClick={ playerHandler.pause }/>
        <div className={classes.castWrap}>
          <google-cast-launcher id="castbutton"></google-cast-launcher>
        </div>
      </div>
    </div>
  );
}

export default CastPlayer;
