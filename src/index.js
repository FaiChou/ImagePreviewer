import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Modal,
  Image,
  Platform,
  BackHandler,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';

const DOUBLE_TAP_INTERVAL = 300;
const TAP_INTERVAL = 150;
const CLOSE_MODAL_DELAY = 500;

function coroutine(f) {
  const o = f(); // instantiate the coroutine
  o.next(); // execute until the first yield
  return function(x) {
    o.next(x);
  };
}

class ImagePreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      scale: 1,
      top: 0,
      left: 0,
    };

    this.timer = null;
    const that = this;
    this.loop = coroutine(function*() {
      let e = {};
      let lastUpTime = Date.now();
      while (e = yield) {
        if (e.type === 'touchdown') {
          const downTime = Date.now();
          const oldTop = that.state.top;
          const oldLeft = that.state.left;
          that.cancelCloseTaskIfNeeded();
          while (e = yield) {
            if (e.type === 'touchmove') {
              const newTop = oldTop + e.gs.dy;
              const newLeft = oldLeft + e.gs.dx;
              that.handleMove({ top: newTop, left: newLeft});
            }
            if (e.type === 'touchup') {
              const upTime = Date.now();
              if (upTime - downTime > TAP_INTERVAL) break; // if not fast tap
              if (upTime - lastUpTime > DOUBLE_TAP_INTERVAL) {
                lastUpTime = Date.now();
                that.timer = setTimeout(
                  () => { that.closeModalIfNeeded(); },
                  CLOSE_MODAL_DELAY
                );
                break;
              } else {
                that.zoom();
                break;
              }
            }
          }
        }
      }
    });
  }
  componentWillMount() {
    this.addAndroidListener();
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
    this.removeAndroidListener();
  }
  addAndroidListener = () => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);
    }
  }
  removeAndroidListener = () => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this._onBackAndroid);
    }
  }
  _onBackAndroid = () => {
    if (this.state.modalVisible) {
      this.closeModal();
      return true;
    }
    return false;
  }

  handleMove = (offset) => {
    this.setState(offset);
  }

  handlePanResponderGrant = () => {
    this.loop({ type: 'touchdown' });
  }
  handlePanResponderMove = (evt, gs) => {
    this.loop({ type: 'touchmove', gs });
  }
  handlePanResponderRelease = () => {
    this.loop({ type: 'touchup' });
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

  cancelCloseTaskIfNeeded = () => {
    this.timer && clearTimeout(this.timer);
  }
  closeModalIfNeeded = () => {
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

ImagePreviewer.propTypes = {
  style: PropTypes.any,
  resizeMode: PropTypes.string,
  source: PropTypes.any.isRequired,
};

export default ImagePreviewer;
