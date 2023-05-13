import React from 'react'
import {View} from 'react-native'
import {Text} from 'react-native-paper'

const StatsDoubles = ({stats}) => {
  const fw = 'normal'
  const variant = 'bodyMedium'
  return (
    <>
      {stats.map(stat => {
        return (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 2}}>
              <Text variant={variant} style={{fontWeight: fw}}>
                {stat.nickname}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text variant={variant} style={{fontWeight: fw}}>
                {stat.played}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: fw}}>{stat.won}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text variant={variant} style={{fontWeight: fw}}>
                {stat.winp}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text variant={variant} style={{fontWeight: fw}}>
                {stat.wgtd}
              </Text>
            </View>
          </View>
        )
      })}
    </>
  )
}

export default StatsDoubles
