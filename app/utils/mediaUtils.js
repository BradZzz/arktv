export default function createChannels(medias) {

  var drulz = ['tt0397306','tt1486217','tt1561755','tt2474952','tt2467372','tt1439629','tt4677934','tt0182576','tt6317068','tt0149460',
  'tt1865718','tt0472954','tt3718778','tt1266020','tt1780441','tt2861424','tt0098904','tt0055683','tt1178180','tt5691552', 'tt4731072',
  'tt0096697','tt1621748','tt4839610','tt8335206','tt8335332','tt0220880','tt1140100','tt0206512','tt0212671','tt0106115','tt0235923','tt4731072']
  var fard = ['tt0397306','tt1486217','tt0103359','tt1561755','tt2467372','tt1439629','tt0182576','tt3551096','tt0149460',
  'tt5905038','tt0294097','tt0197159','tt0472954','tt0057730','tt0118375','tt0839188','tt1780441','tt2861424','tt0437745',
  'tt0482424','tt0063950','tt0098904','tt0245612','tt0121955','tt3158246','tt0092455','tt1031283','tt0373732','tt0115226',
  'tt0096697','tt0112196','tt0417373','tt1621748','tt4839610','tt0120903','tt0402022','tt0278877','tt0213338',
  'tt0220880','tt8199790','tt0251439','tt2058221','tt0106115']

  const channels = [
    { name : "Movie", filter: (media) => media.episodes.length === 1, media: [] },
    { name : "TV", filter: (media) => media.episodes.length > 1, media: [] },
    { name : "Drulz", filter: (media) => drulz.includes(media.imdbID), media: [] },
    { name : "Fard", filter: (media) => fard.includes(media.imdbID), media: [] }
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
