import { default as React, PropTypes } from 'react';
import './VrPlayer.css';

import Controls from './Controls';
import Video from './Video';

class VrPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            isMute: false,
            isFullscreen: false,
            position: 0,
            sources: []
        };
    }

    render() {
        return (
            <div className="VrPlayer">

                <Video  ref="video"
                        sources={this.state.sources}
                        onFullScreen={this.fullScreen.bind(this)}
                        onPositionChange={ p => this.setState({position: p}) }
                        onPlayPause={this.playPause.bind(this)}
                        onMute={this.mute.bind(this)}
                        keys={this.props.keys} >
                </Video>

                <Controls isPlaying={this.state.isPlaying}
                        onPlayPause={this.togglePlayPause.bind(this)}
                        isMute={this.state.isMute}
                        onMute={this.toggleMute.bind(this)}
                        isFullscreen={this.state.isFullscreen}
                        onFullScreen={this.toggleFullScreen.bind(this)}
                        position={this.state.position}
                        onPositionChange={this.changePosition.bind(this)}
                        onLocalVideoSelected={this.localVideoSelected.bind(this)}
                        brand={this.props.brand}
                        title={this.props.title}
                />

            </div>
        );
    }

    playPause(playing) {
        this.setState({isPlaying: playing});
    }

    togglePlayPause() {
        this.refs.video.playPause();
    }

    mute(muted) {
        this.setState({isMute: muted});
    }

    toggleMute() {
        this.refs.video.toggleMute();
    }

    fullScreen(isFullscreen) {
        this.setState({isFullscreen: isFullscreen});
    }

    toggleFullScreen() {
        this.refs.video.goFullScreen();
    }

    changePosition(percentage) {
        this.refs.video.setPosition(percentage);
    }

    localVideoSelected(videoSource){
        this.setState({sources: [ videoSource ]});
    }

    zeroSensor() {
        this.refs.video.zeroSensor();
    }

    componentWillMount() {
        this.setState({sources: this.props.sources });
    }

    componentDidMount() {
        const keys = this.props.keys;
        if (window) {
            window.addEventListener('keypress', event => {
                switch (String.fromCharCode(event.charCode)) {
                    case keys.fullScreen.toLowerCase():
                        this.toggleFullScreen();
                        break;
                    case keys.zeroSensor.toLowerCase():
                        this.zeroSensor();
                        break;
                    case keys.playPause.toLowerCase():
                        this.togglePlayPause();
                        break;
                }
            }, true);
        }
    }

    componentWillReceiveProps(newProps){
        if (this.props.sources !== newProps.sources){
            this.setState({sources: newProps.sources });
        }
    }
}

VrPlayer.propTypes = {
    sources: PropTypes.array.isRequired,
    title: PropTypes.string,
    brand: PropTypes.string,
    keys: PropTypes.object
};

VrPlayer.defaultProps = {
    sources: [],
    title: '',
    brand: '',
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

export default VrPlayer;
