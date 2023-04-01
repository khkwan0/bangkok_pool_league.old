import React from 'react'
import {View} from 'react-native'
import {Button, Text} from 'react-native-paper'

const PlayerCard = (props: any) => {
  function HandleSelect(playerId: number) {
    props.handleSelect(props.frameInfo, playerId)
  }

  return (
    <View
      style={[
        {flexDirection: 'row', alignItems: 'center', padding: 10},
        props.idx % 2 !== 0 ? {backgroundColor: '#0000ff22'} : {},
      ]}>
      <View style={{flex: 1.5}}>
        <Text variant="bodyLarge">{props.player.nickname}</Text>
      </View>
      <View style={{flex: 1}}>
        <Button
          mode="outlined"
          onPress={() => HandleSelect(props.player.playerId)}>
          Select
        </Button>
      </View>
    </View>
  )
}

export default PlayerCard
