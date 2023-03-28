import React from 'react'
import {View, Text} from 'react-native'
import {Button} from 'react-native-paper'

const MatchCard = (props: any) => {
  return (
    <View>
      <Button onPress={() => props.setMatchIdx(props.idx)}>
        {props.match.homeId} vs {props.match.awayId}
      </Button>
    </View>
  )
}

export default MatchCard
