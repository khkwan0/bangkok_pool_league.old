import React from 'react'
import {View} from 'react-native'
import {Text} from 'react-native-paper'
import {DateTime} from 'luxon'

const StatsMatchPerformance = ({stats}) => {
  return (
    <View>
      {stats.map((stat, index) => {
        return (
          <View
            key={stat.date + '_' + index}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 2}}>
              <Text>{DateTime.fromISO(stat.date).toFormat('dd.MM.yyyy')}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text>
                {stat.singlesPlayed}/{stat.singlesWon}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text>
                {stat.doublesPlayed}/{stat.doublesWon}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text>
                {stat.doublesPlayed}/{stat.doublesWon}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default StatsMatchPerformance
