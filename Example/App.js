import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ImagePreviewer from '../src';
import MountHuang from './MountHuang.png';
const { width } = Dimensions.get('window');

export default class App extends React.Component {
  render() {
    const ImgWidth = width;
    const ImgHeight = ImgWidth * 0.6;
    return (
      <View style={styles.container}>
        <ImagePreviewer
          source={MountHuang}
          style={{
            width: ImgWidth,
            height: ImgHeight,
          }}
          resizeMode="stretch"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
