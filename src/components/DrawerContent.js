import React from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import {Text} from 'react-native-paper'
import {useAccount} from '~/lib/hooks'
import {useNavigation} from '@react-navigation/native'
import Icon from '@components/Icon'
import {useAppSelector} from '~/lib/hooks/redux'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const drawerPanelStyle = StyleSheet.create({
  flex: 1,
  marginHorizontal: 50,
})

const drawerItemStyle = StyleSheet.create({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 30,
})

const DrawerItem = ({navDest, icon, label, as}) => {
  const navigation = useNavigation()
  return (
    <View>
      <Pressable onPress={() => navigation.navigate(navDest)}>
        <View style={drawerItemStyle}>
          <Icon name={icon} as={as} />
          <Text variant="titleLarge">{label}</Text>
        </View>
      </Pressable>
    </View>
  )
}

const DrawerContent = props => {
  const insets = useSafeAreaInsets()
  const user = useAppSelector(_state => _state.user.user.data)
  const account = useAccount()

  async function HandleLogout() {
    await account.Logout()
    props.navigation.goBack()
  }

  return (
    <View style={[drawerPanelStyle, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <View style={{flex: 5}}>
        {typeof user?.id !== 'undefined' && user.id && (
          <View style={{flex: 1}}>
            <Text variant="titleLarge">{user.nickname}</Text>
            <Text variant="bodyLarge">player</Text>
          </View>
        )}
        <View style={{flex: 5, gap: 10}}>
          {(typeof user?.id === 'undefined' || !user.id) && (
            <DrawerItem navDest="Login" icon="login" label="Login" />
          )}
          <DrawerItem navDest="Matches" icon="home-outline" label="Home" />
          <DrawerItem
            navDest="Seasons"
            icon="leaf-circle-outline"
            label="Seasons"
          />
          <DrawerItem navDest="Divisions" icon="division" label="Divisions" />
          <DrawerItem
            navDest="Venues"
            as="Ionicons"
            icon="location-outline"
            label="Venues"
          />
          <DrawerItem
            navDest="Teams"
            as="Ionicons"
            icon="people"
            label="Teams"
          />
          <DrawerItem
            navDest="Players"
            as="Ionicons"
            icon="person-outline"
            label="Players"
          />
          <DrawerItem navDest="Calendar" icon="calendar" label="Calendar" />
          <DrawerItem
            navDest="Schedules"
            icon="clipboard-list-outline"
            label="Schedules"
          />
          <DrawerItem
            navDest="Statistics"
            icon="chart-areaspline-variant"
            label="Statistics"
          />
          <DrawerItem
            navDest="Info"
            icon="information-outline"
            label="Info & Guides"
          />
          <DrawerItem navDest="Settings" icon="cog" label="Settings" />
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Pressable onPress={() => HandleLogout()}>
          <View style={drawerItemStyle}>
            <Icon name="logout" />
            <Text variant="titleLarge">Logout</Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}

export default DrawerContent
