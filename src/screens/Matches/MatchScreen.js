import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList, View} from 'react-native'
import {Button, Divider, RadioButton, Text} from 'react-native-paper'
import Frame from '@components/Frame'
import {useFocusEffect} from '@react-navigation/native'
import Notes from '@components/Notes'
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
  const user = useAppSelector(_state => _state.user)
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

  /*
  useFocusEffect(
    React.useCallback(() => {
      return () => setIsMounted(false)
    }, []),
  )
  */

  const framesRef = React.useRef([])
  const setFramesRef = React.useRef(setFrames)

  React.useEffect(() => {
    framesRef.current = frames
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

    socket.connect()
    socket.on('connect', () => {
      socket.emit('join', roomId, joinStatus => {
        if (joinStatus.status === 'ok') {
          // get matchinfo, may or may not exist yet
          socket.emit('getframes', {matchId: matchInfo.match_id}, response => {
            if (response) {
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
          })
          socket.emit(
            'getmatchinfo',
            {matchId: matchInfo.match_id},
            response => {
              if (
                typeof response &&
                response &&
                typeof response.firstBreak !== 'undefined' &&
                response.firstBreak
              ) {
                setFirstBreak(response.firstBreak)
              }
            },
          )
        }
      })
    })

    const engine = socket.io.engine
    engine.once('upgrade', () => {
      /*
       */
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
  }, [matchInfo])

  React.useEffect(() => {
    ;(async () => {
      const _gameTypes = await season.GetGameTypes()
      setGameTypes(_gameTypes)
    })()
  }, [])

  React.useEffect(() => {
    // keep players in an array in frameInfo
    // doubles games will have 1 playerIds in the array
    // playerIdx is either element -1 or element 1 (if doubles)
    if (isMounted && props.route.params.player) {
      setIsMounted(false)
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
          _frames[frameInfo.frameIdx].awayPlayerIds[frameInfo.playerIdx] = playerId
        } else {
          _frames[frameInfo.frameIdx].homePlayerIds[frameInfo.playerIdx] = playerId
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

  useFocusEffect(
    React.useCallback(() => {
      ;(async () => {
        /*
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
        */
        await UpdateTeams()
        setIsMounted(true)
        setIsLoading(false)
      })()
    }, []),
  )

  function ChoosePlayer(teamId, playerIdx, frameIdx) {
    props.navigation.navigate('Roster', {
      teams: teams,
      frameInfo: {playerIdx, frameIdx, teamId},
    })
  }

  function UpdateScore(_frames) {
    let awayScore = 0
    let homeScore = 0
    const __frames = _frames.map(frame => {
      if (frame.winner === matchInfo.home_team_id) {
        homeScore++
      }
      if (frame.winner === matchInfo.away_team_id) {
        awayScore++
      }
      if (frame.type === 'section') {
        frame.homeScore = homeScore
        frame.awayScore = awayScore
      }
      return frame
    })
    setAwayScore(awayScore)
    setHomeScore(homeScore)
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
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={
            <View style={{backgroundColor: '#fff'}}>
              <View style={{flexDirection: 'row', padding: 5}}>
                <Button mode="contained" onPress={() => HandleGoBack()}>
                  Back
                </Button>
              </View>
              <RadioButton.Group
                disabled={isLoading}
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton value={matchInfo.home_team_id} />
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton value={matchInfo.away_team_id} />
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
                  <Button mode="elevated">Finalize Home</Button>
                </View>
                <View style={{flex: 1}}>
                  <Button>Finalize Away</Button>
                </View>
              </View>
              <View>
                <Notes matchInfo={matchInfo} />
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
            />
          )}
        />
      </SafeAreaView>
    )
  } else {
    return null
  }
}

export default MatchScreen
