import React from 'react'
import {FlatList, View} from 'react-native'
import PlayerCard from '@components/PlayerCard'
import {Button} from 'react-native-paper'

const Roster = (props: any) => {
  return (
    <FlatList
      ItemSeparatorComponent={<View style={{marginVertical: 5}} />}
      ListHeaderComponent={
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 5,
            justifyContent: 'flex-end',
            paddingBottom: 10,
          }}>
          <Button icon="close" mode="contained" onPress={() => props.cancel()}>
            Close
          </Button>
        </View>
      }
      stickyHeaderIndices={[0]}
      data={props.players}
      renderItem={({item, index}) => (
        <PlayerCard
          idx={index}
          player={item}
          handleSelect={props.handleSelect}
          frameInfo={props.frameInfo}
        />
      )}
    />
  )
}

export default Roster
