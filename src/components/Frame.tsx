import React from 'react'
import {View} from 'react-native'
import {Button} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Frame = (props: any) => {
  console.log(props.frame)
  let awayPlayerA = ''
  let awayPlayerB = ''
  if (props.frame.awayPlayerIds.length > 0) {
    let _player = props.teams[props.awayTeamId].players.find((player: any) => player.playerId === props.frame.awayPlayerIds[0])
    awayPlayerA = _player.firstName + ' ' + _player.lastName
    if (props.frame.awayPlayerIds.length > 1) {
      _player = props.teams[props.awayTeamId].players.find((player: any) => player.playerId === props.frame.awayPlayerIds[1])
      awayPlayerB = _player.firstName + ' ' + _player.lastName
    }
  }

  let homePlayerA = ''
  let homePlayerB = ''
  if (props.frame.homePlayerIds.length > 0) {
    let _player = props.teams[props.homeTeamId].players.find((player: any) => player.playerId === props.frame.homePlayerIds[0])
    homePlayerA = _player.firstName + ' ' + _player.lastName
    if (props.frame.homePlayerIds.length > 1) {
      _player = props.teams[props.homeTeamId].players.find((player: any) => player.playerId === props.frame.homePlayerIds[1])
      homePlayerB = _player.firstName + ' ' + _player.lastName
    }
  }

  return (
    <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
      <View style={{flex: 2, paddingVertical: 10}}>
        <Button
          icon="plus-circle"
          onPress={() =>
            props.choosePlayer(props.awayTeamId, 0, props.frameIdx)
          }>
          {awayPlayerA ? awayPlayerA : 'Player'}
        </Button>
        {props.frame.type === 'doubles' && (
          <View style={{marginTop: 5}}>
            <Button
              icon="plus-circle"
              onPress={() =>
                props.choosePlayer(props.awayTeamId, 1, props.frameIdx)
              }>
              {awayPlayerB ? awayPlayerB : 'Player'}
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
      <View style={{flex: 2, paddingVertical: 10}}>
        <Button
          icon="plus-circle"
          onPress={() =>
            props.choosePlayer(props.homeTeamId, 0, props.frameIdx)
          }>
          {homePlayerA ? homePlayerA : 'Player'}
        </Button>
        {props.frame.type === 'doubles' && (
          <View style={{marginTop: 5}}>
            <Button
              icon="plus-circle"
              onPress={() =>
                props.choosePlayer(props.homeTeamId, 1, props.frameIdx)
              }>
              {homePlayerB ? homePlayerB : 'Player'}
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}

export default Frame
