import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '~/config'

export const useNetwork = (): any => {
  const Get = async function (endpoint: string): Promise<Object> {
    try {
      const _endpoint =
        typeof endpoint !== 'undefined' && endpoint[0] === '/'
          ? endpoint.substring(1)
          : endpoint
      const domain = config.domain ?? 'localhost'
      const res = await fetch('https://' + domain + '/' + _endpoint)
      return res.json()
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  const Post = async function (
    endpoint: string,
    payload: object,
  ): Promise<Object> {
    try {
      const _endpoint =
        typeof endpoint !== 'undefined' && endpoint[0] === '/'
          ? endpoint.substring(1)
          : endpoint
      const domain = config.domain ?? 'localhost'
      const res = await fetch('https://' + domain + '/' + _endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await res.json()
      return json
    } catch (e) {
      console.log(e)
      return {}
    }
  }
  return {Get, Post}
}

export const useAccount = (): any => {
  const {Post} = useNetwork()
  const LoadUser = async (): Promise<void> => {
    try {
      const user = await AsyncStorage.getItem('user')
    } catch (e) {
      console.log(e)
    }
  }

  async function Login(email: string, password: string) {
    return await Post('/login', {email, password})
  }

  return {LoadUser, Login}
}

export const useLeague = (): any => {
  const {Get} = useNetwork()

  const GetSeason = async (): Promise<Object> => {
    const localSeason = await AsyncStorage.getItem('season')
    if (!localSeason) {
      const season = await Get('/season')
      return season
    } else {
      return localSeason
    }
  }
  return {GetSeason}
}
