'use strict';

var goodwillApp = angular.module('goodwillApp', ['infinite-scroll', 'wu.masonry']);
var urlPrefix = "http://goodwillapi.herokuapp.com/";
// var favorites = window.localStorage["favorites"]

var searchNav = document.querySelector("header");
Headroom.options = {
  tolerance : {
      up : 5,
      down : 0
  },
  offset : 40,
  // css classes to apply
  classes : {
      // when element is initialised
      initial : "headroom",
      // when scrolling up
      pinned : "headroom--pinned",
      // when scrolling down
      unpinned : "headroom--unpinned",
      // when above offset
      top : "headroom--top",
      // when below offset
      notTop : "headroom--not-top"
  }
}  ;

var headroom  = new Headroom(searchNav);
headroom.init(); 

goodwillApp.controller('AuctionController', function($scope, $http, AuctionsFactory) {
  
  // FETCH AND POPULATE SELLERS
  // FETCH AND POPULATE CATEGORIES
  
  // AUCTIONS
  var auctions = new AuctionsFactory($scope);
  $scope.auctions = auctions;

  // FAVORITES
  $scope.favorite = function(){
    console.log("click");
  };
  
  // SEARCH
  $scope.search = {};
  if(localStorage["seller"]) {
    $scope.search.seller = localStorage["seller"];
  } else {
    $scope.search.seller = 12;  
  }
  if(localStorage["category"]){
    $scope.search.category = localStorage["category"];  
  } else {
    $scope.search.category = 0;
  }
  
  $scope.clear = function(){
    $scope.search.term = "";
    $scope.submit();
  };

  $scope.submit = function(){
    // I need to return if we're at the end of the results
    auctions.empty = false;
    auctions.busy = false;
    auctions.atend = false;
    auctions.page = 1;
    auctions.items = [];
    auctions.term = this.search.term;
    auctions.seller = this.search.seller;
    auctions.category = this.search.category;
    auctions.getPage($scope);
    
    // SAVE THE LAST SELECTED CATEGORY AND SELLER TO localStorage
    localStorage["category"] = this.search.category;
    localStorage["seller"] = this.search.seller;
  };
  
  $scope.submit();

});

goodwillApp.factory('AuctionsFactory', function($http) {
  
  var AuctionsFactory  = function($scope) {
    this.items         = [];
    this.busy          = false;
    this.page          = 1;
    this.empty         = false;
    this.atend         = false;
  };

  AuctionsFactory.prototype.getPage = function($scope) {

    if(this.atend) {
      return;
    };

    var searchQuery = { 'seller': this.seller, 'cat': this.category, 'page': this.page, 'term': this.term };
    
    if (this.busy) {
      console.log("cant you see I'm busy?");
      return;
    }
    else {
      this.busy = true;
      var self = this;
      var searchURL = urlPrefix+"search?callback=JSON_CALLBACK";
      var config = {
        params: searchQuery,
        cache: false
      };
      $http.jsonp(searchURL, config)
        .success(function(data, status) {
          self.atend = false;
          self.empty = false;
          if(data.length < 25) {
            self.atend = true;
          }
          for (var i = 0; i < data.length; i++) {
            self.items.push(data[i]);
          };
          self.page = self.page + 1
          self.busy = false;  
        })
        .error(function(data, status) {
          self.empty = true;
          self.atend = true;
          self.busy = false;
        });
      // -------------------------------------------
    };
    
  };
  
  return AuctionsFactory;

});