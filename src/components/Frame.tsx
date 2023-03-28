import React from 'react'
import {View} from 'react-native'
import {Button} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Frame = (props: any) => {
  const awayPlayer = props.frame.awayPlayer ?? null
  const homePlayer = props.frame.awayPlayer ?? null

  return (
    <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
      <View style={{flex: 1, paddingVertical: 10}}>
        <Button
          icon="plus-circle"
          mode="outlined"
          onPress={() => props.choosePlayer('away', 0, props.frameIdx)}>
          {awayPlayer ? awayPlayer : 'Player'}
        </Button>
        {props.frame.type === 'doubles' && (
          <View style={{marginTop: 5}}>
            <Button
              icon="plus-circle"
              mode="outlined"
              onPress={() => props.choosePlayer('away', 1, props.frameIdx)}>
              {awayPlayer ? awayPlayer : 'Player'}
            </Button>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}>
        {props.frame.winner === 'away' && (
          <MaterialCommunityIcons name="check" color="green" size={30} />
        )}
        {props.frame.winner !== 'away' && (
          <Button onPress={() => props.setWinner('away', props.frameIdx)}>
            win
          </Button>
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderLeftWidth: 1,
          paddingVertical: 10,
        }}>
        {props.frame.winner === 'home' && (
          <MaterialCommunityIcons name="check" color="green" size={30} />
        )}
        {props.frame.winner !== 'home' && (
          <Button onPress={() => props.setWinner('home', props.frameIdx)}>
            win
          </Button>
        )}
      </View>
      <View style={{flex: 1, paddingVertical: 10}}>
        <Button
          icon="plus-circle"
          mode="outlined"
          onPress={() => props.choosePlayer('home', props.frameIdx)}>
          {homePlayer ? homePlayer : 'Player'}
        </Button>
        {props.frame.type === 'doubles' && (
          <View style={{marginTop: 5}}>
            <Button
              icon="plus-circle"
              mode="outlined"
              onPress={() => props.choosePlayer('away', 1, props.frameIdx)}>
              {awayPlayer ? awayPlayer : 'Player'}
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}

export default Frame
