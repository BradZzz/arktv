/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint no-undef: 0, func-names: 0 */

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

const PlayerHandler = function() {
  let currentTarget = {};

  this.playerState = PLAYER_STATE.IDLE;
  this.currentMedia = {};

  this.setPlayerState = function(state) {
    this.playerState = state;
    console.info('State', state);
  };

  this.setTarget = function(target) {
    currentTarget = target;
  };

  this.play = function() {
    currentTarget.play();
    this.setPlayerState(PLAYER_STATE.PLAYING);
  };

  this.pause = function() {
    currentTarget.pause();
    this.setPlayerState(PLAYER_STATE.PAUSED);
  };

  this.load = function(media) {
    this.currentMedia = media;
    if (currentTarget != null && 'load' in currentTarget) {
      currentTarget.load(media);
    }
  };

  this.getCurrentMediaTime = function() {
    return currentTarget.getCurrentMediaTime();
  };

  this.getMediaDuration = function() {
    return currentTarget.getMediaDuration();
  };

  this.seekTo = function(time) {
    currentTarget.seekTo(time);
  };

  this.setVolume = function(pos) {
    currentTarget.setVolume(pos);
  };
};

/* Everything in here is setup from the start */
const CastWrapper = function() {
  this.playerHandler = new PlayerHandler(this);
  this.playerHandler.lastPosRecorded = 0;

  /* Send the media url through here */
  this.loadMedia = function(media) {
    this.playerHandler.load(media);
  };

  /* Seek bar */
  this.handleSeek = function(val) {
    this.playerHandler.seekTo(val);
  };

  /* Set volume */
  this.handleVolume = function(val) {
    this.playerHandler.setVolume(val / parseFloat(100));
  };

  /* Handle toggle pause */
  this.handlePause = function() {
    this.playerHandler.pause();
  };

  /* Handle play */
  this.handlePlay = function() {
    this.playerHandler.play();
  };

  /* The current media being played */
  this.currentMedia = function() {
    return this.playerHandler.currentMedia;
  };

  /* Reference to the seekbar in the UI so the chromecast can call to it remotely */
  this.setSeekBarRef = function(thisSeek, setSeek) {
    this.playerHandler.thisSeek = thisSeek;
    this.playerHandler.setSeek = setSeek;
  };

  /* Set whether media is playing locally or not */
  this.setIsLocalPlayerRef = function(isLocalPlayer, setIsLocalPlayer) {
    this.playerHandler.isLocalPlayer = isLocalPlayer;
    this.playerHandler.setIsLocalPlayer = setIsLocalPlayer;
  };

  /* Set a reference to the local player here */
  this.setLocalPlayerRef = function(localPlayer) {
    this.playerHandler.localPlayer = localPlayer;
  };

  /* Allows chromecast to pick next show */
  this.setMediaController = function(onSetMedia) {
    this.playerHandler.onSetMedia = onSetMedia;
  };

  /* Sets the current channel for reference */
  this.setChannel = function(channel) {
    this.playerHandler.channel = channel;
  };

  /* Prevents the chromecast from loading another media until the next media loads correctly */
  this.setMediaLoadingFlags = function(loadingMedia, onSelectLoadingMedia) {
    this.playerHandler.loadingMedia = loadingMedia;
    this.playerHandler.onSelectLoadingMedia = onSelectLoadingMedia;
  };

  /* Continue the current channel's media */
  this.setNextChannelMedia = function() {
    this.playerHandler.onSetMedia();
  };

  /* Check to see if the cast player is loaded */
  this.checkLoaded = function() {
    return (
      cast.framework.CastContext.getInstance().getCurrentSession() !== null
    );
  };
};

/* Everything in here needs to be setup in another component */
CastWrapper.prototype.initializeCastPlayer = function() {
  const options = {};

  // Set the receiver application ID to your own (created in the
  // Google Cast Developer Console), or optionally
  // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  options.receiverApplicationId = '72A3C8A4';

  /* Here the local media needs to be set as default */
  if (!chrome.cast) {
    this.setPlayer(false);
    return;
  }

  // Auto join policy can be one of the following three:
  // ORIGIN_SCOPED - Auto connect from same appId and page origin
  // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
  // PAGE_SCOPED - No auto connect
  options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;

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

CastWrapper.prototype.setPlayer = function(isCast) {
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

CastWrapper.prototype.setupRemotePlayer = function() {
  this.remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
    function(event) {
      if (event.value !== 0) {
        this.playerHandler.lastPosRecorded = event.value;
        this.playerHandler.onSelectLoadingMedia(false);
      }
      if (this.remotePlayer.duration > 0) {
        const seekPercent = parseInt(
          (event.value / this.remotePlayer.duration) * 100,
          10,
        );
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
      if ('load' in this.playerHandler.localPlayer) {
        this.playerHandler.localPlayer.load();
      } else {
        console.error('error loading player', this.playerHandler);
      }
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
          this.playerHandler.setPlayerState(PLAYER_STATE.IDLE);
        },
      );
  }.bind(this);

  this.playerHandler.setTarget(playerTarget);
};

export default CastWrapper;
