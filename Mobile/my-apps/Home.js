import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CitiriMedicale from './CitiriMedicale';
import IstoricCitiri from './IstoricCitiri';
import MessagePage from './MessagePage';

const Stack = createStackNavigator();

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [
        { key: 'Citiri medicale', component: CitiriMedicale },
        { key: 'Istoric citiri', component: IstoricCitiri },
        { key: 'Mesaje', component: MessagePage },
      ],
    };
  }

  renderRow = ({ item }) => {
    const Component = item.component;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate(item.key);
        }}
      >
        <View style={styles.row}>
          <Text style={styles.rowText}>{item.key}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.tableData} renderItem={this.renderRow} />
      </View>
    );
  }
}

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="Citiri medicale" component={CitiriMedicale} />
      <Stack.Screen name="Istoric citiri" component={IstoricCitiri} />
      <Stack.Screen name="Mesaje" component={MessagePage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  rowText: {
    fontSize: 18,
  },
});

export default App;
