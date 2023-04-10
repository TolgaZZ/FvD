const audio = new Audio();

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
    audio.play();
}


function myPlayList(trackInfo) {
    const myList = document.querySelector('#custom-list');

    myList.innerHTML += `${trackInfo.name} - ${trackInfo.artist} <br \/>`;
}

window.addEventListener('load', () => {

    // Your Spotify API credentials
    const CLIENT_ID = '2096ba39d9d84680a3ef01dc24958128';
    const CLIENT_SECRET = '28887880065d4ff3bb6ced7d494b1860';
    const redirectUri = encodeURIComponent('http://127.0.0.1:5500/songdeck.html');
    const scopes = encodeURIComponent('playlist-read-private playlist-read-private user-top-read');

    const mainLogin = document.querySelector('#main-login');

    mainLogin.addEventListener('click', () => {
        console.log('consoleLog: main-login');
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
    });

    const accessToken = getAccessTokenFromUrl();
    const playlistId = '2TuEeBAviJcV42k1pUMTTe';
    const cardsContainer = document.querySelector('.cards-container');
    const playlistContainer = document.querySelector('.playlist-container');
    let currentTrackIndex = 0;

    if (accessToken) {
        const fetchPlaylistDetails = (track, index) => {
            const songTitle = document.querySelector('.song-title');
            const playButton = document.querySelector('.play-button');
            const currentTime = document.querySelector('.current-time');

            const gridItem = document.createElement('div');
            const txtTitle = document.createElement('h2');
            const btnAddd = document.createElement('button');
            const btnRemove = document.createElement('button');

            gridItem.classList.add('grid-item');
            txtTitle.classList.add('grid-item-title');
            txtTitle.innerText = `${track.name} - ${track.artist}`;
            btnAddd.classList.add('grid-item-add');
            btnAddd.innerText = "Add"
            btnRemove.classList.add('grid-item-remove');
            btnRemove.innerText = "Remove"

            gridItem.appendChild(txtTitle);
            gridItem.appendChild(btnAddd);
            gridItem.appendChild(btnRemove);

            playlistContainer.appendChild(gridItem);

            if (index === currentTrackIndex) {
                gridItem.classList.add('selected');
            }

            gridItem.dataset.trackInfo = JSON.stringify(track);
            btnAddd.addEventListener('click', () => {
                const trackInfo = JSON.parse(gridItem.dataset.trackInfo);
                console.log(trackInfo);
                myPlayList(trackInfo);
            });
        };

        fetchPlaylist(playlistId, accessToken).then(tracks => {
            tracks.forEach((track, index) => {

                // preview slider / reclame.
                if(index < 5)
                {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    if (index === currentTrackIndex) {
                        card.classList.add('selected');
                        card.id = "id-autoplay"
                    }
                    card.style.backgroundImage = `url('${track.coverUrl}')`;
                    const imgPlaceholder = document.createElement('div');
                    imgPlaceholder.classList.add('card-image');
                    card.appendChild(imgPlaceholder);
    
                    card.dataset.trackInfo = JSON.stringify(track);
                    card.addEventListener('click', () => {
                        const trackInfo = JSON.parse(card.dataset.trackInfo);
                        updateSongInfo(trackInfo);
                    });
                    cardsContainer.appendChild(card);
                }

                fetchPlaylistDetails(track, index);
            });

            const autoPlay = document.getElementById("id-autoplay");
            autoPlay.click();
        });
    }


});