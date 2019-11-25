import React, { Component, useState } from 'react';
import { Player } from 'video-react';

function LocalPlayer (props) {
  console.log('props', props)

  const {src, thumb, isLocal, setLocalPlayerRef} = props

  return (
    <div style={{ width: '800px', height: '460px', margin: '0 auto' }}>
      <div style={{ display: (isLocal ? 'None' : 'Block'), backgroundImage: `url(${thumb})`, position: 'relative', height: '25em', backgroundRepeat: 'space' }}>
        <div style={{ position: 'absolute', top: 0,  background: 'black', opacity: .8, height: '100%', minWidth: '100%' }}></div>
        <img src={thumb} style={{ position: 'absolute', left: '30%', paddingTop: '.3em', paddingBottom: '.3em', height: '100%' }}/>
      </div>
      <div style={{ display: (isLocal ? 'Block' : 'None') }}>
        <Player
          ref={player => setLocalPlayerRef(player)}
          videoId="video-1"
          preload="auto"
          height={600}
          width={800}
          autoPlay={true}
        >
        <source src={src} />
        </Player>
      </div>
    </div>
  )
}

export default LocalPlayer;
