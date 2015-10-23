import { default as React, PropTypes } from 'react';
import selectLocalVideo from './helpers/select-local-video';

const noop = () => {};

class Controls extends React.Component {
    render() {
        var playClassName = this.props.isPlaying ? 'fa fa-pause icon': 'fa fa-play icon';
        var muteClassName = this.props.isMute ? 'fa fa-volume-off icon': 'fa fa-volume-up icon';
        // <a className="open-remote fa fa-external-link icon" title="Open Remote"></a>
        return (
            <div className="video-controls">
                <a className={playClassName} title="Play" onClick={this.playPause.bind(this)}></a>
                <input type="range" className="seek-bar" value={this.props.position} onChange={this.positionChange.bind(this)} ref="seekBar"/>
                <a className={muteClassName} title="Mute" onClick={this.mute.bind(this)}></a>

                <span className="brand">{ this.props.brand }</span>
                <span className="info">{ this.props.title }</span>
                <span className="timingInfo"></span>
                <a className="full-screen fa fa-expand icon rfloat" title="Full Screen" onClick={this.fullScreen.bind(this)}></a>
                <a className="select-local-file fa fa-folder-open icon rfloat" title="Select File" onClick={this.selectLocalFile.bind(this)}></a>
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
        this.props.onPositionChange(+this.refs.seekBar.value);
    }

    selectLocalFile(){
        selectLocalVideo()
            .then(videoFile => {
                this.props.onLocalVideoSelected(videoFile);
            })
            .catch(error => {
                console.error(error);
            });
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
    onLocalVideoSelected: PropTypes.func,

    brand: PropTypes.string,
    title: PropTypes.string
};

Controls.defaultProps = {
    isPlaying: false,
    onPlayPause: noop,
    isMute: false,
    onMute: noop,
    isFullscreen: false,
    onFullScreen: noop,
    position: 0,
    onPositionChange: noop,
    onLocalVideoSelected: noop,
    brand: '',
    title: ''
};

export default Controls;
