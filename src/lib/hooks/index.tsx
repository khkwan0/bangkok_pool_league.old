import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '~/config'
import {useAppDispatch} from '~/lib/hooks/redux'
import {ClearUser} from '~/redux/userSlice'

export const useNetwork = (): any => {
  const Get = async function (endpoint: string): Promise<Object> {
    try {
      const _endpoint =
        typeof endpoint !== 'undefined' && endpoint[0] === '/'
          ? endpoint.substring(1)
          : endpoint
      const domain = config.domain ?? 'localhost'
      const res = await fetch('https://' + domain + '/' + _endpoint)
      const json = await res.json()
      return json
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
          Authorization: 'Bearer ' + token,
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
  const dispatch = useAppDispatch()
  const {Get, Post} = useNetwork()
  const LoadUser = async (): Promise<void> => {
    try {
      const user = await AsyncStorage.getItem('user')
    } catch (e) {
      console.log(e)
    }
  }

  const FetchUser = async (userId: number): Promise<void> => {
    try {
      const userData = await Get('/user/' + userId)
    } catch (e) {
      console.log(e)
    }
  }

  const UpdateUser = async (userId: number, user: object): Promise<void> => {
    try {

    } catch (e) {
      console.log(e)
    }
  }

  async function Login(email: string, password: string) {
    return await Post('/login', {email, password})
  }

  async function Logout() {
    dispatch(ClearUser())
    await AsyncStorage.removeItem('user')
  }

  return {FetchUser, LoadUser, Login, Logout, UpdateUser}
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
