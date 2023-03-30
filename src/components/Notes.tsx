import React from 'react'
import {View} from 'react-native'
import {Colors, Button, IconButton, Text, TextInput} from 'react-native-paper'
import {useAppSelector} from '~/lib/hooks/redux'

interface Note {
  author: string
  timestamp: number
  message: string
  deleted: boolean
}

const Notes = (props: any) => {
  const [newNote, setNewNote] = React.useState('')
  const [showAddNew, setAddNew] = React.useState(false)
  const user = useAppSelector(_state => _state.user)

  return (
    <View>
      {typeof props.matchInfo.notes !== 'undefined' &&
        props.matchInfo.notes.map((note: Note) => {
          return (
            <View>
              <Text>{note.timestamp}</Text>
              <Text>{note.author}</Text>
              <Text>{note.message}</Text>
              {!props.matchInfo.finalized && <IconButton icon="cancel" />}
            </View>
          )
        })}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          icon="plus-circle"
          mode="outlined"
          onPress={() => setAddNew(true)}>
          <Text>Add a note</Text>
        </Button>
      </View>
      {showAddNew && (
        <TextInput
          value={newNote}
          onChangeText={text => setNewNote(text)}
          multiline
          numberOfLines={3}
        />
      )}
    </View>
  )
}

export default Notes
