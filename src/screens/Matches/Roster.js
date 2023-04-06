import React from 'react'
import {FlatList, View} from 'react-native'
import PlayerCard from '@components/PlayerCard'
import {Button} from 'react-native-paper'
import NewPlayerInput from '@components/NewPlayerInput'

/*
        <Portal>
          <Modal
            visible={
              showRoster.teamId >= 0 &&
              showRoster.frameIdx >= 0 &&
              showRoster.playerIdx >= 0
            }
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              margin: 10,
              maxHeight: '80%',
            }}
            onDismiss={() =>
              setShowRoster({frameIdx: -1, teamId: -1, playerIdx: -1})
            }>
            <Roster
              players={teams[showRoster.teamId]}
              frameInfo={showRoster}
              handleSelect={HandleSelect}
              cancel={CancelPlayerSelect}
            />
          </Modal>
        </Portal>
        */
const Roster = props => {
/*
  function HandleSelect(frameInfo, playerId) {
    // keep players in an array in frameInfo
    // doubles games will have 2 playerIds in the array
    // playerIdx is either element 0 or element 1 (if doubles)
    const _frames: Array<FrameType> = [...frames]
    let side = 'home'
    if (frameInfo.teamId === matchInfo.away_team_id) {
      side = 'away'
      _frames[frameInfo.frameIdx].awayPlayerIds[frameInfo.playerIdx] = playerId
    } else {
      _frames[frameInfo.frameIdx].homePlayerIds[frameInfo.playerIdx] = playerId
    }
    socket.emit('frame_update_players', {
      matchId: matchInfo.match_id,
      frameIdx: frameInfo.frameIdx,
      side: side,
      playerId: playerId,
      playerIdx: frameInfo.playerIdx,
    })
    setFrames(_frames)
    setShowRoster({teamId: -1, frameIdx: -1, playerIdx: -1})
  }
  */

  function HandleSelect(frameInfo, playerId) {
    props.navigation.navigate('Match Screen', {player: {playerId: playerId, frameInfo: props.route.params.frameInfo}})
  }

  return (
    <FlatList
      ItemSeparatorComponent={<View style={{marginVertical: 5}} />}
      ListHeaderComponent={
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 5,
            justifyContent: 'flex-end',
            paddingBottom: 10,
          }}>
          <Button icon="close" mode="contained" onPress={() => props.navigation.goBack()}>
            Close
          </Button>
        </View>
      }
      ListFooterComponent={<NewPlayerInput />}
      stickyHeaderIndices={[0]}
      data={props.route.params.teams[props.route.params.frameInfo.teamId]}
      renderItem={({item, index}) => (
        <PlayerCard
          idx={index}
          player={item}
          handleSelect={HandleSelect}
          frameInfo={props.route.params.frameInfo}
        />
      )}
    />
  )
}

export default Roster
