import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {View, FlatList} from 'react-native'
import {Button, Text} from 'react-native-paper'
import MatchCard from '@components/MatchCard'
import {useAppSelector} from '~/lib/hooks/redux'
import {useSeason} from '~/lib/hooks'
import userSlice from '~/redux/userSlice'

const UpcomingMatches = (props: any) => {
  const [fixtures, setFixtures] = React.useState([])
  const {user} = useAppSelector(_state => _state.user)
  const season = useSeason()

  React.useEffect(() => {
    ;(async () => {
      try {
        const matches = await season.GetMatches(['newonly=1'])
        setFixtures(matches)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [user])

  function HandlePress(idx: number) {
    props.navigation.navigate('Match Screen', {matchInfo: fixtures[idx]})
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <View>
            {!user.data.id && (
              <Button onPress={() => props.navigation.navigate('Me')}>
                Login to see your matches
              </Button>
            )}
          </View>
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
