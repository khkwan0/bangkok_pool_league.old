import React from 'react'
import {View} from 'react-native'
import {Button, TextInput} from 'react-native-paper'
import {useAccount} from '~/lib/hooks'
import LineLogin from 'rn-line-login-android'

const Login = props => {
  const {UserLogin} = useAccount()
  const [email, setEmail] = React.useState('khkwan0@gmail.com')
  const [secure, setSecure] = React.useState(true)
  const [password, setPassword] = React.useState('KiN-1BdH')
  const [loading, setLoading] = React.useState(false)

  async function AttemptLogin() {
    try {
      setLoading(true)
      const user = await UserLogin(email, password)
      console.log(user)
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

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <TextInput
          label="Email"
          value={email}
          left={<TextInput.Icon icon="email" />}
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
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
          <Button onPress={() => HandleLineLogin()}>Line</Button>
        </View>
      </View>
    </View>
  )
}

export default Login
