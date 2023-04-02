import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList, View} from 'react-native'
import {
  Button,
  Divider,
  Modal,
  Portal,
  RadioButton,
  Text,
} from 'react-native-paper'
import Frame from '@components/Frame'
import Roster from '@components/Roster'
import {io} from 'socket.io-client'
import config from '~/config'
import {useFocusEffect} from '@react-navigation/native'
import Notes from '@components/Notes'
import {useAppSelector} from '~/lib/hooks/redux'
import {useTeams, useSeason} from '~/lib/hooks'

const MatchScreen = (props: any) => {
  const matchInfo = props.route.params.matchInfo
  const socket = React.useRef(null)
  const user = useAppSelector(_state => _state.user)
  const team = useTeams()
  const season = useSeason()
  const [gameTypes, setGameTypes] = React.useState({})
  const [teams, setTeams] = React.useState({})
  const [firstBreak, setFirstBreak] = React.useState(null)
  const [frames, setFrames] = React.useState([])
  const [isMounted, setIsMounted] = React.useState(false)
  const [homeScore, setHomeScore] = React.useState(0)
  const [awayScore, setAwayScore] = React.useState(0)

  useFocusEffect(
    React.useCallback(() => {
      const roomId = matchInfo.home_team_id + 'vs' + matchInfo.away_team_id + matchInfo.date
      socket.current = io('https://' + config.domain)
      const engine = socket.current.io.engine
      engine.once('upgrade', () => {
      })
      socket.current.on('connect', () => {
        socket.current.emit('join', roomId)
      })

      socket.current.on('disconnect', () => {
      })
      return () => socket.current.disconnect()
    }, []),
  )

  useFocusEffect(
    React.useCallback(() => {
      ;(async () => {
        const _teams: any = {}
        if (typeof matchInfo.home_team_id !== 'undefined') {
          const homePlayers = await team.GetPlayers(matchInfo.home_team_id)
          _teams[matchInfo.home_team_id] = homePlayers
        }
        if (typeof matchInfo.away_team_id !== 'undefined') {
          const awayPlayers = await team.GetPlayers(matchInfo.away_team_id)
          _teams[matchInfo.away_team_id] = awayPlayers
        }
        setTeams(_teams)
      })()
    }, []),
  )

  React.useEffect(() => {
    ;(async () => {
      const _gameTypes = await season.GetGameTypes()
      setGameTypes(_gameTypes)
      setIsMounted(true)
    })()
  }, [])

  React.useEffect(() => {
    const _format = JSON.parse(matchInfo.format)
    const sections = _format[0].subsections
    const _frames: Array<any> = []
    let frame_number = 1
    let section_count = 1
    sections.forEach((section: any) => {
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

  const [showRoster, setShowRoster] = React.useState({
    teamId: -1,
    playerIdx: -1,
    frameIdx: -1,
  })

  function ChoosePlayer(teamId: number, playerIdx: number, frameIdx: number) {
    setShowRoster({teamId, playerIdx, frameIdx})
  }

  function HandleSelect(frameInfo: any, playerId: number) {
    const _frames = [...frames]
    if (frameInfo.teamId === matchInfo.away_team_id) {
      _frames[frameInfo.frameIdx].awayPlayerIds[frameInfo.playerIdx] = playerId
    } else {
      _frames[frameInfo.frameIdx].homePlayerIds[frameInfo.playerIdx] = playerId
    }
    setFrames(_frames)
    setShowRoster({teamId: -1, frameIdx: -1, playerIdx: -1})
  }

  function SetWinner(teamId: number, frameIdx: number) {
    const _frames = [...frames]
    _frames[frameIdx].winner = teamId
    _frames[frameIdx].timestamp > 0
      ? (_frames[frameIdx].lastUpdate = Date.now())
      : (_frames[frameIdx].timestamp = Date.now())
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
    setFrames(__frames)
    setAwayScore(awayScore)
    setHomeScore(homeScore)
  }

  function CancelPlayerSelect() {
    setShowRoster({teamId: -1, frameIdx: -1, playerIdx: -1})
  }

  if (
    showRoster.teamId >= 0 &&
    showRoster.frameIdx >= 0 &&
    showRoster.playerIdx >= 0
  ) {
    /*
    return (
      <SafeAreaView>
        <Roster
          cancel={CancelPlayerSelect}
          team={teams[showRoster.teamId]}
          frameInfo={showRoster}
          handleSelect={HandleSelect}
        />
      </SafeAreaView>
    )
    */
  }

  if (isMounted) {
    return (
      <SafeAreaView>
        <Portal>
          <Modal
            visible={
              showRoster.teamId >= 0 &&
              showRoster.frameIdx >= 0 &&
              showRoster.playerIdx >= 0
            }
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              margin: 10,
              maxHeight: '80%',
            }}
            onDismiss={() =>
              setShowRoster({frameIdx: -1, teamId: -1, playerIdx: -1})
            }>
            <Roster
              players={teams[showRoster.teamId]}
              frameInfo={showRoster}
              handleSelect={HandleSelect}
              cancel={CancelPlayerSelect}
            />
          </Modal>
        </Portal>
        <FlatList
          ListHeaderComponent={
            <View style={{backgroundColor: '#fff'}}>
              <View style={{flexDirection: 'row', padding: 5}}>
                <Button
                  mode="contained"
                  onPress={() => props.navigation.goBack()}>
                  Back
                </Button>
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
