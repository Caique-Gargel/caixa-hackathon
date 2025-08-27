import * as React from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import ListProducts from './pages/ListProducts';
import InsertProducts from './pages/InsertProducts';
import SimulateProduct from './pages/SimulateProduct';
import Icon from 'react-native-vector-icons/MaterialIcons';



export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', icon: 'list' },
      { key: 'second', icon: 'add-box' },
      { key: 'third', icon: 'calculate' },
    ],
  };

  _handleIndexChange = (index) => this.setState({ index });

  _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}>
              <Animated.View style={{ opacity }}>
                <Icon name={route.icon} size={30} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };


 _renderScene = ({ route }) => {
  const { index } = this.state;

  switch (route.key) {
    case 'first':
      return <ListProducts isFocused={index === 0} />;
    case 'second':
      return <InsertProducts />;
    case 'third':
      return <SimulateProduct isFocused={index === 0} />;
    default:
      return null;
  }
};

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        tabBarPosition='bottom'  // Added to specify tab bar position
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    padding: 5,
    backgroundColor: '#1263A8',
    flexDirection: 'row',
    marginBottom: StatusBar.currentHeight + 5,


  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
