import React from 'react'
import {View} from 'react-native'
import {Button} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Frame = (props: any) => {
  let awayPlayerA = ''
  let awayPlayerB = ''
  if (props.frame.awayPlayerIds.length > 0) {
    let _player = props.teams[props.matchInfo.away_team_id].find(
      (player: any) => player.playerId === props.frame.awayPlayerIds[0],
    )
    awayPlayerA = _player.nickname
    if (props.frame.awayPlayerIds.length > 1) {
      _player = props.teams[props.matchInfo.away_team_id].find(
        (player: any) => player.playerId === props.frame.awayPlayerIds[1],
      )
      awayPlayerB = _player.nickname
    }
  }

  let homePlayerA = ''
  let homePlayerB = ''
  if (props.frame.homePlayerIds.length > 0) {
    let _player = props.teams[props.matchInfo.home_team_id].find(
      (player: any) => player.playerId === props.frame.homePlayerIds[0],
    )
    homePlayerA = _player.nickname
    if (props.frame.homePlayerIds.length > 1) {
      _player = props.teams[props.matchInfo.home_team_id].find(
        (player: any) => player.playerId === props.frame.homePlayerIds[1],
      )
      homePlayerB = _player.nickname
    }
  }

  return (
    <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
      <View
        style={{flex: 2, paddingVertical: 10, backgroundColor: '#ff000050'}}>
        <Button
          icon="plus-circle"
          onPress={() =>
            props.choosePlayer(props.matchInfo.home_team_id, 0, props.frameIdx)
          }>
          {homePlayerA ? homePlayerA : 'Player'}
        </Button>
        {props.frame.type === 'doubles' && (
          <View style={{marginTop: 5}}>
            <Button
              icon="plus-circle"
              onPress={() =>
                props.choosePlayer(props.matchInfo.home_team_id, 1, props.frameIdx)
              }>
              {homePlayerB ? homePlayerB : 'Player'}
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
        {props.frame.winner === props.matchInfo.home_team_id && (
          <MaterialCommunityIcons name="check" color="green" size={30} />
        )}
        {props.frame.winner !== props.matchInfo.home_team_id && (
          <Button
            onPress={() => props.setWinner(props.matchInfo.home_team_id, props.frameIdx)}>
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
        {props.frame.winner === props.matchInfo.away_team_id && (
          <MaterialCommunityIcons name="check" color="green" size={30} />
        )}
        {props.frame.winner !== props.matchInfo.away_team_id && (
          <Button
            onPress={() => props.setWinner(props.matchInfo.away_team_id, props.frameIdx)}>
            win
          </Button>
        )}
      </View>
      <View
        style={{flex: 2, paddingVertical: 10, backgroundColor: '#0000ff22'}}>
        <Button
          icon="plus-circle"
          onPress={() =>
            props.choosePlayer(props.matchInfo.away_team_id, 0, props.frameIdx)
          }>
          {awayPlayerA ? awayPlayerA : 'Player'}
        </Button>
        {props.frame.type === 'doubles' && (
          <View style={{marginTop: 5}}>
            <Button
              icon="plus-circle"
              onPress={() =>
                props.choosePlayer(props.matchInfo.away_team_id, 1, props.frameIdx)
              }>
              {awayPlayerB ? awayPlayerB : 'Player'}
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}

export default Frame
