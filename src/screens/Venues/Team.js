import React from 'react'
import {Image, ScrollView, View} from 'react-native'
import {ActivityIndicator, Text} from 'react-native-paper'
import TwoColumns from '~/components/TwoColumns'
import {useLeague} from '~/lib/hooks'

const Team = props => {
  const league = useLeague()
  const [team, setTeam] = React.useState({})
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      try {
        const teamId = props.route.params.team.id
        const res = await league.GetTeamInfo(teamId)
        setTeam(res)
      } catch (e) {
        console.log(e)
      } finally {
        setIsMounted(true)
      }
    })()
  }, [props.route.params.team])

  if (isMounted) {
    return (
      <ScrollView style={{paddingBottom: 30}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: 'https://api.bkkleague.com/logos/' + team.venue_logo}}
            width={100}
            height={100}
            resizeMode="contain"
          />
        </View>
        <View style={{marginTop: 20}}>
          <TwoColumns label="name">
            <Text variant="titleLarge">{team.name}</Text>
          </TwoColumns>
        </View>
        <View style={{marginTop: 20}}>
          {team.captains.map((captain, idx) => (
            <TwoColumns
              key={'captain' + idx}
              label={idx === 0 ? 'captain' : ''}>
              <View style={{flexDirection: 'row', gap: 5}}>
                <Text>{captain.flag}</Text>
                <Text variant="bodyLarge">{captain.nickname}</Text>
                <Text variant="bodyLarge">
                  ({captain.firstname} {captain.lastname})
                </Text>
              </View>
            </TwoColumns>
          ))}
          {team.assistants.map((assistant, idx) => (
            <TwoColumns
              key={'assistant' + idx}
              label={idx === 0 ? 'assistants' : ''}>
              <View style={{flexDirection: 'row', gap: 5}}>
                <Text>{assistant.flag}</Text>
                <Text variant="bodyLarge">{assistant.nickname}</Text>
                <Text variant="bodyLarge">
                  ({assistant.firstname} {assistant.lastname})
                </Text>
              </View>
            </TwoColumns>
          ))}
        </View>
        <View style={{marginTop: 20}}>
          {team.players.map((player, idx) => (
            <TwoColumns key={'player' + idx} label={idx === 0 ? 'players' : ''}>
              <View style={{flexDirection: 'row', gap: 5}}>
                <Text>{player.flag}</Text>
                <Text variant="bodyLarge">{player.nickname}</Text>
                <Text variant="bodyLarge">
                  ({player.firstname} {player.lastname})
                </Text>
              </View>
            </TwoColumns>
          ))}
        </View>
      </ScrollView>
    )
  } else {
    return <ActivityIndicator />
  }
}

export default Team
