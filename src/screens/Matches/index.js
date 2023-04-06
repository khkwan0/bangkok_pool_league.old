import React from 'react'
import MatchScreen from './MatchScreen'
import UpcomingMatches from './UpcomingMatches'
import Roster from './Roster'
import {createStackNavigator} from '@react-navigation/stack'

const MatchStack = createStackNavigator()

const Matches = props => {
  return (
    <MatchStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MatchStack.Screen name="Upcoming Matches" component={UpcomingMatches} />
      <MatchStack.Screen name="Match Screen" component={MatchScreen} />
      <MatchStack.Screen name="Roster" component={Roster} />
    </MatchStack.Navigator>
  )
}

export default Matches
