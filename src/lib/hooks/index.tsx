import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '~/config'
import {useAppDispatch, useAppSelector} from '~/lib/hooks/redux'
import {ClearUser, SetUser} from '~/redux/userSlice'
import {socket} from '~/socket'

export const useNetwork = (): any => {
  const Get = async function (endpoint: string): Promise<Object> {
    try {
      const _endpoint =
        typeof endpoint !== 'undefined' && endpoint[0] === '/'
          ? endpoint.substring(1)
          : endpoint
      const domain = config.domain ?? 'localhost'
      const token = await AsyncStorage.getItem('jwt')
      const res = await fetch('https://' + domain + '/' + _endpoint, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      const json = await res.json()
      return json
    } catch (e) {
      console.log(endpoint, e)
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
      const token = await AsyncStorage.getItem('jwt')
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

  const SocketSend = (type = '', matchId = 0, data = {}, dest = '') => {
    const user = {
      id: 1933,
      nickname: 'Ken K',
    }
    const toSend = {
      type: type,
      matchId: matchId,
      timestamp: Date.now(),
      playerId: user.id ?? 0,
      nickname: user.nickname,
      dest: dest,
      data: {...data},
    }
    if (socket && socket.connected) {
      socket.emit('matchupdate', toSend)
    }
  }
  return {Get, Post, SocketSend}
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

  // uses jwt
  const FetchUser = async (): Promise<void> => {
    try {
      if (
        typeof user === 'undefined' ||
        !user ||
        typeof user?.id === 'undefined' ||
        !user.id
      ) {
        const userData = await Get('/user')
        dispatch(SetUser(userData))
      }
    } catch (e) {
      console.log('no user')
    }
  }

  const UpdateUser = async (userId: number, user: object): Promise<void> => {
    try {

    } catch (e) {
      console.log(e)
    }
  }

  async function UserLogin(email: string, password: string) {
    try {
      const res = await Post('/login', {email, password}, false)
/*
      const res = {
        email: 'khkwan0@gmail.com',
        id: 1,
        token: 'asd',
        firstName: 'Kenneth',
        lastName: 'K',
      }
      */
      if (typeof res.status !== 'undefined' && res.status === 'ok') {
        if (typeof res.data !== 'undefined' && res.data) {
          await AsyncStorage.setItem('jwt', res.data.token)
          dispatch(SetUser(res.data.user))
          return {status: 'ok'}
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function Logout() {
    await AsyncStorage.removeItem('user')
    dispatch(ClearUser())
    await Get('/logout')
    await AsyncStorage.removeItem('jwt')
  }

  return {FetchUser, LoadUser, UserLogin, Logout, UpdateUser}
}

export const useLeague = (): any => {
  const {Get, Post} = useNetwork()

  const GetSeason = async (): Promise<Object> => {
    try {
      const localSeason = await AsyncStorage.getItem('season')
      if (!localSeason) {
        const season = await Get('/season')
        return season
      } else {
        return localSeason
      }
    } catch (e) {
      console.log('no season')
    }
  }

  const GetPlayers = async () => {
    try {
      const _players = await AsyncStorage.getItem('allplayers')
      if (_players) {
        const players = JSON.parse(_players)
        return players
      }
      const __players = await Get('/players')
      if (__players) {
        return __players
      }
      return []
    } catch (e) {
      console.log(e)
      return []
    }
  }

  const SaveNewPlayer = async (
    nickName = '',
    firstName = '',
    lastName = '',
    email = '',
    teamId = 0,
  ) => {
    try {
      const res = Post('/player', {nickName, firstName, lastName, email, teamId})
      return res
    } catch (e) {
      console.log(e)
      return {status: 'err', msg: 'Save error'}
    }
  }

  return {GetPlayers, GetSeason, SaveNewPlayer}
}

export const useSeason = (): any => {
  const {Get} = useNetwork()

  const GetMatches = async (options: Array<string> = []): Promise<Object> => {
    try {
      const query = options.join('&')
      const matches = await Get('/matches?' + query)
      return matches
    } catch (e) {
      console.log(e)
      return []
    }
  }

  const GetMatchesBySeason = async (season: number): Promise<Object> => {
    try {
      const matches = await Get('/season/matches?season=' + season)
      return matches
    } catch (e) {
      console.log(e)
      return []
    }
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

  const GetGameTypes = async (): Promise<Object> => {
    try {
      const gameTypes = await Get('/game/types')
      return gameTypes
    } catch (e) {
      console.log(e)
      return []
    }
  }

  return {GetMatches, GetMatchesBySeason, GetTeams, GetGameTypes}
}

export const useTeams = (): any => {
  const {Get} = useNetwork()

  const GetPlayers = async (teamid: number = -1): Promise<Object> => {
    try {
      if (teamid && Number.isInteger(teamid) && teamid >= 0) {
        const players = await Get('/players?teamid=' + teamid)
        return players
      }
    } catch (e) {
      console.log(e)
      return []
    }
  }

  return {GetPlayers}
}

export const useMatch = () => {
  const {Get} = useNetwork()

  const GetFrames = async matchId => {
    try {
      const frames = await Get('/frames/' + matchId)
      return frames
    } catch (e) {
      return []
    }
  }

  const GetMatchInfo = async matchId => {
    try {
      const res = await Get('/match/' + matchId)
      return res
    } catch (e) {
      return {}
    }
  }

  return {GetFrames, GetMatchInfo}
}
