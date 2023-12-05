require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({

    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

console.log('Client ID:', process.env.CLIENT_ID);
console.log('Client ID:', process.env.CLIENT_SECRET);

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req,res) => {
    res.render('index',{title: "homepage", bgPage: "homePage"})
})

app.get('/artistSearch', (req, res) => {
    const artistQuery = req.query;
    console.log(artistQuery);

    spotifyApi.searchArtists(artistQuery)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artistSearch');
            // { artists: data.body.artists.items }
        })
        .catch(err => console.log(err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
