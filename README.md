# react-vr-player
VR / 360° Video Player as a React Component

> This is still very much beta.

It it adapted from eleVR player, which you can find [here](https://github.com/hawksley/eleVR-Web-Player)

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
Then, if you use Webpack, it should just be a matter of `const player = require('react-vr-player')`

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
