import React from 'react'
import {Text, View} from 'react-native'
import {useAppSelector} from '~/lib/hooks/redux'

const Account = (props: any) => {
  const user = useAppSelector(_state => _state.user)

  React.useEffect(() => {
    ;(async () => {
      if (typeof user.email !== 'undefined' && user.email) {

      }
    })()
  }, [user])
  return (
    <View>
      {(typeof user.email === 'undefined' || !user.email) && (
        <Text>Not signed in</Text>
      )}
    </View>
  )
}

export default Account
