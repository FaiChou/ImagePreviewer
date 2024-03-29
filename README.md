## ImagePreviewer [![Build Status](https://travis-ci.org/FaiChou/ImagePreviewer.svg?branch=master)](https://travis-ci.org/FaiChou/ImagePreviewer)[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/rc-image-previewer)![license](https://img.shields.io/github/license/mashape/apistatus.svg)

![image-previewer-demo](https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/image-previewer-demo.gif)

[Demo gif here if not loaded.](https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/image-previewer-demo.gif)

### How to use

Install package:

```
npm install --save rc-image-previewer
```

Import to your app:

```
import ImagePreviewer from 'rc-image-previewer';
```

Use the component:

```
const { width } = Dimensions.get('window');

export default class App extends React.Component {
  render() {
    const ImgWidth = width;
    const ImgHeight = ImgWidth * 0.6;
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
```

### API

API table

API name       | Usage
---------------|----------------------------------------
style          | The style of element.
source         | The image source, same as <Image /> source.
resizeMode     | The image resize mode, default is contain.(Optional)
