# react-vr-player
VR / 360° Video Player as a React Component

> This is still very much beta.

It it adapted from eleVR player, which you can find [here](https://github.com/hawksley/eleVR-Web-Player)

You can find a [live example](https://antoinejaussoin.github.io/) of this component [here](https://antoinejaussoin.github.io/).

## What it does support so far

- 360° Videos
- Play/Pause
- Seek
- Mute
- Fullscreen
- HMD device (tested on Oculus Rift DK2, and Homido)

## Install

First, get it from NPM:
`npm install react-vr-player`
Then, if you use Webpack, load it up with `const VrPlayer = require('react-vr-player')` or ES6 `import VrPlayer from 'react-vr-player'`, it should work right out of the box.
It (obviously) has React as a dependency, but the already bundled version doesn't contain React.

For an example on how to use it, see this (simple) [demo here](https://github.com/antoinejaussoin/antoinejaussoin.github.io).

## Use

```javascript
render() {
    const sources = [
        { url: '/videos/video.webm', type: 'video/webm'},
        { url: '/videos/video.mp4', type: 'video/mp4'}
    ];
    const keys = { // Facultative, if you want to re-map the keys
        left: 'A',
        right: 'D',
        up: 'W',
        down: 'S',
        rotateLeft: 'Q',
        rotateRight: 'E',
        fullScreen: 'F',
        zeroSensor: 'Z',
        playPause: ' '
    };
    return (
        <VrPlayer
            sources={sources}
            brand="Some Brand Name"
            title="Some Video Title"
            keys={keys}></VrPlayer>

    );
}
```

## Gotchas

- The Oculus (and other PC-based VR headsets) are only supported on "beta" versions of Chrome and Firefox (respectively [Chromium](https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ) and [Firefox Nightly](http://mozvr.com/downloads/)). I personally recommend Firefox for now.
- Due to security restrictions on the Browser, only videos from the same domain will work. You can't just reference a video from another domain as the URL, as it will not work [because of WebGL restrictions](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL). CORS is being implemented but last time I checked it wasn't working.

## Future

- I'm planning to have feature-parity with eleVR shortly
- Adding support for "chapters"
- Making sure it works with the final VR api when this is released
