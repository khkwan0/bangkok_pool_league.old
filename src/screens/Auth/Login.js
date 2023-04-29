import React from 'react'
import {View} from 'react-native'
import {Button, Text, TextInput} from 'react-native-paper'
import {useAccount} from '~/lib/hooks'
import LineLogin from 'rn-line-login-android'
import {Settings, LoginButton, AccessToken} from 'react-native-fbsdk-next'
import {useAppSelector} from '~/lib/hooks/redux'

const Login = props => {
  const {UserLogin, Logout} = useAccount()
  const {user} = useAppSelector(_state => _state.user)
  const [email, setEmail] = React.useState('khkwan0@gmail.com')
  const [secure, setSecure] = React.useState(true)
  const [password, setPassword] = React.useState('KiN-1BdH')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    Settings.initializeSDK()
  }, [])

  async function AttemptLogin() {
    try {
      setLoading(true)
      const res = await UserLogin(email, password)
      if (typeof res.status !== 'undefined' && res.status === 'ok') {
        if (typeof props.route.params?.previous !== 'undefined') {
          props.navigation.navigate(props.route?.params?.previous)
        } else {
          props.navigation.goBack()
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  async function HandleLineLogin() {
    try {
      const res = await LineLogin.Login()
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  async function HandleLogout() {
    try {
      await Logout()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={{flex: 1}}>
      {typeof user.data?.nickname !== 'undefined' && user.data.nickname && (
        <View>
          <Text>You are logged in as: {user.data.nickname}</Text>
          <Button onPress={() => HandleLogout()}>Logout</Button>
        </View>
      )}
      {(typeof user.data?.nickname === 'undefined' || !user.data.nickname) && (
        <>
          <View>
            <TextInput
              label="Email"
              value={email}
              left={<TextInput.Icon icon="email" />}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View>
            <TextInput
              secureTextEntry={secure}
              label="Password"
              value={password}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye' : 'eye-off'}
                  onPress={() => setSecure(s => !s)}
                />
              }
              onChangeText={text => setPassword(text)}
            />
            <View>
              <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={() => AttemptLogin()}>
                Login
              </Button>
            </View>
            <View>
              <LoginButton
                onLoginFinished={(err, res) => {
                  if (err) {
                    console.log('err', res.error)
                  } else if (res.isCancelled) {
                    console.log('cancelled')
                  } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                      console.log(data.accessToken.toString())
                    })
                  }
                }}
                onLogoutFinished={() => console.log('logout')}
              />
            </View>
            <View>
              <Button onPress={() => HandleLineLogin()}>Line</Button>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default Login
