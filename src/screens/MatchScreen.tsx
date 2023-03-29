import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList, View} from 'react-native'
import {Divider, Text} from 'react-native-paper'
import Frame from '@components/Frame'
import Roster from '@components/Roster'

const MatchScreen = (props: any) => {
  const [frames, setFrames] = React.useState([
    {
      type: 'singles',
      gameType: 1,
      winner: '',
      homePlayerIds: [],
      awayPlayerIds: [],
    },
    {
      type: 'singles',
      gameType: 1,
      winner: '',
      homePlayerIds: [],
      awayPlayerIds: [],
    },
    {
      type: 'doubles',
      gameType: 1,
      winner: '',
      homePlayerIds: [],
      awayPlayerIds: [],
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

  function ChoosePlayer(teamId: number, playerIdx: number, frameIdx: number) {
    setShowRoster({teamId, playerIdx, frameIdx})
  }

  function HandleSelect(frameInfo: any, playerId: number) {
    console.log('frameinfo', frameInfo, props.matchInfo.awayTeamId, props.matchInfo)
    const _frames = [...frames]
    if (frameInfo.teamId === props.matchInfo.awayTeamId) {
      _frames[frameInfo.frameIdx].awayPlayerIds[frameInfo.playerIdx] = playerId
    } else {
      _frames[frameInfo.frameIdx].homePlayerIds[frameInfo.playerIdx] = playerId
    }
    setFrames(_frames)
    setShowRoster({teamId: -1, frameIdx: -1, playerIdx: -1})
  }

  function SetWinner(side: string, frameIdx: number) {
    const _frames = [...frames]
    _frames[frameIdx].winner = side
    setFrames([..._frames])
  }

  let awayScore = 0
  let homeScore = 0
  frames.forEach(frame => {
    if (frame.winner === 'home') {
      homeScore++
    }
    if (frame.winner === 'away') {
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
          team={teams[showRoster.teamId]}
          frameInfo={showRoster}
          handleSelect={HandleSelect}
        />
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView>
      <View style={{alignItems: 'center'}}>
        <Text>{props.matchInfo.awayTeamId} vs {props.matchInfo.homeTeamId}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text variant="displayMedium">{awayScore}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text variant="displayMedium">{homeScore}</Text>
        </View>
      </View>
      <FlatList
        data={frames}
        ItemSeparatorComponent={<Divider bold/>}
        renderItem={({item, index}) => (
          <Frame
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
