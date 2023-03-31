import React from 'react'
import MatchScreen from '@screens/MatchScreen'
import UpcomingMatches from './UpcomingMatches'
import {createStackNavigator} from '@react-navigation/stack'

const MatchStack = createStackNavigator()

const Matches = (props: any) => {
  return (
    <MatchStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MatchStack.Screen name="Upcoming Matches" component={UpcomingMatches} />
      <MatchStack.Screen name="Match Screen" component={MatchScreen} />
    </MatchStack.Navigator>
  )
}

export default Matches
