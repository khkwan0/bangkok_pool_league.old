import React from 'react'
import {Text, View} from 'react-native'
import {useAppSelector} from '~/lib/hooks/redux'
import {useAccount} from '~/lib/hooks'
import Login from '@screens/Auth/Login'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Button} from 'react-native-paper'

const Account = (props: any) => {
  const account = useAccount()
  const {user} = useAppSelector(_state => _state.user)
  console.log(user)

  React.useEffect(() => {
    ;(async () => {
      if (typeof user.data.token !== 'undefined' && user.data.token) {
        console.log('ffetch user')
        await account.FetchUser(user.data.id, user.data.token)
      }
    })()
  }, [user])

  async function Logout() {
    await account.Logout()
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {(typeof user?.data?.token === 'undefined' || !user?.data?.token) && (
        <>
          <View style={{flex: 1}} />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingLeft: '5%',
              paddingRight: '5%',
            }}>
            <Login />
          </View>
          <View style={{flex: 1}} />
        </>
      )}
      {typeof user?.data?.token !== 'undefined' && user?.data?.token && (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <Text>
              {user.data.firstName} {user?.data?.lastName[0] ?? ''}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Button mode="contained" icon="logout" onPress={() => Logout()}>
              Logout
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Account
