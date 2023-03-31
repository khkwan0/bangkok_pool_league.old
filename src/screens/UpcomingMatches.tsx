import React from 'react'
import {Text, FlatList} from 'react-native'
import MatchCard from '@components/MatchCard'
import {SafeAreaView} from 'react-native-safe-area-context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MatchScreen from '@screens/MatchScreen'
import {useAppSelector} from '~/lib/hooks/redux'
import {useSeason} from '~/lib/hooks'

const UpcomingMatches = (props: any) => {
  const [matchIdx, setMatchIdx] = React.useState(null)
  const [fixtures, setFixtures] = React.useState([])
  const user = useAppSelector(_state => _state.user)
  const season = useSeason()

  React.useEffect(() => {
    ;(async () => {
      try {
        let matches = []
        if (typeof user.id !== 'undefined') {
          matches = await season.GetMatches(user.id)
        } else {
          matches = await season.GetMatches()
        }
        setFixtures(matches)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  if (matchIdx !== null) {
    return (
      <MatchScreen matchInfo={fixtures[matchIdx]} setMatchIdx={setMatchIdx} />
    )
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text>Upcoming matches</Text>
        <MaterialCommunityIcons name="circle-outline" />
        <FlatList
          data={fixtures}
          renderItem={({item, index}) => (
            <MatchCard match={item} setMatchIdx={setMatchIdx} idx={index} />
          )}
        />
      </SafeAreaView>
    )
  }
}

export default UpcomingMatches
