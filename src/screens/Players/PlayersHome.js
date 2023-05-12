import React from 'react'
import {FlatList, Pressable, View} from 'react-native'
import {Text} from 'react-native-paper'
import {useLeague} from '~/lib/hooks'
import {useNavigation} from '@react-navigation/native'

const PlayerCard = ({team, idx}) => {
  const bgColor = idx % 2 ? '#eee' : '#fff'
  const navigation = useNavigation()

  function HandlePress() {
    navigation.navigate('Player', {team: team})
  }

  return (
    <Pressable onPress={() => HandlePress()}>
      <View style={{backgroundColor: bgColor, padding: 15}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text>{team.short_name}</Text>
            <Text>{team.division_short_name}</Text>
          </View>
          <View>
            <Text>{team.total_players} players &gt;</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const PlayersHome = props => {
  const league = useLeague()
  const [players, setPlayers] = React.useState([])

  React.useEffect(() => {
    try {
      ;(async () => {
        const res = await league.GetPlayers()
        setPlayers(res)
      })()
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <FlatList
      data={players}
      renderItem={({item, index}) => <PlayerCard team={item} idx={index} />}
    />
  )
}

export default PlayersHome
