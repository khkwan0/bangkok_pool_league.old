import React from 'react'
import {View, Text} from 'react-native'

const MatchCard = (props: any) => {
  console.log('matchcard', props)
  return (
    <View>
      <Text>{props.match.homeId} vs {props.match.awayId}</Text>
    </View>
  )
}

export default MatchCard
