'use strict';

// PASO 0 = DEFINIR VARIABLES YA EXISTENTES EN EL HTML
const btn = document.querySelector('.js-btn');
const inputSearch = document.querySelector('.js-input');
const movieList = document.querySelector('.js-movie-list');
const favoritesList = document.querySelector('.js-favorites-list');
// PINTO VARIABLE VACIA PARA GUARDAR DATA
let shows = [];
let favoriteShows = [];

// PASO 0.1 LLAMO A MI API
//PASO 0.2 CREO FUNCIÓN DE BOTÓN QUE DESENCADENA TODO
//PASO 0.3 GUARDO MIS DATOS EN UN ARRAY VACÍO (declarado al principio)
function search() {
  let value = inputSearch.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${value}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      shows = data;
      paintMovies();
    })
    .catch((err) => {
      // console.error('Se ha producido un error:', err);
    });
}
//PASO 0.2.1 ESCUCHO MI BOTON

btn.addEventListener('click', search);

// PAINTING ALL MOVIES
function paintMovies() {
  // 1 VACIO MI ARRAY EN UN PRINCIPIO DEL BUCLE
  movieList.innerHTML = '';
  // 2 CREO BUCLE QUE REVISE TODOS LOS ELEMENTOS DE MI ARRAY
  for (let i = 0; i < shows.length; i++) {
    // 3 LE DIGO AL BUCLE CUAL ES EL CAMINO DE CADA ELEMENTO QUE QUIERO QUE REVISE
    const show = shows[i].show;
    const name = show.name;
    const picture =
      (show.image && show.image.medium) ||
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    /*let picture = '';
    if (show.image === null) {
      picture = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else {
      picture = show.image.medium;
    }*/
    // 1 Creating <li> elemnt
    const movie = document.createElement('li');
    // 1.5 Saving name <li> (the father of name is movilist)
    movieList.appendChild(movie);
    // 1.1) Creating first <li> contente (movie name)
    movie.textContent = ` ${name}`;
    // movie.setAttribute('id', [i]);--- is not necessary. shows already have an id
    // 1.7 Adding class (js-favorite) if show id is the same than the favorit id
    const isFavorite = favoriteShows.find(function (fav) {
      return fav.id === show.id;
    });
    if (isFavorite) {
      movie.classList.add('js-favorite');
    }
    // 1.2) Creating second <li> contente (movie img)
    const movieImage = document.createElement('img');
    // 1.3) Giving attributes ("src",picture) to work with img
    movieImage.setAttribute('src', picture);
    // 1.4) Saving img in the same container than li (the father of img is the list (movie))
    movie.appendChild(movieImage);
    // 1.6) Listening click to toggle favotites
    const date = new Date();
    movie.addEventListener('click', function () {
      console.log(date);
      toggleFavorite(show);
    });
    // 1.5 Saving name <li> (the father of name is movilist)
    movieList.appendChild(movie);
  }
  // PAINTING ALL MOVIES and LOCAL STORAGE (FAVORITES) (outside for but inside the function (i don´t want to repeat them all the times) )
  paintFavorites();
  setLocalStorage();
}

function toggleFavorite(show) {
  const isFavorite = favoriteShows.find(function (fav) {
    return fav.id === show.id;
  });
  if (isFavorite) {
    /*favoriteShows = favoriteShows.filter(function (fav) {
      return fav.id !== show.id;
    });*/
    const favindex = favoriteShows.findIndex(function (fav) {
      return fav.id === show.id;
    });
    favoriteShows.splice(favindex, 1);
  } else {
    favoriteShows.push(show);
  }
  paintMovies();
}

function paintFavorites() {
  favoritesList.innerHTML = '';
  for (let i = 0; i < favoriteShows.length; i++) {
    const show = favoriteShows[i];
    const name = show.name;
    const picture =
      (show.image && show.image.medium) ||
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    const favorite = document.createElement('li');
    favorite.textContent = `${name}`;
    favorite.classList.add('favorite-name');

    const favoriteImage = document.createElement('img');
    favoriteImage.setAttribute('src', picture);

    favorite.appendChild(favoriteImage);
    favoritesList.appendChild(favorite);

    // delete image
    const deleteImage = document.createElement('img');
    deleteImage.src = './assets/images/cancelar.png';
    deleteImage.setAttribute('alt', 'Borrar imagen');
    deleteImage.classList.add('delete-image');
    favorite.appendChild(deleteImage);
    deleteImage.addEventListener('click', function () {
      toggleFavorite(show);
    });
  }
}

function setLocalStorage() {
  localStorage.setItem('favoriteShows', JSON.stringify(favoriteShows));
}

function getLocalStorage() {
  favoriteShows = JSON.parse(localStorage.getItem('favoriteShows') || '[]');
}

// start app

getLocalStorage();
paintFavorites();
