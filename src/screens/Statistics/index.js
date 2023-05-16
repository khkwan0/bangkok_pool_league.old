/* eslint-disable react/no-unstable-nested-components */
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import StatisticsHome from './StatisticsHome'
import {IconButton} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'
import LeagueStandings from './LeagueStandings'
import MatchScreen from './MatchScreen'

const StatisticsStack = createNativeStackNavigator()

const StatisticsScreen = props => {
  const navigation = useNavigation()
  return (
    <StatisticsStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerRight: () => (
          <IconButton icon="menu" onPress={() => navigation.openDrawer()} />
        ),
      }}>
      <StatisticsStack.Screen
        name="Root"
        component={StatisticsHome}
        options={{
          title: 'Statistics',
          headerLeft: () => (
            <IconButton
              icon="home"
              onPress={() => navigation.navigate('Upcoming Matches')}
            />
          ),
        }}
      />
      <StatisticsStack.Screen
        name="League Standings"
        component={LeagueStandings}
      />
      <StatisticsStack.Screen
        name="Statistics Match Screen"
        component={MatchScreen}
      />
    </StatisticsStack.Navigator>
  )
}

export default StatisticsScreen
