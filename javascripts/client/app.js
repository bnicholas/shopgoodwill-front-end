'use strict';

// var urlPrefix = "http://goodwillapi.herokuapp.com/";
var urlPrefix = "http://localhost:5000/";
// var urlPrefix = "http://192.168.5.2:5000/";

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