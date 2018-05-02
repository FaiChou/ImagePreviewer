import React from 'react';
import {
  View,
  Modal,
  Image,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';

const DOUBLE_TAP_INTERVAL = 300;
const TAP_INTERVAL = 150;

export default class ImagePreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      scale: 1,
      top: 0,
      left: 0,
    };
    this.isDoubleClick = false;
    this.grantTime = null;
    this.releaseTime = null;
    this.lastReleaseTime = Date.now();

    this.timer = null;
    this._top = null;
    this._left = null;
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderRelease,
    });
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  handlePanResponderGrant = () => {
    this.grantTime = Date.now();
    this._top = this.state.top;
    this._left = this.state.left;
  }
  handlePanResponderMove = (evt, gs) => {
    console.log('dx: ', gs.dx, ' ', 'dy:', gs.dy);
    this.setState({
      top: this._top + gs.dy,
      left: this._left + gs.dx
    });
  }
  handlePanResponderRelease = (evt, gs) => {
    this.releaseTime = Date.now();
    const tDiff = this.releaseTime - this.grantTime;
    console.log('tap interval: ', tDiff);
    if (tDiff < TAP_INTERVAL) { // fast tap
      if (
        this.releaseTime - this.lastReleaseTime < DOUBLE_TAP_INTERVAL
      ) {
        // double tap
        this.isDoubleClick = true;
        this.zoom();
        // return;
      } else {
        // single tap
        this.isDoubleClick = false;
        this.timer = setTimeout(
          () => { this.closeModalIfNeeded(); },
          500
        );
      }
      this.lastReleaseTime = Date.now();
    }
    // this.setState({
    //   top: this._top + gs.dy,
    //   left: this._left + gs.dx
    // });
  }
  zoom = () => {
    // this.setState(prevState => ({
    //   scale: prevState.scale === 1 ? 2 : 1
    // }));
    if (this.state.scale === 1) {
      // zoom in
      this.setState({ scale: 2 });
    } else {
      // zoom out
      this.resetState();
    }
  }
  resetState = () => {
    this._top = 0;
    this._left = 0;
    this.setState({
      scale: 1,
      top: 0,
      left: 0,
    });
  }
  closeModalIfNeeded = () => {
    console.log('closeModalIfNeeded');
    if (this.isDoubleClick) {
      return;
    }
    this.closeModal();
  }
  showModal = () => {
    this.setState({ modalVisible: true });
  }
  closeModal = () => {
    this.resetState();
    this.setState({
      modalVisible: false,
    });
  }
  render() {
    const {
      style,
      source,
      resizeMode,
    } = this.props;
    const {
      scale,
      top,
      left,
    } = this.state;
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.showModal}>
          <View style={{
            ...style,
          }}>
            <Image style={{
                flex: 1,
                width: style.width || undefined,
                height: style.height || undefined,
              }}
              resizeMode={resizeMode || 'contain'}
              source={source} />
          </View>
        </TouchableWithoutFeedback>
        <Modal
          transparent
          animationType="fade"
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
          }} {...this._panResponder.panHandlers}>
            <Image style={{
                flex: 1,
                position: 'absolute',
                top,
                left,
                width: '100%',
                height: '100%',
                transform: [
                  {scale},
                ]
              }}
              resizeMode={'contain'}
              source={source}
            />
          </View>
        </Modal>
      </View>
    );
  }
}