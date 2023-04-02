import React from 'react'
import {View} from 'react-native'
import {Button, Text} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Frame = (props: any) => {
  if (props.frame.type !== 'section') {
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
      <View
        style={
          props.frameIdx % 2 === 1
            ? [{backgroundColor: '#ddd'}]
            : [{backgroundColor: 'white'}]
        }>
        <Text style={{textAlign: 'center'}}>
          Frame {props.frame.frameNumber}
        </Text>
        <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
          <View
            style={{
              flex: 2,
              paddingVertical: 10,
              backgroundColor: '#ff000050',
            }}>
            <Button
              icon={!homePlayerA ? 'plus-circle' : ''}
              onPress={() =>
                props.choosePlayer(
                  props.matchInfo.home_team_id,
                  0,
                  props.frameIdx,
                )
              }>
              {homePlayerA ? homePlayerA : 'Player'}
            </Button>
            {props.gameTypes[props.frame.type].no_players === 2 && (
              <View style={{marginTop: 5}}>
                <Button
                  icon={!homePlayerB ? 'plus-circle' : ''}
                  onPress={() =>
                    props.choosePlayer(
                      props.matchInfo.home_team_id,
                      1,
                      props.frameIdx,
                    )
                  }>
                  {homePlayerB ? homePlayerB : 'Player'}
                </Button>
              </View>
            )}
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {props.firstBreak === props.matchInfo.home_team_id &&
                props.frameIdx % 2 === 0 && <Text>Break</Text>}
              {props.firstBreak === props.matchInfo.away_team_id &&
                props.frameIdx % 2 === 1 && <Text>Break</Text>}
            </View>
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
                disabled={
                  props.gameType === 'doubles'
                    ? homePlayerA && homePlayerB && awayPlayerA && awayPlayerB
                      ? false
                      : true
                    : homePlayerA && awayPlayerA
                    ? false
                    : true
                }
                onPress={() =>
                  props.setWinner(props.matchInfo.home_team_id, props.frameIdx)
                }>
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
                disabled={
                  props.gameType === 'doubles'
                    ? homePlayerA && homePlayerB && awayPlayerA && awayPlayerB
                      ? false
                      : true
                    : homePlayerA && awayPlayerA
                    ? false
                    : true
                }
                onPress={() =>
                  props.setWinner(props.matchInfo.away_team_id, props.frameIdx)
                }>
                win
              </Button>
            )}
          </View>
          <View
            style={{
              flex: 2,
              paddingVertical: 10,
              backgroundColor: '#0000ff22',
            }}>
            <Button
              icon={!awayPlayerA ? 'plus-circle' : ''}
              onPress={() =>
                props.choosePlayer(
                  props.matchInfo.away_team_id,
                  0,
                  props.frameIdx,
                )
              }>
              {awayPlayerA ? awayPlayerA : 'Player'}
            </Button>
            {props.gameTypes[props.frame.type].no_players === 2 && (
              <View style={{marginTop: 5}}>
                <Button
                  icon={!awayPlayerB ? 'plus-circle' : ''}
                  onPress={() =>
                    props.choosePlayer(
                      props.matchInfo.away_team_id,
                      1,
                      props.frameIdx,
                    )
                  }>
                  {awayPlayerB ? awayPlayerB : 'Player'}
                </Button>
              </View>
            )}
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {props.firstBreak === props.matchInfo.away_team_id &&
                props.frameIdx % 2 === 0 && <Text>Break</Text>}
              {props.firstBreak === props.matchInfo.home_team_id &&
                props.frameIdx % 2 === 1 && <Text>Break</Text>}
            </View>
          </View>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
        <View style={{flex: 2}}>
          <Text>Section {props.frame.section}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text variant="displaySmall" style={{textAlign: 'center'}}>
            {props.frame.homeScore}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text variant="displaySmall" style={{textAlign: 'center'}}>
            {props.frame.awayScore}
          </Text>
        </View>
        <View style={{flex: 2}} />
      </View>
    )
  }
}

export default Frame
