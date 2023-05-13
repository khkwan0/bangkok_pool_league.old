import React from 'react'
import {View} from 'react-native'
import {Text} from 'react-native-paper'

const LeagueHistory = ({playerInfo}) => {
  return (
    <View>
      {Object.keys(playerInfo.seasons).map((season, seasonIdx) => {
        return (
          <View key={season + '_' + seasonIdx}>
            {Object.keys(playerInfo.seasons[season]).map((team, teamIdx) => (
              <View
                key={team + '_' + teamIdx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>{team}</Text>
                <Text>{season}</Text>
                <Text>{playerInfo.seasons[season][team]} frames</Text>
              </View>
            ))}
          </View>
        )
      })}
    </View>
  )
}

export default LeagueHistory
