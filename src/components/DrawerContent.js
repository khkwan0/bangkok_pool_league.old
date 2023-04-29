import React from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import {Text} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useAccount} from '~/lib/hooks'

const drawerPanelStyle = StyleSheet.create({
  flex: 1,
  marginHorizontal: 50,
  paddingTop: 30,
})

const drawerItemStyle = StyleSheet.create({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 30,
})

const DrawerContent = props => {
  const account = useAccount()

  async function HandleLogout() {
    await account.Logout()
    props.navigation.goBack()
  }

  return (
    <View style={drawerPanelStyle}>
      <View style={{flex: 5, gap: 10}}>
        <View>
          <Pressable onPress={() => props.navigation.navigate('Login')}>
            <View style={drawerItemStyle}>
              <MaterialCommunityIcons name="login" color="#000" size={30} />
              <Text variant="titleLarge">Login</Text>
            </View>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={() => props.navigation.navigate('Calendar')}>
            <View style={drawerItemStyle}>
              <MaterialCommunityIcons name="calendar" color="#000" size={30} />
              <Text variant="titleLarge">Calendar</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={{flex: 1}}>
        <Pressable onPress={() => HandleLogout()}>
          <View style={drawerItemStyle}>
            <MaterialCommunityIcons name="logout" color="#000" size={30} />
            <Text variant="titleLarge">Logout</Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}

export default DrawerContent
