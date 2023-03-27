import React from 'react'
import {FlatList, Text, View} from 'react-native'
import teamsData from '~/testdata/teams'
import TeamCard from '@components/TeamCard'

const Teams = props => {
  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <Text>Teams</Text>
      <FlatList
        data={teamsData}
        renderItem={({item}) => <TeamCard team={item} />}
      />
    </View>
  )
}

export default Teams
