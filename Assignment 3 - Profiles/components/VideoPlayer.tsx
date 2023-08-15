import ReactPlayer from 'react-player'

export type VideoProps = {
    url: string;
}

const VideoPlayer: React.FC<VideoProps> = (props) => {
    return (
        <ReactPlayer url={props.url} controls={true} />
    );
}

export default VideoPlayer;