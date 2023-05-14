import React from 'react'
import Player from '@screens/Player'

// could've just imported directly from previous screen,
// but by doing this, it's just easier to see that the common
// screen "Player" is part of this stack as well as others
const _Player = props => {
  return <Player {...props} />
}

export default _Player