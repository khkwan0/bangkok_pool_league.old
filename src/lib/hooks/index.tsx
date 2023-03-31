import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '~/config'
import {useAppDispatch, useAppSelector} from '~/lib/hooks/redux'
import {ClearUser, SetUser} from '~/redux/userSlice'

export const useNetwork = (): any => {
  const Get = async function (
    endpoint: string,
    token: string = '',
  ): Promise<Object> {
    try {
      const _endpoint =
        typeof endpoint !== 'undefined' && endpoint[0] === '/'
          ? endpoint.substring(1)
          : endpoint
      const domain = config.domain ?? 'localhost'
      const res = await fetch('https://' + domain + '/' + _endpoint, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
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
    token: string = '',
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
  const {user} = useAppSelector(_state => _state.user)
  const {Get, Post} = useNetwork()

  const LoadUser = async (): Promise<void> => {
    try {
      const user = await AsyncStorage.getItem('user')
    } catch (e) {
      console.log(e)
    }
  }

  const FetchUser = async (): Promise<void> => {
    try {
      const token = user?.data?.token ?? ''
      const userId = user?.data?.token ?? ''
      // const userData = await Get('/user/' + userId, token)
      const userData = {
        gamesPlayed: 5,
      }
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
    try {
      // const res = await Post('/login', {email, password}, false)
      const res = {
        email: 'khkwan0@gmail.com',
        id: 1,
        token: 'asd',
        firstName: 'Kenneth',
        lastName: 'K',
      }
      dispatch(SetUser(res))
    } catch (e) {
      console.log(e)
    }
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

export const useSeason = (): any => {
  const {Get} = useNetwork()

  const GetMatches = async (userId: number = 0): Promise<Object> => {
    let query = ''
    if (typeof userId && userId) {
      query = '?userid=' + userId
    }
    const matches = await Get('/matches' + query)
    return matches
  }

  const GetTeams = async (): Promise<Object> => {
    try {
      const teams = await Get('/teams')
      return teams
    } catch (e) {
      console.log(e)
      return []
    }
  }

  return {GetMatches, GetTeams}
}
