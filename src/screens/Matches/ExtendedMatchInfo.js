import React from 'react'
import {FlatList, View} from 'react-native'
import {Button} from 'react-native-paper'
import Notes from '@components/Notes'
import History from '@components/History'

const ExtendedMatchInfo = props => {
  const screens = [<Notes />, <History />]

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: 5,
            }}>
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => props.navigation.goBack()}>
              Back
            </Button>
          </View>
        }
        data={screens}
        renderItem={({item, index}) => {
          if (index === 0) {
            return <Notes matchInfo={props.route.params.matchInfo} />
          }
          if (index === 1) {
            return <History />
          }
        }}
      />
    </View>
  )
}

export default ExtendedMatchInfo
