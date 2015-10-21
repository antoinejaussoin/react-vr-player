import { default as React, PropTypes } from 'react';
import css from './VrPlayer.css';

import Controls from './Controls';
import Video from './Video';

class VrPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            isMute: false,
            isFullscreen: false,
            position: 0
        };
    }

    render() {

        return (
            <div className="VrPlayer">

                <Video isPlaying={this.state.isPlaying}
                        isMute={this.state.isMute}
                        isFullscreen={this.state.isFullscreen}
                        onFullScreen={this.fullScreen.bind(this)}
                        sources={this.props.sources}
                        keys={this.props.keys}
                        onPositionChange={p => this.setState({position: p})}
                        ref="video">
                </Video>

                <Controls isPlaying={this.state.isPlaying}
                        onPlayPause={this.playPause.bind(this)}
                        isMute={this.state.isMute}
                        onMute={this.mute.bind(this)}
                        isFullscreen={this.state.isFullscreen}
                        onFullScreen={this.fullScreen.bind(this)}
                        position={this.state.position}
                        onPositionChange={this.changePosition.bind(this)}
                        brand={this.props.brand}
                        title={this.props.title}
                />

            </div>
        );
    }

    playPause(){
        this.setState({isPlaying: !this.state.isPlaying});
    }

    mute(){
        this.setState({isMute: !this.state.isMute});
    }

    fullScreen(){
        this.setState({isFullscreen: !this.state.isFullscreen});
    }

    changePosition(percentage) {
        this.refs.video.setPosition(percentage);
    }

    componentDidMount() {
        const keys = this.props.keys;
        if (window){
            window.addEventListener('keypress', event => {
                switch (String.fromCharCode(event.charCode)) {
                    case keys.fullScreen.toLowerCase():
                        this.fullScreen();
                        break;
                    case keys.zeroSensor.toLowerCase():
                        this.zeroSensor();
                        break;
                    case keys.playPause.toLowerCase():
                        this.playPause();
                        break;
                }
            }, true);
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
