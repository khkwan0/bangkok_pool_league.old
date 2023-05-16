import React from 'react'
import {ScrollView, View} from 'react-native'
import {Text, TouchableRipple} from 'react-native-paper'

const StatisticsHome = props => {
  function ShowLeagueStandings() {
    props.navigation.navigate('League Standings')
  }

  return (
    <ScrollView style={{margin: 20}}>
      <TouchableRipple onPress={() => ShowLeagueStandings()}>
        <View style={{padding: 40}}>
          <Text>League Standings</Text>
        </View>
      </TouchableRipple>
    </ScrollView>
  )
}

export default StatisticsHome
