import React, { Component, useState } from 'react';
import { Player } from 'video-react';

function LocalPlayer (props) {
  console.log('props', props)

  const {src, thumb, isLocal, setLocalPlayerRef} = props

  const width = 1600
  const height = 600

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <div style={{ display: (isLocal ? 'None' : 'Block'), backgroundImage: `url(${thumb})`, position: 'relative', height: '30em', backgroundRepeat: 'round' }}>
        <div style={{ position: 'absolute', top: 0,  background: 'black', opacity: .8, height: '100%', minWidth: '100%' }}></div>
        <img src={thumb} style={{ position: 'absolute', left: '40%', paddingTop: '.3em', paddingBottom: '.3em', height: '100%' }}/>
      </div>
      <div style={{ display: (isLocal ? 'Block' : 'None'), position: 'relative', height: '60vh' }}>
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
          width='100%'
          height='100%'
          autoPlay={true}
        >
        <source src={src} />
        </Player>
      </div>
    </div>
  )
}

export default LocalPlayer;
