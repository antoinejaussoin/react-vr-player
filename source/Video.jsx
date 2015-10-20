import { default as React, PropTypes } from 'react';

import getVRDevices from './helpers/get-vr-devices';
import PhoneVR from './helpers/phonevr';
import getWebGl from './webgl';
import initialiseManualControls from './helpers/manual-controls';
import goFullScreen from './helpers/goFullScreen';

const noop = () => {};

class Video extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            webGl: null
        };
    }

    render() {
        return (
            <div>
                <canvas className="glcanvas" ref="canvas">
                    Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
                </canvas>
                <video preload="false" className="video" loop="true" webkit-playsinline ref="video" style={{height: 200}}>
                    { this.props.sources.map(s => <source src={s.url} type={s.type} key={s.url} />)}
                </video>
            </div>
        );
    }

    componentDidMount(){
        let devices;
        let phone = new PhoneVR();

        getVRDevices()
            .then(devs => {
                console.log('devices: ', devs);
                devices = devs;
            })
            .then(() => {
                return getWebGl(devices, phone, this.refs.video, this.refs.canvas);
            })
            .then(gl => {
                this.setState({webGl: gl});
                initialiseManualControls(this.props.keys, (rotation, sign) => {
                    gl.rotate(rotation, sign);
                });
            });

        const video = this.refs.video;

        video.addEventListener('timeupdate', () => {
            if (!video.paused) {
                const value = (video.currentTime / video.duration) * 100;
                this.props.onPositionChange(value);
            }
        });

        document.addEventListener('fullscreenchange', function(event) {
            if (this.props.isFullscreen !== document.fullscreenEnabled && document.fullScreenElement === this.refs.canvas){
                this.props.onFullscreen(document.fullscreenEnabled);
            }
        });
    }

    componentWillReceiveProps(newProps){
        const video = this.refs.video;
        const canvas = this.refs.canvas;
        const webGl = this.state.webGl;
        if (!this.props.isPlaying && newProps.isPlaying) {
            video.play();
            webGl.draw();
        }
        if (this.props.isPlaying && !newProps.isPlaying) {
            video.pause();
            //dwebGl.stop();
        }
        if (this.props.isMute !== newProps.isMute) {
            video.muted = newProps.isMute;
        }
        if (this.props.isFullscreen != newProps.isFullscreen){
            goFullScreen(canvas, video, newProps.isFullscreen);
        }
    }

    componentWillUnmount(){
        const webGl = this.state.webGl;
        webGl.stop();
    }

    setPosition(percentage) {
        const video = this.refs.video;
        const time = video.duration * percentage / 100;
        console.log('time: ', time);
        console.log('percentage: ', percentage);
        video.currentTime = time;
    }
}

Video.propTypes = {
    sources: PropTypes.array.isRequired,
    isPlaying: PropTypes.bool,
    isMute: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    onFullscreen: PropTypes.func,
    onPositionChange: PropTypes.func,
    keys: PropTypes.object
};

Video.defaultProps = {
    sources: [],
    isPlaying: false,
    isMute: false,
    isFullscreen: false,
    onFullscreen: noop,
    onPositionChange: noop,
    keys: {
        left: 'A',
        right: 'D',
        up: 'W',
        down: 'S',
        rotateLeft: 'Q',
        rotateRight: 'E',
        fullScreen: 'F',
        zeroSensor: 'Z',
        playPause: ' '
    }
};

export default Video;
