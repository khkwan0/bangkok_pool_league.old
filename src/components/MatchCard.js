import React from 'react'
import {View} from 'react-native'
import {Text, TouchableRipple} from 'react-native-paper'
import {DateTime} from 'luxon'

const MatchCard = props => {
  return (
    <View style={{paddingHorizontal: 10}}>
      <TouchableRipple onPress={() => props.handlePress(props.idx)}>
        <View>
          <Text>{props.match.round}</Text>
          <Text variant="headlineSmall" style={{textAlign: 'center'}}>
            {props.match.home_team_short_name} vs{' '}
            {props.match.away_team_short_name}
          </Text>
          <Text variant="titleMedium" style={{textAlign: 'center'}}>
            {DateTime.fromISO(props.match.date).toLocaleString(
              DateTime.DATE_HUGE,
            )}
          </Text>
          <Text>Match ID: {props.match.match_id}</Text>
          <Text>Where:</Text>
          <Text>{props.match.name}</Text>
          <Text>{props.match.location}</Text>
          <Text>
            {props.match.latitude},{props.match.longitude}
          </Text>
          <Text>{props.match.phone}</Text>
        </View>
      </TouchableRipple>
    </View>
  )
}

export default MatchCard
