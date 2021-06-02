export const msToString = (ms: number) => {
  if (!ms) {
    return ''
  }
  let _ms = Math.round(ms / 1000)
  const secs = ('0' + _ms % 60)
  const mins = Math.floor(_ms / 60)
  return `${mins} mins ${secs.substr(secs.length - 2)} seconds`
}

export const parseRecording = (recording: any) => {
  const artist = recording && recording['artist-credit'] && recording['artist-credit'][0] && recording['artist-credit'][0].name
  return ({
    id: recording.id,
    title: recording.title,
    artist,
    release: recording['first-release-date'],
    duration: recording.length
  })
}
