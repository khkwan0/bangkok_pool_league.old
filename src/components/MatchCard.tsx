import React from 'react'
import {View} from 'react-native'
import {Button} from 'react-native-paper'

const MatchCard = (props: any) => {
  return (
    <View>
      <Button onPress={() => props.handlePress(props.idx)}>
        {props.match.home_team_name} vs {props.match.away_team_name}
      </Button>
    </View>
  )
}

export default MatchCard
