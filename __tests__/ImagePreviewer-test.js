import React from 'React';
import ReactTestRenderer from 'react-test-renderer';
import ImagePreviewer from '../index';
const ImgWidth = 300;
const ImgHeight = ImgWidth * 0.6;

describe('ImagePreviewer', () => {
  it('renders correctly', () => {
    const instance = ReactTestRenderer.create(
      <ImagePreviewer
        source={{uri: 'http://o7bkcj7d7.bkt.clouddn.com/2.png'}}
        style={{
          width: ImgWidth,
          height: ImgHeight,
        }}
        resizeMode="stretch"
      />
    );

    expect(instance.toJSON()).toMatchSnapshot();
  });
});