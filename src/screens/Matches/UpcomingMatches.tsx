import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {View, FlatList} from 'react-native'
import {Text} from 'react-native-paper'
import MatchCard from '@components/MatchCard'
import {useAppSelector} from '~/lib/hooks/redux'
import {useSeason} from '~/lib/hooks'

const UpcomingMatches = (props: any) => {
  const [fixtures, setFixtures] = React.useState([])
//  const user = useAppSelector(_state => _state.user)
  const user = {
    id: 1933,
  }
  const season = useSeason()

  React.useEffect(() => {
    ;(async () => {
      try {
        let matches = []
        if (typeof user.id !== 'undefined') {
          matches = await season.GetMatches(['userid=' + user.id, 'newonly=1'])
        } else {
          matches = await season.GetMatches()
        }
        setFixtures(matches)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  function HandlePress(idx: number) {
    props.navigation.navigate('Match Screen', {matchInfo: fixtures[idx]})
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <Text variant="titleMedium">Upcoming Matches</Text>
        }
        keyExtractor={(item, index) =>
          item.home_team_id + item.away_team_id + item.date + index
        }
        data={fixtures}
        renderItem={({item, index}) => (
          <MatchCard match={item} idx={index} handlePress={HandlePress} />
        )}
      />
    </View>
  )
}

export default UpcomingMatches
