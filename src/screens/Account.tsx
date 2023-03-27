import React from 'react'
import {Text, View} from 'react-native'
import {useAppSelector} from '~/lib/hooks/redux'
import {useAccount} from '~/lib/hooks'

const Account = (props: any) => {
  const account = useAccount()
  const user = useAppSelector(_state => _state.user)

  React.useEffect(() => {
    ;(async () => {
      if (typeof user.email !== 'undefined' && user.email) {
        await account.FetchUser(user.email)
      }
    })()
  }, [user])
  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {(typeof user.email === 'undefined' || !user.email) && (
        <Text>Not signed in</Text>
      )}
      {typeof user.email !== 'undefined' && user.email && (
        <Text>{user.email}</Text>
      )}
    </View>
  )
}

export default Account
