const audio = new Audio();
const leftArrow = document.querySelector('#left-arrow');
const rightArrow = document.querySelector('#right-arrow');

const mainPlaylist = [];
// List.js initializen
const options = {
    valueNames: ['artist', 'song'],
    item: '<tr><td class="artist"></td><td class="song"></td><td><button class="remove">Remove</button></td></tr>'
  };
  
let selectedIndex = 3; // Selected courasel card
let cards = []; // cards array wordt in initCarousel geinitialiseerd.
let isPlayingNow = true;


function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

async function fetchPlaylist(playlistId, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.items.map(item => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        coverUrl: item.track.album.images[0].url.replace('640', '300'),
        previewUrl: item.track.preview_url
    }));
}

function updateSongInfo(track) {
    const songTitleElement = document.querySelector('#song-title');
    songTitleElement.textContent = `${track.name} - ${track.artist}`;
    audio.src = track.previewUrl;
    console.log('preview url: ' + track.previewUrl);
    if (isPlayingNow)
        audio.play();
}

function updateCards() {
    cards.forEach((card, index) => {
        card.style.zIndex = selectedIndex - Math.abs(selectedIndex - index);
        card.classList.remove('selected');
        card.style.transform = `translateX(${(index - selectedIndex) * 50}px) scale(${1 - Math.abs(index - selectedIndex) * 0.1})`;
    });

    cards[selectedIndex].style.zIndex = cards.length;
    cards[selectedIndex].classList.add('selected');

    const trackInfo = JSON.parse(cards[selectedIndex].dataset.trackInfo);
    updateSongInfo(trackInfo);
}

// myCustom playlist
function addToMyCustomPlayList(trackInfo) {
    const myList = document.querySelector('#custom-list tbody');
    const gevondenIndex = mainPlaylist.findIndex(x => x.name == trackInfo.name);
  
    if (gevondenIndex < 0) {
      mainPlaylist.push(trackInfo);
  
      const newRow = document.createElement('tr');
  
      const tdArtist = document.createElement('td');
      tdArtist.innerText = trackInfo.artist;
      newRow.appendChild(tdArtist);
  
      const tdSong = document.createElement('td');
      tdSong.innerText = trackInfo.name;
      newRow.appendChild(tdSong);
  
      const tdRemove = document.createElement('td');
      const btnRemove = document.createElement('button');
      btnRemove.classList.add('blablabla');
      btnRemove.innerText = "Remove";
      btnRemove.dataset.trackInfo = JSON.stringify(trackInfo);
      btnRemove.addEventListener('click', () => {
        removeFromMyCustomPlayList(btnRemove);
      });
  
      tdRemove.appendChild(btnRemove);
      newRow.appendChild(tdRemove);
  
      // Add the move-handle cell
      const tdMoveHandle = document.createElement('td');
      tdMoveHandle.classList.add('move-handle');
      tdMoveHandle.innerText = '⇅';
      newRow.appendChild(tdMoveHandle);
  
      myList.appendChild(newRow);
    }
  }
  

function removeFromMyCustomPlayList(ele) {
    ele.closest('tr').remove();
    const trackInfo = JSON.parse(ele.dataset.trackInfo);
    const gevondenIndex = mainPlaylist.findIndex(x => x.name == trackInfo.name);
    console.log("array length " + mainPlaylist.length);
    if (gevondenIndex >= 0) {
        mainPlaylist.splice(gevondenIndex, 1);
        console.log("mooi " + mainPlaylist.findIndex(x => x.name == trackInfo.name));
        console.log("array length " + mainPlaylist.length);
    }
}

function initCarousel() {
    if (cards.length === 0) {
        cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.dataset.index = index;
            card.addEventListener('click', () => {
                selectedIndex = index;
                updateCards();
            });
        });
    }

    leftArrow.addEventListener('click', () => {
        selectedIndex = Math.max(0, selectedIndex - 1);
        updateCards();
    });

    rightArrow.addEventListener('click', () => {
        selectedIndex = Math.min(cards.length - 1, selectedIndex + 1);
        updateCards();
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft') {
            selectedIndex = Math.max(0, selectedIndex - 1);
            updateCards();
        } else if (event.code === 'ArrowRight') {
            selectedIndex = Math.min(cards.length - 1, selectedIndex + 1);
            updateCards();
        } else if (event.code === 'Space') {
            event.preventDefault();
            console.log('space pressed');
            if (audio.paused) {
                console.log('playing audio');
                audio.play();
                isPlayingNow = true;
                playButton.textContent = 'Pause';
            } else {
                console.log('paused audio');
                audio.pause();
                isPlayingNow = false;
                playButton.textContent = 'Play';
            }
        }
    });

    updateCards();

    const playButton = document.querySelector('#play-button');
    const currentTime = document.querySelector('#current-time');
    playButton.textContent = 'Pause';
    playButton.addEventListener('click', () => {
        console.log('clicked');
        if (audio.paused) {
            console.log('playing audio');
            audio.play();
            isPlayingNow = true;
            playButton.textContent = 'Pause';
        } else {
            console.log('paused audio');
            audio.pause();
            isPlayingNow = false;
            playButton.textContent = 'Play';
        }
    });


    // Initialize the timer
    audio.addEventListener('timeupdate', () => {
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        currentTime.textContent = `${minutes}:${seconds}`;
    });
}

window.addEventListener('load', () => {
    // Your Spotify API credentials
    const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
    const redirectUri = encodeURIComponent('https://tolgazz.github.io/FvD/opdracht2/index.html');
    const scopes = encodeURIComponent('playlist-read-private playlist-read-private user-top-read');

    const mainLogin = document.querySelector('#main-login');

    mainLogin.addEventListener('click', () => {
        console.log('consoleLog: main-login');
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
    });

    const accessToken = getAccessTokenFromUrl();
    const playlistId = '2TuEeBAviJcV42k1pUMTTe';
    const cardsContainer = document.querySelector('.cards-container');
    const playlistContainer = document.querySelector('#playlist-container');

    if (accessToken === null) {
        return false;
    }

    const fetchPlaylistDetails = (track, index) => {
        const gridItem = document.createElement('li');
        const txtTitle = document.createElement('h2');
        const btnPlay = document.createElement('button');
        const btnAddd = document.createElement('button');

        gridItem.classList.add('grid-item');
        txtTitle.classList.add('grid-item-title');
        txtTitle.innerText = `${track.name} - ${track.artist}`;
        btnPlay.classList.add('grid-item-play');
        btnPlay.innerText = "Play";
        btnAddd.classList.add('grid-item-add');
        btnAddd.innerText = "Add";

        gridItem.appendChild(txtTitle);
        gridItem.appendChild(btnPlay);
        gridItem.appendChild(btnAddd);

        playlistContainer.appendChild(gridItem);

        if (index === selectedIndex) {
            gridItem.classList.add('selected');
        }

        gridItem.dataset.trackInfo = JSON.stringify(track);
        btnPlay.addEventListener('click', () => {
            const trackInfo = JSON.parse(gridItem.dataset.trackInfo);
            updateSongInfo(trackInfo);
        });
        btnAddd.addEventListener('click', () => {
            const trackInfo = JSON.parse(gridItem.dataset.trackInfo);
            addToMyCustomPlayList(trackInfo);
        });
    };

    fetchPlaylist(playlistId, accessToken).then(tracks => {
        tracks.forEach((track, index) => {

            // preview slider / reclame.
            if (index < 7) {
                const card = document.createElement('li');
                card.classList.add('card');
                if (index === selectedIndex) {
                    card.classList.add('selected');
                }
                card.style.backgroundImage = `url('${track.coverUrl}')`;
                card.dataset.trackInfo = JSON.stringify(track);
                cardsContainer.appendChild(card);
            }

            fetchPlaylistDetails(track, index);

            if (index === tracks.length - 1) {
                const autoPlay = document.querySelector('.selected');
                initCarousel();
            }
        });
    });
    const customListTBody = document.querySelector('#custom-list tbody');
    const sortable = new Sortable(customListTBody, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        handle: '.move-handle'
    });
});