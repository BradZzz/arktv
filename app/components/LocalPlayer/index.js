// @import "~video-react/styles/scss/video-react"; // or import scss

import React from 'react';
import { Player } from 'video-react';
import PropTypes from 'prop-types';

function LocalPlayer(props) {
  const { src, thumb, isLocal, setLocalPlayerRef } = props;

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <div
        style={{
          display: isLocal ? 'None' : 'Block',
          backgroundImage: `url(${thumb})`,
          position: 'relative',
          height: '30em',
          backgroundRepeat: 'round',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            background: 'black',
            opacity: 0.8,
            height: '100%',
            minWidth: '100%',
          }}
        />
        <img
          alt="now casting"
          src={thumb}
          style={{
            position: 'absolute',
            left: '40%',
            paddingTop: '.3em',
            paddingBottom: '.3em',
            height: '100%',
          }}
        />
      </div>
      <div
        style={{
          display: isLocal ? 'Block' : 'None',
          position: 'relative',
          height: '60vh',
        }}
      >
        <Player
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          playsInline
          ref={player => setLocalPlayerRef(player)}
          videoId="video-1"
          preload="auto"
          fluid={false}
          width="100%"
          height="100%"
          autoPlay
        >
          <source src={src} />
        </Player>
      </div>
    </div>
  );
}

LocalPlayer.propTypes = {
  src: PropTypes.string,
  thumb: PropTypes.string,
  isLocal: PropTypes.bool,
  setLocalPlayerRef: PropTypes.func,
};

export default LocalPlayer;
