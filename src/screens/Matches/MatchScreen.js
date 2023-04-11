import React from 'react'
import {FlatList, View} from 'react-native'
import {
  ActivityIndicator,
  Button,
  Divider,
  RadioButton,
  Text,
} from 'react-native-paper'
import Frame from '@components/Frame'
import {useFocusEffect} from '@react-navigation/native'
import {useAppSelector} from '~/lib/hooks/redux'
import {useMatch, useTeams, useSeason, useNetwork} from '~/lib/hooks'
import {socket} from '~/socket'

const MatchScreen = props => {
  /*
  type FrameType = {
    frameNumber: number
    type: string
    winner?: number
    homePlayerIds?: Array<number>
    awayPlayerIds?: Array<number>
    homeScore?: number
    awayScore?: number
    section?: number
    timeStamp?: number
    lastUpdate?: number
  }
  */

  const [matchInfo] = React.useState(props.route.params.matchInfo)
  //  const user = useAppSelector(_state => _state.user)
  const user = {
    id: 1933,
    nickname: 'Ken K',
  }

  const team = useTeams()
  const season = useSeason()
  const network = useNetwork()
  const match = useMatch()
  const [gameTypes, setGameTypes] = React.useState({})
  const [teams, setTeams] = React.useState({})
  const [firstBreak, setFirstBreak] = React.useState(0)
  const [frames, setFrames] = React.useState([])
  const [isMounted, setIsMounted] = React.useState(false)
  const [homeScore, setHomeScore] = React.useState(0)
  const [awayScore, setAwayScore] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [finalizedHome, setFinalizedHome] = React.useState(false)
  const [finalizedAway, setFinalizedAway] = React.useState(false)
  const [error, setError] = React.useState('')

  /*
  useFocusEffect(
    React.useCallback(() => {
      return () => setIsMounted(false)
    }, []),
  )
  */

  React.useEffect(() => {
    ;(async () => {
      try {
        console.log('getting game types')
        const _gameTypes = await season.GetGameTypes()
        setGameTypes(_gameTypes)

        console.log('rendering init frames')
        await RenderInitialFrames()

        setIsMounted(true)

        console.log('update teams')
        await UpdateTeams()

        //setFrames(await match.GetFrames(matchInfo.match_id))
        await GetFrames()

        await UpdateMatchInfo()

        setIsLoading(false)
        console.log('init socket')
        socket.connect()
      } catch (e) {
        setError('Something is very wrong')
        console.log(e)
      }
    })()
    return () => setIsMounted(false)
  }, [])

  const framesRef = React.useRef([])
  const setFramesRef = React.useRef(setFrames)

  React.useEffect(() => {
    framesRef.current = frames
    setFinalizedAway(false)
    setFinalizedHome(false)
  }, [frames])

  React.useEffect(() => {
    function UpdateFrameWin(frameIdx, winnerTeamId) {
      try {
        const _frames = framesRef.current
        _frames[frameIdx].winner = winnerTeamId
        UpdateScore(_frames)
      } catch (e) {
        console.log(e)
      }
    }

    function UpdateFramePlayers(frameIdx, side, playerIdx, playerId) {
      try {
        const _frames = framesRef.current
        if (side === 'home') {
          _frames[frameIdx].homePlayerIds[playerIdx] = playerId
        } else {
          _frames[frameIdx].awayPlayerIds[playerIdx] = playerId
        }
        setFrames([..._frames])
      } catch (e) {
        console.log(e)
      }
    }
    const roomId = 'match_' + matchInfo.match_id
    socket.on('reconnect', () => {
      console.log('reconnect')
    })
    socket.on('connect', () => {
      console.log('socket connected')
      socket.emit('join', roomId, joinStatus => {
        if (joinStatus.status === 'ok') {
          /*
          // get matchinfo, may or may not exist yet
          setIsLoading(true)
          socket.emit('getframes', {matchId: matchInfo.match_id}, response => {
            socket.emit(
              'getmatchinfo',
              {matchId: matchInfo.match_id},
              _response => {
                if (
                  typeof _response !== 'undefined' &&
                  _response &&
                  typeof _response.firstBreak !== 'undefined' &&
                  _response.firstBreak
                ) {
                  setFirstBreak(_response.firstBreak)
                  matchInfo.meta = {..._response}
                }
                if (
                  typeof _response !== 'undefined' &&
                  _response &&
                  typeof _response.finalize_home !== 'undefined' &&
                  _response.finalize_home.teamId
                ) {
                  setFinalizedHome(true)
                }
                if (
                  typeof _response !== 'undefined' &&
                  _response &&
                  typeof _response.finalize_away !== 'undefined' &&
                  _response.finalize_away.teamId
                ) {
                  setFinalizedHome(true)
                }
                setIsLoading(false)
              },
            )
          })
          */
          console.log('joined OK')
        }
      })
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    socket.on('frame_update', data => {
      if (typeof data.type !== 'undefined') {
        if (data.type === 'win') {
          UpdateFrameWin(data.frameIdx, data.winnerTeamId)
        } else if (data.type === 'players') {
          ;(async () => {
            if (data.newPlayer) {
              await UpdateTeams()
            }
            UpdateFramePlayers(
              data.frameIdx,
              data.side,
              data.playerIdx,
              data.playerId,
            )
          })()
        }
      }
    })

    socket.on('match_update', data => {
      if (typeof data !== 'undefined' && data) {
        if (typeof data.type !== 'undefined' && data.type) {
          if (data.type === 'firstbreak') {
            setFirstBreak(data.data.firstBreak)
          }
          if (data.type === 'newnote') {
            if (typeof matchInfo.meta !== 'undefined') {
              matchInfo.meta.notes.push(data.data)
            }
          }
        }
      }
    })
  }, [])

  /*
   * When returning from the Roster (the screen where a captain assign's a
   * player for a slot), that is when the playerId is passed back.  Normally
   * I would've passed a function handler in the props to the Roster screen,
   * however you cannot pass non serializable values (like a function) through
   * the react navigation navigator via props.route.params.
   * However, react native navigation allows you to pass non serialized values
   * BACK to the previous screen in the stack when you goBack() or
   * when you props.navigation.navigate('previous screen')
   */
  React.useEffect(() => {
    // keep players in an array in frameInfo
    // doubles games will have 1 playerIds in the array
    // playerIdx is either element -1 or element 1 (if doubles)
    if (props.route.params.player) {
      const player = props.route.params.player
      const frameInfo = player.frameInfo
      const playerId = player.playerId
      const _frames = [...frames]
      const newPlayer = player.newPlayer
      ;(async () => {
        if (newPlayer) {
          UpdateTeams()
        }
        let side = 'home'
        if (frameInfo.teamId === matchInfo.away_team_id) {
          side = 'away'
          _frames[frameInfo.frameIdx].awayPlayerIds[frameInfo.playerIdx] =
            playerId
        } else {
          _frames[frameInfo.frameIdx].homePlayerIds[frameInfo.playerIdx] =
            playerId
        }
        SocketSend('players', {
          frameNumber: _frames[frameInfo.frameIdx].frameNumber,
          matchId: matchInfo.match_id,
          frameIdx: frameInfo.frameIdx,
          side: side,
          playerId: playerId,
          playerIdx: frameInfo.playerIdx,
          newPlayer: newPlayer,
        })
        setFrames(_frames)
      })()
    }
  }, [props.route.params?.player])

  /*
  useFocusEffect(
    React.useCallback(() => {
      ;(async () => {
        await UpdateTeams()
        setIsMounted(true)
        setIsLoading(false)
      })()
    }, []),
  )
  */

  const userTeam = React.useMemo(() => {
    if (Object.keys(teams).length === 2) {
      if (
        teams[matchInfo.home_team_id].find(
          player => player.playerId === user.id,
        )
      ) {
        return 'home'
      }
      if (
        teams[matchInfo.away_team_id].find(
          player => player.playerId === user.id,
        )
      ) {
        return 'away'
      }
    }
    return null
  }, [user, teams])

  function SocketSend(type, data = {}) {
    network.SocketSend(type, matchInfo.match_id, data)
  }
  function UpdateFrames(frameData) {
    if (frameData) {
      const _frames = framesRef.current
      frameData.frames.forEach(_incomingFrame => {
        let i = 0
        let found = false
        while (i < _frames.length && !found) {
          if (i === _incomingFrame.frameIdx) {
            found = true
          } else {
            i++
          }
        }
        if (found) {
          _frames[i].winner = _incomingFrame.winner
          _frames[i].homePlayerIds = _incomingFrame.homePlayerIds
          _frames[i].awayPlayerIds = _incomingFrame.awayPlayerIds
        }
      })
      UpdateScore(_frames)
      setFrames([..._frames])
    }
  }

  async function GetFrames() {
    try {
      const matchId = matchInfo.match_id
      const res = await match.GetFrames(matchId)
      if (
        typeof res.status !== 'undefined' &&
        res.status &&
        res.status === 'ok'
      ) {
        UpdateFrames(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function UpdateMatchInfo() {
    try {
      const matchId = matchInfo.match_id
      const res = await match.GetMatchInfo(matchId)
      if (
        typeof res.status !== 'undefined' &&
        res.status &&
        res.status === 'ok'
      ) {
        const _matchInfo = res.data
        if (
          typeof _matchInfo?.firstBreak !== 'undefined' &&
          _matchInfo.firstBreak
        ) {
          setFirstBreak(_matchInfo.firstBreak)
        }
        if (
          typeof _matchInfo.finalize_home !== 'undefined' &&
          _matchInfo.finalize_home.teamId
        ) {
          setFinalizedHome(true)
        }
        if (
          typeof _matchInfo.finalize_away !== 'undefined' &&
          _matchInfo.finalize_away.teamId
        ) {
          setFinalizedAway(true)
        }
        matchInfo.meta = {..._matchInfo}
      }
    } catch (e) {
      console.log(e)
    }
  }

  function RenderInitialFrames() {
    return new Promise((resolve, reject) => {
      try {
        const _format = JSON.parse(matchInfo.format)
        const sections = _format[0].subsections
        const _frames = []
        let frame_number = 1
        let section_count = 1
        sections.forEach(section => {
          for (let i = 0; i < section.frames; i++) {
            _frames.push({
              section: section_count,
              mfpp: section.mfpp,
              frameNumber: frame_number,
              type: section.type,
              winner: 0,
              homePlayerIds: [],
              awayPlayerIds: [],
            })
            frame_number++
          }
          _frames.push({
            frameNumber: -1,
            type: 'section',
            section: section_count,
            homeScore: 0,
            awayScore: 0,
          })
          section_count++
        })
        setFrames(_frames)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  function ChoosePlayer(teamId, playerIdx, frameIdx, section, mfpp) {
    props.navigation.navigate('Roster', {
      teams: teams,
      frameInfo: {playerIdx, frameIdx, teamId},
      section: section,
      mfpp: mfpp,
      frames: frames,
    })
  }

  function UpdateScore(_frames) {
    let _awayScore = 0
    let _homeScore = 0
    const __frames = _frames.map(frame => {
      if (frame.winner === matchInfo.home_team_id) {
        _homeScore++
      }
      if (frame.winner === matchInfo.away_team_id) {
        _awayScore++
      }
      if (frame.type === 'section') {
        frame.homeScore = _homeScore
        frame.awayScore = _awayScore
      }
      return frame
    })
    setFrames(__frames)
    setAwayScore(_awayScore)
    setHomeScore(_homeScore)
  }

  function SetWinner(teamId, playerIds, frameIdx, frameNumber) {
    const _frames = [...frames]
    _frames[frameIdx].winner = teamId
    SocketSend('win', {
      frameNumber: frameNumber,
      winnerTeamId: teamId,
      playerIds: playerIds,
      frameIdx: frameIdx,
      matchId: matchInfo.match_id,
    })
    _frames[frameIdx].timeStamp > 0
      ? (_frames[frameIdx].lastUpdate = Date.now())
      : (_frames[frameIdx].timeStamp = Date.now())
    UpdateScore(_frames)
  }

  function HandleGoBack() {
    socket.off()
    socket.disconnect()
    socket.close()
    props.navigation.goBack()
  }

  function HandleSetFirstBreak(teamId) {
    setFirstBreak(teamId)
    SocketSend('firstbreak', {
      firstBreak: teamId,
    })
  }

  function HandleFinalized(side) {
    if (side === 'home' && side === userTeam) {
      setFinalizedHome(true)
      SocketSend('finalize', {
        teamId: matchInfo.home_team_id,
        side: side,
        matchId: matchInfo.match_id,
      })
    } else if (side === 'away' && side === userTeam) {
      setFinalizedAway(true)
      SocketSend('finalize', {
        teamId: matchInfo.away_team_id,
        side: side,
        matchId: matchInfo.match_id,
      })
    }
  }

  async function UpdateTeams() {
    const _teams = {}
    if (typeof matchInfo.home_team_id !== 'undefined') {
      const homePlayers = await team.GetPlayers(matchInfo.home_team_id)
      _teams[matchInfo.home_team_id] = homePlayers
    }
    if (typeof matchInfo.away_team_id !== 'undefined') {
      const awayPlayers = await team.GetPlayers(matchInfo.away_team_id)
      _teams[matchInfo.away_team_id] = awayPlayers
    }
    setTeams(_teams)
  }

  if (isMounted) {
    return (
      <>
        <View>
          <FlatList
            ListHeaderComponent={
              <View style={{backgroundColor: '#fff'}}>
                <View style={{flexDirection: 'row', padding: 5}}>
                  <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Button
                      icon="arrow-left"
                      mode="contained"
                      onPress={() => HandleGoBack()}>
                      Back
                    </Button>
                  </View>
                  {isLoading && (
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <ActivityIndicator />
                    </View>
                  )}
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Button
                      icon="dots-triangle"
                      mode="contained"
                      onPress={() =>
                        props.navigation.navigate('Match Info', {matchInfo})
                      }>
                      More
                    </Button>
                  </View>
                </View>
                <RadioButton.Group
                  onValueChange={newValue => HandleSetFirstBreak(newValue)}
                  value={firstBreak}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flex: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        variant="headlineMedium"
                        style={{textAlign: 'center'}}>
                        {matchInfo.home_team_short_name}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <RadioButton.Android
                          disabled={isLoading}
                          value={matchInfo.home_team_id}
                        />
                        <Text>First Break</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text>VS</Text>
                    </View>
                    <View
                      style={{
                        flex: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        variant="headlineMedium"
                        style={{textAlign: 'center'}}>
                        {matchInfo.away_team_short_name}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <RadioButton.Android
                          disabled={isLoading}
                          value={matchInfo.away_team_id}
                        />
                        <Text>First Break</Text>
                      </View>
                    </View>
                  </View>
                </RadioButton.Group>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text variant="displayMedium">{homeScore}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text variant="displayMedium">{awayScore}</Text>
                  </View>
                </View>
              </View>
            }
            ListFooterComponent={
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Button
                      disabled={finalizedHome || isLoading}
                      onPress={() => HandleFinalized('home')}
                      mode="elevated">
                      Finalize Home
                    </Button>
                  </View>
                  <View style={{flex: 1}}>
                    <Button
                      disabled={finalizedAway || isLoading}
                      onPress={() => HandleFinalized('away')}
                      mode="elevated">
                      Finalize Away
                    </Button>
                  </View>
                </View>
              </View>
            }
            data={frames}
            ItemSeparatorComponent={
              <View style={{marginVertical: 5}}>
                <Divider bold />
              </View>
            }
            stickyHeaderIndices={[0]}
            renderItem={({item, index}) => (
              <Frame
                side={userTeam}
                firstBreak={firstBreak}
                isLoading={isLoading}
                matchInfo={matchInfo}
                teams={teams}
                gameTypes={gameTypes}
                frame={item}
                choosePlayer={ChoosePlayer}
                setWinner={SetWinner}
                frameIdx={index}
                finalizedAway={finalizedAway}
                finalizedHome={finalizedHome}
              />
            )}
          />
        </View>
      </>
    )
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
}

export default MatchScreen
