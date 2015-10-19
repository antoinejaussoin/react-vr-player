import { default as React, PropTypes } from 'react';
import _ from 'lodash';

class Controls extends React.Component {
    render() {
        var playClassName = this.props.isPlaying ? 'fa fa-pause icon': 'fa fa-play icon';
        var muteClassName = this.props.isMute ? 'fa fa-volume-off icon': 'fa fa-volume-up icon';
        return (
            <div className="video-controls">
                <a className={playClassName} title="Play" onClick={this.playPause.bind(this)}></a>
                <input type="range" className="seek-bar" value={this.props.position} onChange={this.positionChange.bind(this)} ref="seekBar"/>
                <a className={muteClassName} title="Mute" onClick={this.mute.bind(this)}></a>
                <a className="open-remote fa fa-external-link icon" title="Open Remote"></a>

                <span className="brand">{ this.props.brand }</span>
                <span className="info">{ this.props.title }</span>
                <span className="timingInfo"></span>
                <a className="full-screen fa fa-expand icon rfloat" title="Full Screen" onClick={this.fullScreen.bind(this)}></a>
                <a className="select-local-file fa fa-folder-open icon rfloat" title="Select File"></a>
            </div>
        );
    }

    playPause() {
        this.props.onPlayPause();
    }

    mute(){
        this.props.onMute();
    }

    fullScreen(){
        this.props.onFullScreen();
    }

    positionChange() {
        this.props.onPositionChange(this.refs.seekBar.value);
    }
}

Controls.propTypes = {
    isPlaying: PropTypes.bool,
    onPlayPause: PropTypes.func,
    isMute: PropTypes.bool,
    onMute: PropTypes.func,
    isFullscreen: PropTypes.bool,
    onFullScreen: PropTypes.func,
    position: PropTypes.number,
    onPositionChange: PropTypes.func,

    brand: PropTypes.string,
    title: PropTypes.string
};

Controls.defaultProps = {
    isPlaying: false,
    onPlayPause: _.noop,
    isMute: false,
    onMute: _.noop,
    isFullscreen: false,
    onFullScreen: _.noop,
    position: 0,
    onPositionChange: _.noop,
    brand: '',
    title: ''
};

export default Controls;
