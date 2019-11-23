import React, { Component, useState } from 'react';
import { Player } from 'video-react';

function LocalPlayer (props) {
  console.log('props', props)

  const {src, isRemote, setLocalPlayerRef} = props

  return (
    <div style={{ display: (isRemote ? 'None' : 'Block') }}>
      <Player
        ref={player => setLocalPlayerRef(player)}
        videoId="video-1"
        preload="auto"
        autoPlay="true"
      >
      <source src={src} />
      </Player>
    </div>
  )
}

export default LocalPlayer;
