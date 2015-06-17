'use strict';

var urlPrefix = "http://localhost:5000/";

// switch(window.location.hostname) {
//     case 'localhost':
//         urlPrefix = "http://localhost:5000/";
//         break;
//     case 'bnicholas.github.io':
//         urlPrefix = "http://goodwillapi.herokuapp.com/";
//         break;
//     default:
//         default code block
// }

if(!localStorage['favorites']) {
  localStorage.setItem('favorites', '[]');
};
if(!localStorage['seller'] || localStorage['seller'] === "undefined") {
  localStorage['seller'] = 12;
};
if(!localStorage['category'] || localStorage['category'] === "undefined") {
  localStorage['category'] = 0;
}

var app = angular.module('goodwill', ['infinite-scroll']);

var favorites = JSON.parse(localStorage.getItem('favorites'));

var love = function(e) {
  var favId = e.value;
  var addRemove = favorites.indexOf(favId);
  if( addRemove != -1) {
    favorites.splice(addRemove,1);
    updateFavorites();
  } else {
    favorites.push(favId);
    updateFavorites();
  };
}

var updateFavorites = function(){
  localStorage['favorites'] = JSON.stringify(favorites);
}
