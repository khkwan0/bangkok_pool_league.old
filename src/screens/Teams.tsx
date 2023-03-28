import React from 'react'
import {FlatList, Text, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import teamsData from '~/testdata/teams'
import TeamCard from '@components/TeamCard'

const Teams = (props: any) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>Team</Text>
      <FlatList
        data={teamsData}
        renderItem={({item}) => <TeamCard team={item} />}
      />
    </SafeAreaView>
  )
}

export default Teams
