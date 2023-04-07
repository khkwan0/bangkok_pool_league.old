import React from 'react'
import {FlatList, View} from 'react-native'
import {ActivityIndicator, Button, Divider, RadioButton, Text} from 'react-native-paper'
import Frame from '@components/Frame'
import {useFocusEffect} from '@react-navigation/native'
import {useAppSelector} from '~/lib/hooks/redux'
import {useTeams, useSeason} from '~/lib/hooks'
import {socket} from '~/socket'
import config from '~/config'

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
  }

  const team = useTeams()
  const season = useSeason()
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
        setFrames([..._frames])
      } catch (e) {
        console.log(e)
      }
    }

    function UpdateFramePlayers(frameIdx, teamId, players) {
      const _frames = [...frames]
      if (teamId === matchInfo.home_team_id) {
        _frames[frameIdx].homePlayerIds = players
      } else {
        _frames[frameIdx].awayPlayerIds = players
      }
    }
    const roomId = 'match_' + matchInfo.match_id

    socket.on('connect', () => {
      console.log('socket connected')
      socket.emit('join', roomId, joinStatus => {
        if (joinStatus.status === 'ok') {
          // get matchinfo, may or may not exist yet
          socket.emit('getframes', {matchId: matchInfo.match_id}, response => {
            if (response) {
              console.log('recvd frame data')
              const _frames = framesRef.current
              response.frames.forEach(_incomingFrame => {
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
            socket.emit(
              'getmatchinfo',
              {matchId: matchInfo.match_id},
              _response => {
                if (
                  typeof _response &&
                  _response &&
                  typeof _response.firstBreak !== 'undefined' &&
                  _response.firstBreak
                ) {
                  setFirstBreak(_response.firstBreak)
                }
                setIsLoading(false)
              },
            )
          })
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
            UpdateFramePlayers(data.frameIdx, data.teamId, data.players)
          })()
        }
      }
    })

    socket.on('matchdata', data => {
      if (typeof data !== 'undefined' && data) {
        if (typeof data.firstBreak !== 'undefined' && data.firstBreak) {
          setFirstBreak(data.firstBreak)
        }
      }
    })
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      socket.emit('updatematchinfo', {
        matchId: matchInfo.match_id,
        firstBreak: firstBreak,
      })
    }
  }, [firstBreak])


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
        socket.emit('frame_update_players', {
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

  function ChoosePlayer(teamId, playerIdx, frameIdx) {
    props.navigation.navigate('Roster', {
      teams: teams,
      frameInfo: {playerIdx, frameIdx, teamId},
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

  function SetWinner(teamId, playerIds, frameIdx) {
    const _frames = [...frames]
    _frames[frameIdx].winner = teamId
    socket.emit('frame_update_win', {
      type: 'win',
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
                  onValueChange={newValue => setFirstBreak(newValue)}
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
                        <RadioButton
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
                        <RadioButton
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
                    {userTeam === 'home' ? (
                      <Button
                        disabled={finalizedHome}
                        onPress={() => setFinalizedHome(true)}
                        mode="elevated">
                        Finalize Home
                      </Button>
                    ) : null}
                  </View>
                  <View style={{flex: 1}}>
                    {userTeam === 'away' ? (
                      <Button
                        disabled={finalizedAway}
                        onPress={() => setFinalizedAway(true)}
                        mode="elevated">
                        Finalize Away
                      </Button>
                    ) : null}
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
