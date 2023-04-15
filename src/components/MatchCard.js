import React from 'react'
import {Image, View} from 'react-native'
import {Portal, Text, TouchableRipple} from 'react-native-paper'
import {DateTime} from 'luxon'

const MatchCard = props => {
  console.log(JSON.stringify(props.match, null, 2))
  return (
    <View
      style={{
        margin: 10,
        paddingHorizontal: 10,
        backgroundColor: '#ddd',
        borderRadius: 10,
      }}>
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
          {props.match.logo && (
            <View
              style={{position: 'absolute', bottom: 0, right: 10, zIndex: -1}}>
              <Image
                source={{uri: props.match.logo}}
                width={100}
                height={100}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </TouchableRipple>
    </View>
  )
}

export default MatchCard
