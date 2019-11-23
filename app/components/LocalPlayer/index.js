import React, { Component, useState } from 'react';
import { Player } from 'video-react';

function LocalPlayer (props) {
  console.log('props', props)

  const {src, thumb, isLocal, setLocalPlayerRef} = props

  return (
    <div>
      <img src={thumb} style={{ display: (isLocal ? 'None' : 'Block') }}/>
      <div style={{ display: (isLocal ? 'Block' : 'None') }}>
        <Player
          ref={player => setLocalPlayerRef(player)}
          videoId="video-1"
          preload="auto"
          autoPlay={true}
        >
        <source src={src} />
        </Player>
      </div>
    </div>
  )
}

export default LocalPlayer;
