import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList, View} from 'react-native'
import {Button, Divider, Text} from 'react-native-paper'
import Frame from '@components/Frame'
import Roster from '@components/Roster'
import {io} from 'socket.io-client'
import config from '~/config'
import {useFocusEffect} from '@react-navigation/native'
import Notes from '@components/Notes'
import {useAppSelector} from '~/lib/hooks/redux'

const MatchScreen = (props: any) => {
  const matchInfo = props.route.params.matchInfo
  const socket = React.useRef(null)
  const user = useAppSelector(_state => _state.user)

  useFocusEffect(
    React.useCallback(() => {
      const roomId = 'asd'
      socket.current = io('https://' + config.domain)
      const engine = socket.current.io.engine
      engine.once('upgrade', () => {
        console.log(engine.transport.name)
      })
      socket.current.on('connect', () => {
        console.log('connected', socket.current.id)
        socket.current.emit('join', roomId)
      })

      socket.current.on('disconnect', () => {
        console.log('disconnected')
      })
      return () => socket.current.disconnect()
    }, []),
  )

  const [frames, setFrames] = React.useState([
    {
      type: 'singles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'singles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'singles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'singles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'doubles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'doubles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'doubles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
    {
      type: 'doubles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: false,
    },
  ])
  const [showRoster, setShowRoster] = React.useState({
    teamId: -1,
    playerIdx: -1,
    frameIdx: -1,
  })

  const teams: any = {}
  teams[matchInfo.away_team_id] = {
    teamId: matchInfo.away_team_id,
    name: 'Blue Boar',
    players: [
      {
        playerId: 1,
        firstName: 'Kenneth',
        lastName: 'K',
      },
      {
        playerId: 2,
        firstName: 'Su',
        lastName: 'M',
      },
    ],
  }
  teams[matchInfo.home_team_id] = {
    teamId: matchInfo.home_team_id,
    name: 'Sportman',
    players: [
      {
        playerId: 3,
        firstName: 'Rico',
        lastName: 'T',
      },
      {
        playerId: 4,
        firstName: 'John',
        lastName: 'W',
      },
    ],
  }

  function AddSinglesFrame() {
    const _frames = [...frames]
    _frames.push({
      type: 'singles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: true,
    })
    setFrames(_frames)
  }

  function AddDoublesFrame() {
    const _frames = [...frames]
    _frames.push({
      type: 'doubles',
      gameType: 1,
      winner: null,
      homePlayerIds: [],
      awayPlayerIds: [],
      timestamp: 0,
      lastUpdate: 0,
      changedBy: 0,
      lastChangedBy: 0,
      addOn: true,
    })
    setFrames(_frames)
  }

  function RemoveFrame(idx: number) {
    const _frames = [...frames]
    _frames.splice(idx, 1)
    setFrames(_frames)
  }

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
    setFrames(_frames)
  }

  function CancelPlayerSelect() {
    setShowRoster({teamId: -1, frameIdx: -1, playerIdx: -1})
  }

  let awayScore = 0
  let homeScore = 0
  frames.forEach(frame => {
    if (frame.winner === matchInfo.home_team_id) {
      homeScore++
    }
    if (frame.winner === matchInfo.away_team_id) {
      awayScore++
    }
  })

  if (
    showRoster.teamId >= 0 &&
    showRoster.frameIdx >= 0 &&
    showRoster.playerIdx >= 0
  ) {
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
  }
  return (
    <SafeAreaView>
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
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text variant="headlineMedium" style={{textAlign: 'center'}}>
                  {matchInfo.home_team_short_name}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text>VS</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text variant="headlineMedium" style={{textAlign: 'center'}}>
                  {matchInfo.away_team_short_name}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text variant="displayMedium">{awayScore}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text variant="displayMedium">{homeScore}</Text>
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
              <Button onPress={() => AddSinglesFrame()}>
                Add an extra Singles Frame
              </Button>
              <Button onPress={() => AddDoublesFrame()}>
                Add an extra Doubles Frame
              </Button>
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
        stickyFoot
        renderItem={({item, index}) => (
          <Frame
            removeFrame={RemoveFrame}
            matchInfo={matchInfo}
            teams={teams}
            frame={item}
            choosePlayer={ChoosePlayer}
            setWinner={SetWinner}
            frameIdx={index}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default MatchScreen
