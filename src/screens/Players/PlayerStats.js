import React from 'react'
import {Image, View} from 'react-native'
import {ActivityIndicator, Button, Text} from 'react-native-paper'
import LeagueHistory from '@components/LeageHistory'
import StatsHeader from '@components/StatsHeader'
import Stats from '@components/Stats'
import StatsDoubles from '@components/StatsDoubles'
import config from '~/config'
import {useSeason} from '~/lib/hooks'

const PlayerStats = props => {
  const season = useSeason()
  const playerInfo = props.route.params.playerInfo
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDoubleStatsLoading, setIsDoubleStatsLoading] = React.useState(false)
  const [stats, setStats] = React.useState({})
  const [doublesStats, setDoublesStats] = React.useState([])

  React.useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const res = await GetStats()
        setStats(res)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  React.useEffect(() => {
    ;(async () => {
      try {
        setIsDoubleStatsLoading(true)
        const res = await GetDoublesStats()
        setDoublesStats(res)
      } catch (e) {
        console.log(e)
      } finally {
        setIsDoubleStatsLoading(false)
      }
    })()
  }, [])

  async function GetStats() {
    try {
      const res = await season.GetPlayerStats(playerInfo.player_id)
      return res
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }

  async function GetDoublesStats() {
    try {
      const res = await season.GetDoublesStats(playerInfo.player_id)
      return res
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }

  return (
    <View style={{padding: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Image
            source={{uri: config.profileUrl + playerInfo.pic}}
            width={100}
            height={100}
            resizeMode="contain"
            style={{borderRadius: 50}}
          />
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <Button onPress={() => props.navigation.goBack()}>
            {`${playerInfo.name} (${playerInfo.firstname} ${playerInfo.lastname})`}
          </Button>
          <Text>{playerInfo.nationality.en}</Text>
          <View>
            {playerInfo.teams.map((team, idx) => {
              if (idx === playerInfo.teams.length - 1) {
                return <Text key={team + '_' + idx}>{team}</Text>
              } else {
                return <Text key={team + '_' + idx}>{`${team}, `}</Text>
              }
            })}
          </View>
        </View>
      </View>
      {isLoading && (
        <View>
          <ActivityIndicator />
        </View>
      )}
      {!isLoading && (
        <View style={{marginVertical: 20}}>
          <StatsHeader />
          <Stats stats={stats} />
        </View>
      )}
      {isDoubleStatsLoading && (
        <View>
          <ActivityIndicator />
        </View>
      )}
      {!isDoubleStatsLoading && (
        <View style={{marginVertical: 20}}>
          <StatsHeader isDoubles={true} />
          <StatsDoubles stats={doublesStats} />
        </View>
      )}
      <LeagueHistory playerInfo={playerInfo} />
    </View>
  )
}

export default PlayerStats
