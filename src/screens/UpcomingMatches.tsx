import React from 'react'
import {View, Text, FlatList} from 'react-native'
import MatchCard from '@components/MatchCard'

const UpcomingMatches = (props: any) => {
  const seasonData = [
    {
      id: 1,
      timestamp: 1679918400000,
      homeId: 1,
      awayId: 2,
      gameType: 1,
    },
    {
      id: 2,
      timestamp: 1679918400000,
      homeId: 3,
      awayId: 4,
      gameType: 2,
    },
    {
      id: 3,
      timestamp: 1680177600000,
      homeId: 1,
      awayId: 3,
      gameType: 2,
    },
  ]

  const gameTypeData = {
    1: '8 ball',
    2: '9 ball',
    3: '8/9 ball',
  }

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <Text>Upcoming matches</Text>
      <FlatList
        data={seasonData}
        renderItem={({item}) => <MatchCard match={item} />}
      />
    </View>
  )
}

export default UpcomingMatches
