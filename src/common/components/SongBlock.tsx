import {
  msToString
} from '../utils/utils'

type SongBlockProps = {
  color: string
  title: string
  artist: string
  release: string
  duration: number
}

export default function SongBlock (props: SongBlockProps) {
  const getColor = () => ({
    background: `linear-gradient(0deg, ${props.color} 0%, rgb(231 240 245) 100%)`
  })

  return (
    <div className="song-block">
      <div className="song-block--album-art" style={getColor()}>
        { props.artist && props.artist[0] }
      </div>
      <div className="song-block--metadata">
        <div className="song-block--title">{ props.title }</div>
        <div className="song-block--artist">by { props.artist }</div>
        <div className="song-block--release">{ props.release }</div>
        <div className="song-block--duration">{ msToString(props.duration) }</div>
      </div>
    </div>
  )
}
