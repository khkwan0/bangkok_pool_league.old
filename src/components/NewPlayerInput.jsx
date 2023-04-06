import React from 'react'
import {View} from 'react-native'
import {Button, TextInput} from 'react-native-paper'

const NewPlayerInput = props => {
  const [nickname, setNickname] = React.useState('')
  const [showInput, setShowInput] = React.useState(false)

  return (
    <View>
      {!showInput &&
        <Button onPress={() => setShowInput(true)}>Add Player</Button> 
      }
      {showInput &&
        <View>
          <TextInput value={nickname} onChangeText={text => setNickname(text)} />
          <Button disabled={nickname.length < 3}>OK</Button>
        </View>
      }
    </View>
  )
}

export default NewPlayerInput
