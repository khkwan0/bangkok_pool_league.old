import React from 'react'
import {FlatList, View} from 'react-native'
import PlayerCard from '@components/PlayerCard'
import {Button} from 'react-native-paper'

const Roster = (props: any) => {
  return (
    <FlatList
      ListHeaderComponent={
        <View style={{flexDirection: 'row', padding: 5}}>
          <Button mode="contained" onPress={() => props.cancel()}>Back</Button>
        </View>
      }
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
