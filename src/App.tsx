import { useEffect, useState, useRef } from 'react'
import debounce from 'lodash.debounce'
import { parseRecording } from './common/utils/utils'
import SongBlock from './common/components/SongBlock'
import Loader from './common/components/Loader'

interface IObjectKeys {
  [key: string]: any;
}

function App () {
  const [recordings, setRecordings] = useState({} as IObjectKeys)
  const [recordingsLoading, setRecordingsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordingsCount, setRecordingsCount] = useState(0)

  const colors = ['#fedd96', '#fe96e8', '#feb896', '#96b0fe']

  const loaderRef = useRef(document.createElement('div'))

  const handleInfinityLoad = debounce(() => {
    setCurrentPage(cP => cP + 1)
  }, 200)

  useEffect(() => {
    const getRelease = async () => {
      setRecordingsLoading(true)
      const _response = await fetch(`https://musicbrainz.org/ws/2/recording?query=recording:rain&limit=20&offset=${currentPage * 20}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      setRecordingsLoading(false)
      const _recordings = await _response.json()
      if (_recordings && _recordings.count) {
        setRecordingsCount(_recordings.count)
        const allRecordings: IObjectKeys = {}
        _recordings.recordings.forEach((r: any) => {
          allRecordings[r.id] = parseRecording(r)
        })
        setRecordings(r => ({
          ...r,
          ...allRecordings
        }))
      }
    }
    getRelease()
  }, [currentPage]);

  useEffect(() => {
    const target = loaderRef.current

    const observer = new IntersectionObserver((entries) => {
      console.log('Whaa', entries)
      if (entries[0].isIntersecting && !recordingsLoading) {
        handleInfinityLoad()
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    })

    if (target && !recordingsLoading) {
      observer.observe(target)
    }

    return () => observer.unobserve(target)
  }, [loaderRef, recordingsLoading, handleInfinityLoad])
  
  const getSongBlocks = () => {
    return Object.values(recordings).map((recording, index) => (
      <SongBlock color={colors[index % 4]} title={recording.title} artist={recording.artist} release={recording.release} duration={recording.duration} key={recording.id} />
    ))
  }

  const loadMore = () => {
    if (Math.floor(recordingsCount / 20) <= currentPage) {
      return false
    }
    return (
      <div className="load-more">
        { recordingsLoading ? <Loader /> : (
          <button className="button load-more--button" onClick={() => setCurrentPage(currentPage + 1)}>Load More</button>
        ) }
      </div>
    ) 
  }

  return (
    <div className="App">
      { getSongBlocks() }
      { loadMore() }
      <div className="intersector" ref={loaderRef} ></div>
    </div>
  );
}

export default App;
