import React from 'react'
import {FlatList, View} from 'react-native'
import {Button} from 'react-native-paper'
import Notes from '@components/Notes'
import History from '@components/History'
import {useNetwork} from '~/lib/hooks'

const ExtendedMatchInfo = props => {
  const screens = [<Notes />, <History />]
  const network = useNetwork()
  const matchInfo = props.route.params.matchInfo
  console.log(matchInfo.match_id)

  async function HandleSaveNote(newNote = '') {
    network.SocketSend('newNote', {newNote})
  }

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
            return (
              <Notes
                matchInfo={props.route.params.matchInfo}
                handleSaveNote={HandleSaveNote}
              />
            )
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
