import React from 'react'
import {FlatList, View} from 'react-native'
import {ActivityIndicator, Text} from 'react-native-paper'
import Icon from '@components/Icon'
import {useNavigation} from '@react-navigation/native'
import {useSeason} from '~/lib/hooks'

const MatchLine = ({data}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1}}>
        <Text style={{color: '#888'}}>{data.gameType}</Text>
      </View>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        {data.homePlayers.map((player, index) => {
          const color = data.home_win === 1 ? '#00f' : '#f00'
          if (index === data.homePlayers.length - 1) {
            return (
              <Text style={{color: color}} key={player.id + '_' + index}>
                {player.nickname}
              </Text>
            )
          } else {
            return (
              <Text style={{color: color}} key={player.id + '_' + index}>
                {player.nickname},{' '}
              </Text>
            )
          }
        })}
        {data.home_win === 1 && <Icon name="check" color="#0f0" />}
      </View>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        {data.awayPlayers.map((player, index) => {
          const color = data.home_win === 0 ? '#00f' : '#f00'
          if (index === data.homePlayers.length - 1) {
            return (
              <Text style={{color: color}} key={player.id + '_' + index}>
                {player.nickname}
              </Text>
            )
          } else {
            return (
              <Text style={{color: color}} key={player.id + '_' + index}>
                {player.nickname},{' '}
              </Text>
            )
          }
        })}
        {data.home_win === 0 && <Icon name="check" color="#0f0" />}
      </View>
    </View>
  )
}

const MatchScreen = ({matchId}) => {
  const season = useSeason()
  const navigation = useNavigation()
  const [matchData, setMatchData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const res = await season.GetMatchStats(matchId)
        setMatchData(res)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [matchId])

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  } else if (matchData.length > 0) {
    return (
      <View style={{padding: 20}}>
        <FlatList
          data={matchData}
          renderItem={({item, index}) => <MatchLine data={item} />}
        />
      </View>
    )
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No Data</Text>
      </View>
    )
  }
}

export default MatchScreen
