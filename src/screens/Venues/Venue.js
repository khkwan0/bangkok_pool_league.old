import React from 'react'
import {Linking, Pressable, View} from 'react-native'
import {Button, Text} from 'react-native-paper'
import TwoColumns from '@components/TwoColumns'
import {showLocation} from 'react-native-map-link'

const Venue = props => {
  const venue = props.route.params.venue

  return (
    <View style={{flex: 1}}>
      <View style={{padding: 20}}>
        <Text variant="titleLarge" style={{textAlign: 'center'}}>
          {venue.name}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <TwoColumns label="Location">
          <Text>{venue.location}</Text>
        </TwoColumns>
        <TwoColumns label="Plus Code">
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Text>{venue.plus}</Text>
            {typeof venue.latitude !== 'undefined' &&
              venue.latitude &&
              typeof venue.longitude !== 'undefined' &&
              venue.longitude && (
                <Button
                  mode="outlined"
                  onPress={() =>
                    showLocation({
                      latitude: venue.latitude,
                      longitude: venue.longitude,
                    })
                  }>
                  Map
                </Button>
              )}
          </View>
        </TwoColumns>
        <TwoColumns label="Phone">
          <Text>{venue.phone}</Text>
        </TwoColumns>
        <TwoColumns label="Email">
          <Text>{venue.email}</Text>
        </TwoColumns>
        <Pressable onPress={() => Linking.openURL('https://' + venue.website)}>
          <TwoColumns label="Website" style={{padding: 5}}>
            <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>
              {venue.website}
            </Text>
          </TwoColumns>
        </Pressable>
      </View>

      <View flex={3}>
        {venue.teams.map((team, idx) => (
          <Pressable>
            <TwoColumns label={idx === 0 ? 'Teams' : ''} style={{padding: 10}}>
              <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>
                {team.name}
              </Text>
            </TwoColumns>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default Venue
