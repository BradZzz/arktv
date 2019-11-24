export default function createChannels(medias) {

  const channels = [
    { name : "Movie", filter: (media) => media.episodes.length === 1, media: [] },
    { name : "TV", filter: (media) => media.episodes.length > 1, media: [] }
  ]

//  const genres = []
  for (var media of medias) {
    for (var channel of channels) {
      if (channel.filter(media)) {
        channel.media.push(media)
      }
    }
  }

  for (var channel of channels) {
    channel.media = channel.media
       .sort(function(a, b) {
        if(a.Title.toLowerCase() < b.Title.toLowerCase()) return -1;
        if(a.Title.toLowerCase() > b.Title.toLowerCase()) return 1;
        return 0;
       })
  }

  return channels
}
