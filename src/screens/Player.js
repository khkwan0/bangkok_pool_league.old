import React from 'react'
import {useLeague} from '~/lib/hooks'
import {View} from 'react-native'
import {ActivityIndicator, Text} from 'react-native-paper'

const Player = props => {
  const league = useLeague()
  const [player, setPlayer] = React.useState({})
  const [isMounted, setIsMounted] = React.useState(false)
  const playerId = props.playerId ?? props.route.params.playerId ?? 0

  React.useEffect(() => {
    ;(async () => {
      try {
        const res = await league.GetPlayerInfo(props.playerId)
        setPlayer(res)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  if (isMounted) {
    return (
      <View>

      </View>
    )
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
}

export default Player
