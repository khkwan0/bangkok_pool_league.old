import React from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import {View} from 'react-native'
import {Text} from 'react-native-paper'

const PlayerSelector = (props: any) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    if (isMounted) {
      if (props.isOpen) {
        bottomSheetRef.current.open()
      }
    }
    return () => bottomSheetRef.current.close()
  }, [props])

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <BottomSheet
      index={-1}
      snapPoints={['100%']}
      ref={bottomSheetRef}
    >
      <View><Text>hello</Text></View>
    </BottomSheet>
  )
}

export default PlayerSelector
