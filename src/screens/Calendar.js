import React from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import {Text} from 'react-native-paper'
import {useSeason} from '~/lib/hooks'

const winnerStyle = StyleSheet.create({
  fontWeight: 'bold',
  color: '#00b',
  fontSize: 18,
})

const loserStyle = StyleSheet.create({
  fontWeight: 'bold',
  color: '#b00',
  fontSize: 16,
})

const tiedStyle = StyleSheet.create({
  fontWeight: 'bold',
  fontSize: 16,
})

const marginStyle = StyleSheet.create({
  marginLeft: 4,
  borderLeftWidth: 2,
  borderLeftColor: '#aaa',
  paddingLeft: 10,
})

const MatchGrouping = props => {
  const matchDate = Object.keys(props.matches)[0]
  return (
    <View style={{marginLeft: 5}}>
      <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
        <Text style={{color: '#aaa'}}>&#x2b24;</Text>
        <Text variant="headlineMedium" style={{color: '#000'}}>
          {matchDate}
        </Text>
      </View>
      {Object.keys(props.matches[matchDate]).map(divisionName => {
        return (
          <>
            <View style={[marginStyle, {paddingLeft: 20}]}>
              <Text>{divisionName}</Text>
            </View>
            <View>
              {props.matches[matchDate][divisionName].map((match, idx) => {
                const homeStyle =
                  match.home_frames > match.away_frames
                    ? winnerStyle
                    : match.away_frames === match.home_frames
                    ? tiedStyle
                    : loserStyle
                const awayStyle =
                  match.away_frames > match.home_frames
                    ? winnerStyle
                    : match.away_frames === match.home_frames
                    ? tiedStyle
                    : loserStyle

                return (
                  <View
                    key={match.id + '_' + idx}
                    style={[marginStyle, {paddingLeft: 40}]}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <Text style={homeStyle}>{match.home_short_name}</Text>
                      <Text>VS</Text>
                      <Text style={awayStyle}>{match.away_short_name}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </>
        )
      })}
    </View>
  )
}

const Calendar = props => {
  const season = useSeason()
  const [matches, setMatches] = React.useState([])
  const [scrollIndex, setScrollIndex] = React.useState(0)

  React.useEffect(() => {
    ;(async () => {
      const res = await season.GetMatchesBySeason(9)
      console.log(res.scrollIndex)
      //      setScrollIndex(res.scrollIndex ?? 0)
      setMatches(res.matches)
      setScrollIndex(19)
    })()
  }, [])

  return (
    <View>
      <FlatList
        data={matches}
        getItemLayout={(data, idx) => {
          return {
            length: 120,
            offset: 300 * idx,
            index: idx,
          }
        }}
        initialScrollIndex={scrollIndex}
        renderItem={({item}) => <MatchGrouping matches={item} />}
      />
    </View>
  )
}

export default Calendar
