import React from 'react'
import {FlatList, View} from 'react-native'
import {Button, Text} from 'react-native-paper'
import {DateTime} from 'luxon'

const HistoryCard = ({item, index}) => {
  console.log(item)
  return (
    <View key={index} style={{margin: 10}}>
      <Text>
        {DateTime.fromMillis(item.timestamp).toLocaleString(
          DateTime.DATETIME_SHORT_WITH_SECONDS,
        )}
      </Text>
      {item.msg.map((txt, idx) => (
        <Text key={index + '_' + idx}>{txt}</Text>
      ))}
    </View>
  )
}

const History = props => {
  const [showHistory, setShowHistory] = React.useState(
    props.matchInfo?.autoShowHistory ?? false,
  )

  return (
    <View>
      <Text variant="headlineMedium" style={{textAlign: 'center'}}>
        History
      </Text>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button mode="outlined" onPress={() => setShowHistory(s => !s)}>
          {showHistory ? 'Hide History' : 'Show History'}
        </Button>
      </View>
      {!showHistory && (
        <View>
          <Text style={{textAlign: 'center'}}>
            ({props.history.length} items)
          </Text>
        </View>
      )}
      {showHistory && (
        <FlatList
          data={props.history}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => (
            <HistoryCard item={item} index={index} />
          )}
        />
      )}
    </View>
  )
}

export default History
