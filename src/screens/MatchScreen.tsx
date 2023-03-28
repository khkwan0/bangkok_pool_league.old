import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList, View} from 'react-native'
import {Divider, Text} from 'react-native-paper'
import Frame from '@components/Frame'

const MatchScreen = (props: any) => {
  const [frames, setFrames] = React.useState([
    {
      type: 'singles',
      gameType: 1,
      winner: '',
      homePlayerIds: [],
      awayAPlayerIds: [],
    },
    {
      type: 'singles',
      gameType: 1,
      winner: '',
      homePlayerIds: [],
      awayAPlayerIds: [],
    },
    {
      type: 'doubles',
      gameType: 1,
      winner: '',
      homePlayerIds: [],
      awayAPlayerIds: [],
    },
  ])

  function ChoosePlayer(side, playerIdx, frameIdx) {
    const _frames = [...frames]
    if (side === 'home') {

    } else {

    }
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
  return (
    <SafeAreaView>
      <View style={{alignItems: 'center'}}>
        <Text>{props.matchInfo.awayId} vs {props.matchInfo.homeId}</Text>
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
        ItemSeparatorComponent={<Divider />}
        renderItem={({item, index}) => (
          <Frame
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
