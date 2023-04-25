/* eslint-disable react/no-unstable-nested-components */
import React from 'react'
import {useAccount, useLeague} from '~/lib/hooks'
import {useAppSelector} from '~/lib/hooks/redux'
import Matches from '@screens/Matches'
import Calendar from '~/screens/Calendar'
import Account from '@screens/Account'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

function Main(): JSX.Element {
  const account = useAccount()
  const league = useLeague()
  const [drawerOnly, setDrawerOnly] = React.useState(true)

  const {user} = useAppSelector(_state => _state.user)

  React.useEffect(() => {
    account.LoadUser()
  }, [account])

  React.useEffect(() => {
    ;(async () => {
      const season = await league.GetSeason()
    })()
  }, [league])

  if (drawerOnly) {
    return (
      <Drawer.Navigator screenOptions={{drawerPosition: 'right'}}>
        <Drawer.Screen name="Matches" component={Matches} />
      </Drawer.Navigator>
    )
  } else {
    return (
      <Tab.Navigator
        screenOptions={{
          lazy: false,
          headerShown: false,
        }}>
        <Tab.Screen
          name="Matches"
          component={Matches}
          options={{
            tabBarLabel: 'Matches',
            tabBarIcon: ({color, size}) => {
              return (
                <MaterialCommunityIcons
                  name="billiards-rack"
                  size={size}
                  color={color}
                />
              )
            },
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            tabBarIcon: ({color, size}) => {
              return (
                <MaterialCommunityIcons
                  name="calendar"
                  size={size}
                  color={color}
                />
              )
            },
          }}
        />
        <Tab.Screen
          name="Me"
          component={Account}
          options={{
            tabBarIcon: ({color, size}) => {
              return (
                <MaterialCommunityIcons
                  name="head-dots-horizontal"
                  size={size}
                  color={color}
                />
              )
            },
          }}
        />
      </Tab.Navigator>
    )
  }
}

export default Main
