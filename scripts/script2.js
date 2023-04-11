function login() {
  const clientId = '2096ba39d9d84680a3ef01dc24958128';
  const redirectUri = encodeURIComponent('http://127.0.0.1:5500/songdeck.html');
  const scopes = encodeURIComponent('playlist-read-private playlist-read-private user-top-read');

  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
}
const playButton = document.querySelector('.play-button');

window.addEventListener('load', async () => {

  // Your Spotify API credentials
  const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
  const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';


  const accessToken = getAccessTokenFromUrl();

  if (accessToken) {
    const playlistId = '2TuEeBAviJcV42k1pUMTTe';

    fetchPlaylist(playlistId, accessToken).then(tracks => {
      tracks.forEach((track, index) => {
        console.log('index: ' + index);
        const card = document.getElementById(`card${index + 1}`);
        card.style.backgroundImage = `url('${track.coverUrl}')`;
        // const cardImage = card.getElementsByClassName('card-image')[0];
        // card.innerHTML = `
        //   <img src="${track.coverUrl}" alt="${track.name}" />
        // `;

        card.dataset.trackInfo = JSON.stringify(track);

        card.addEventListener('click', () => {
          const trackInfo = JSON.parse(card.dataset.trackInfo);
          updateSongInfo(trackInfo);
        });
      });

      const initialTrackInfo = JSON.parse(cards[selectedIndex].dataset.trackInfo);
      updateSongInfo(initialTrackInfo);
    });

    // Get user's top 5 tracks
    const getTopTracks = async (accessToken) => {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const data = await response.json();
      console.log(data);
      return data.items;
    };
    const tracks = getTopTracks();
  }

  const songTitleElement = document.querySelector('.song-title');
  const audio = new Audio();


  function updateSongInfo(track) {
    songTitleElement.textContent = `${track.name} - ${track.artist}`;
    audio.src = track.previewUrl;
    console.log('preview url: ' + track.previewUrl);
    // audio.play();
  }


  // Get image URL of a track
  const getImageUrl = (track) => {
    return track.album.images[0].url;
  };

  // Initialize the carousel
  // const initCarousel = (tracks) => {
  const cardsContainer = document.querySelector('.cards-container');
  const songTitle = document.querySelector('.song-title');
  const currentTime = document.querySelector('.current-time');
  let currentTrackIndex = 0;

  // Update the currently selected card and song info
  const updateSelection = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.classList.remove('selected');
    });
    cards[currentTrackIndex].classList.add('selected');
    const track = tracks[currentTrackIndex];
    songTitle.textContent = `${track.name} - ${track.artists[0].name}`;
    audio.src = track.preview_url;
  };

  // Initialize the cards
  tracks.forEach((track, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    if (index === currentTrackIndex) {
      card.classList.add('selected');
    }
    const image = document.createElement('img');
    image.src = getImageUrl(track);
    image.alt = track.name;
    card.appendChild(image);
    card.addEventListener('click', () => {
      currentTrackIndex = index;
      updateSelection();
    });
    cardsContainer.appendChild(card);
  });

  // Initialize the play button
  playButton.addEventListener('click', () => {
    console.log('clicked');
    if (audio.paused) {
      console.log('playing audio');
      audio.play();
      playButton.textContent = 'Pause';
    } else {
      console.log('paused audio');
      audio.pause();
      playButton.textContent = 'Play';

    }
  });


  // Initialize the timer
  audio.addEventListener('timeupdate', () => {
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    currentTime.textContent = `${minutes}:${seconds}`;
  });

})
