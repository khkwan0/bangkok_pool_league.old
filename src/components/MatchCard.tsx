import React from 'react'
import {View, Pressable} from 'react-native'
import {Button, Text} from 'react-native-paper'
import {DateTime} from 'luxon'

const MatchCard = (props: any) => {
  return (
    <View>
      <Pressable
        onPress={() => props.handlePress(props.idx)}
        style={({pressed}) => (pressed ? {backgroundColor: '#0000ff54'} : '')}>
        <Text>{props.match.round}</Text>
        <Button onPress={() => props.handlePress(props.idx)}>
          {props.match.home_team_name} vs {props.match.away_team_name}
        </Button>
        <Text>Where:</Text>
        <Text>{props.match.name}</Text>
        <Text>{props.match.location}</Text>
        <Text>
          {props.match.latitude},{props.match.longitude}
        </Text>
        <Text>{props.match.phone}</Text>
        <Text>When:</Text>
        <Text>
          {DateTime.fromISO(props.match.date).toLocaleString(
            DateTime.DATE_HUGE,
          )}
        </Text>
      </Pressable>
    </View>
  )
}

export default MatchCard
