import React from 'react'
import {FlatList} from 'react-native'
import PlayerCard from '@components/PlayerCard'

const Roster = (props: any) => {
  return (
    <FlatList
      data={props.team.players}
      renderItem={({item}) => (
        <PlayerCard
          player={item}
          handleSelect={props.handleSelect}
          frameInfo={props.frameInfo}
        />
      )}
    />
  )
}

export default Roster
