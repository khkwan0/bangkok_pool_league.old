import React from 'react'
import {View} from 'react-native'
import {Button, Text} from 'react-native-paper'

const PlayerCard = (props: any) => {
  function HandleSelect(playerId: number) {
    props.handleSelect(props.frameInfo, playerId)
  }

  return (
    <View>
      <Text>{props.player.firstName}</Text>
      <Button onPress={() => HandleSelect(props.player.playerId)}>
        Select
      </Button>
    </View>
  )
}

export default PlayerCard
