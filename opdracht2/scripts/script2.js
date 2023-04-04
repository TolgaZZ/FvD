window.addEventListener('load', function () {
  // const urlParams = new URLSearchParams(window.location.search);
  // let code = urlParams.get('code');
  // if (!code) {
  //   window.location.replace("http://localhost:5500/index.html");
  //   return;
  // }
    if(!window.location.hash) {
    window.location.replace("http://localhost:5500/index.html");
    return;
  }
  var hash = window.location.hash.substring(1);
  if (!hash.includes('access_token')) {
    window.location.replace("http://localhost:5500/index.html");
    return;
  }

  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  console.log('accesToken: ' + accessToken);

  // var access_token = hash.replace('access_token=', '').replace('&token_type=Bearer&expires_in=3600', '');
  // console.log(access_token);

  // Your Spotify API credentials
  const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
  const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';

  // Authenticate and get an access token
  // const getAccessToken = async () => {
  //   const response = await fetch('https://accounts.spotify.com/api/token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
  //     },
  //     body: 'grant_type=client_credentials'
  //   });
  //   const data = await response.json();
  //   return data.access_token;
  // };

  // let accessToken = localStorage.getItem('access_token');
  // console.log('accesToken: ' + accessToken);

  // Get user's top 5 tracks
  const getTopTracks = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    console.log(data);
    return data.items;
  };
  const tracks = getTopTracks();
  // const response = fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': 'Bearer ' + accessToken
  //   }
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('HTTP status ' + response.status);
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     // localStorage.setItem('access_token', data.access_token);
  //     console.log('received data: ' + data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });

  // Get image URL of a track
  const getImageUrl = (track) => {
    return track.album.images[0].url;
  };

  // Initialize the carousel
  const initCarousel = (tracks) => {
    const cardsContainer = document.querySelector('.cards-container');
    const songTitle = document.querySelector('.song-title');
    const playButton = document.querySelector('.play-button');
    const currentTime = document.querySelector('.current-time');
    const audio = new Audio();
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
      if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pause';
      } else {
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

    // Initialize the arrow buttons
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    leftArrow.addEventListener('click', () => {
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1;
      }
      updateSelection();
    });
  };
  // rightArrow.addEventListener('click', () => {
  //   currentTrackIndex++;
  //   if (currentTrack
});