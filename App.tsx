import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MyHoldings from "./src/components/MyHoldings"

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <View style={{ flex: 1, backgroundColor: 'white',  }}>

        <MyHoldings />
      </View>
    </>

  )
}

export default App

const styles = StyleSheet.create({})