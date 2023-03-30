import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList, View} from 'react-native'
import {Button, Divider, Text} from 'react-native-paper'
import Frame from '@components/Frame'
import Roster from '@components/Roster'

const MatchScreen = (props: any) => {
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
  teams[props.matchInfo.awayTeamId] = {
    teamId: props.matchInfo.awayTeamId,
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
  teams[props.matchInfo.homeTeamId] = {
    teamId: props.matchInfo.homeTeamId,
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
    if (frameInfo.teamId === props.matchInfo.awayTeamId) {
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
    if (frame.winner === props.matchInfo.homeTeamId) {
      homeScore++
    }
    if (frame.winner === props.matchInfo.awayTeamId) {
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
              <Button onPress={() => props.setMatchIdx(null)} mode="contained">Back</Button>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text>
                {props.matchInfo.awayTeamId} vs {props.matchInfo.homeTeamId}
              </Text>
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
            <Button onPress={() => AddSinglesFrame()}>Add an extra Singles Frame</Button>
            <Button onPress={() => AddDoublesFrame()}>Add an extra Doubles Frame</Button>
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
            removeFrame={RemoveFrame}
            awayTeamId={props.matchInfo.awayTeamId}
            homeTeamId={props.matchInfo.homeTeamId}
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
