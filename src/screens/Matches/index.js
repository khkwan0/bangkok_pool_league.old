import React from 'react'
import MatchScreen from './MatchScreen'
import UpcomingMatches from './UpcomingMatches'
import Roster from './Roster'
import ExtendedMatchInfo from './ExtendedMatchInfo'
import {createStackNavigator} from '@react-navigation/stack'
import {View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const MatchStack = createStackNavigator()

const Matches = props => {
  const insets = useSafeAreaInsets()

  return (
    <View style={{flex: 1, backgroundColor: 'blue', paddingTop: insets.top}}>
      <MatchStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <MatchStack.Screen name="Upcoming Matches" component={UpcomingMatches} />
        <MatchStack.Screen name="Match Screen" component={MatchScreen} />
        <MatchStack.Screen name="Roster" component={Roster} />
        <MatchStack.Screen name="Match Info" component={ExtendedMatchInfo} />
      </MatchStack.Navigator>
    </View>
  )
}

export default Matches
