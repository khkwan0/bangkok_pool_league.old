import React from 'react'
import {useAccount, useLeague} from '~/lib/hooks'
import {useAppSelector} from '~/lib/hooks/redux'
import UpcomingMatches from '@screens/UpcomingMatches'
import Teams from '@screens/Teams'
import Account from '@screens/Account'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

function Main(): JSX.Element {
  const account = useAccount()
  const league = useLeague()

  const {user} = useAppSelector(_state => _state.user)
  console.log('user', user)

  React.useEffect(() => {
    account.LoadUser()
  }, [account])

  React.useEffect(() => {
    ;(async () => {
      const season = await league.GetSeason()
      console.log('season', season)
    })()
  }, [league])

  return (
    <Tab.Navigator
      screenOptions={{
        lazy: false,
        headerShown: false,
      }}>
      <Tab.Screen
        name="UpcomingMatches"
        component={UpcomingMatches}
        options={{tabBarLabel: 'Matches'}}
      />
      <Tab.Screen name="Teams" component={Teams} />
      <Tab.Screen name="Me" component={Account} />
    </Tab.Navigator>
  )
}

export default Main
