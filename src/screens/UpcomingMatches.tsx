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

  const fixturesData = [
    {
      id: 1,
      timestamp: 1679918400000,
      homeTeamId: 1,
      awayTeamId: 2,
      gameType: 1,
      homeFinalized: {
        userId: '',
        timestamp: 0,
      },
      awayFinalized: {
        userId: '',
        timestamp: 0,
      },
    },
    {
      id: 2,
      timestamp: 1679918400000,
      homeTeamId: 3,
      awayTeamId: 4,
      gameType: 2,
      homeFinalized: {
        userId: '',
        timestamp: 0,
      },
      awayFinalized: {
        userId: '',
        timestamp: 0,
      },
    },
    {
      id: 3,
      timestamp: 1680177600000,
      homeTeamId: 1,
      awayTeamId: 3,
      gameType: 2,
      homeFinalized: {
        userId: '',
        timestamp: 0,
      },
      awayFinalized: {
        userId: '',
        timestamp: 0,
      },
    },
  ]

  const gameTypeData = {
    1: '8 ball',
    2: '9 ball',
    3: '8/9 ball',
  }

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
