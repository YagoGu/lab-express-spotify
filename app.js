require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

//extra thinguies BODY PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + "/views/partials");

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/artist-search", (req, res) => {
    const artistData = req.query.artist
    const artistsFounded = spotifyApi
                            /*'HERE GOES THE QUERY ARTIST'*/
                            .searchArtists(artistData)
                            .then(data => {
                            // console.log('The received data from the API: ', data.body.artists.items);
                            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
                                return data.body
                            })
                            .then(themes => {
                                const results = themes.artists.items
                                console.log(results)
                                res.render( "artist-search-results", {results})
                            })
                            .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
