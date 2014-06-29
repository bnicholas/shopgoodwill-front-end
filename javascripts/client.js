'use strict';


var app = angular.module('goodwill', ['infinite-scroll']);


// var urlPrefix = "http://goodwillapi.herokuapp.com/";
var urlPrefix = "http://localhost:5000/";

if(!localStorage['favorites']) {
  localStorage.setItem('favorites', '[]');
};
if(!localStorage['seller']) {
  localStorage['seller'] = 12;
};
if(!localStorage['category']) {
  localStorage['category'] = 0;
}
var favorites = JSON.parse(localStorage.getItem('favorites'));
console.log(favorites);

var love = function(e) {
  var favId = e.value;
  var addRemove = favorites.indexOf(favId);
  if( addRemove != -1) {
    console.log("it's in there "+addRemove);
    favorites.splice(addRemove,1);
    updateFavorites();
  } else {
    console.log("it's not in there "+addRemove);
    favorites.push(favId);
    updateFavorites();
  };
}

var updateFavorites = function(){
  console.log(localStorage['favorites']);
  localStorage['favorites'] = JSON.stringify(favorites);
  console.log(localStorage['favorites']);
}

// FAVORITES
app.controller('FavoritesCtrl', ["$scope", "$http", function($scope, $http) {
  $scope.favorites = favorites;

  var favorite = function() {
    console.log(this);
  };
  $scope.favorite = favorite;
  
  // $('input.favorite')  

  
}]);

// SELLERS ... ONLY FOR THE VIEW RENDERING
app.controller('SellersCtrl', ["$scope", "$http", function($scope, $http) {
  $http({ method: 'GET', url: '/sellers.json'})
    .success(function(data){ 
      // console.log("GET sellers.json SUCCESS");
      var sellers = [];
      var activeSeller = function() {
        $scope.search.seller = localStorage['seller'];
        console.log($scope.search.seller);
      }
      $scope.ngSellers = sellers;
      angular.forEach(data, function(value){
        sellers.push(value);
      });
    })
    .error(function(error){
      console.log(error);
    }
  );
}]);

// CATEGORIES ... ONLY FOR THE VIEW RENDERING
app.controller('CategoriesCtrl', ["$scope", "$http", function($scope, $http) {
  $http({ method: 'GET', url: '/categories.json'})
    .success(function(data){ 
      // console.log("GET categories.json SUCCESS");
      var categories = [];
      $scope.ngCats = categories;
      angular.forEach(data, function(value){
        if (value.parentId == undefined) {
          categories.push(value);
        } 
      });
    })
    .error(function(error){
      console.log(error);
    });
}]);


// SEARCH
app.controller('SearchCtrl', ["$scope", "$http", "SearchFactory", function($scope, $http, SearchFactory) {
  var search = new SearchFactory();
  $scope.search = search;
  search.seller = localStorage["seller"];
  search.category = localStorage["category"];
  
  // CLEAR THE SARCH INPUT
  search.clear = function(){
    search.term = "";
    search.submit();
  };

  // SUBMIT THE SEARCH QUERY
  // "Hey ... Do a different search please."
  search.catClick = function(e) {
    // get all the categories with a parentID of search.category
    // console.log(e.target.title);
  };

  search.submit = function(){
    localStorage["seller"] = this.seller;
    localStorage["category"] = this.category;
    // console.log(search.seller);
    search.term = this.term;
    search.empty = false;
    // NOT BUSY
    search.busy = false;
    // NOT AT END
    search.atend = false;
    // RESET TO PAGE 1
    search.page = 1;
    // EMPTY THE SEARCH ARRAY
    search.items = [];
    // THE ALL ALL QUERY JUST DOESN'T WORK
    search.cant = false;
    
    if(search.seller == 'all' && search.category == 0 && search.term == "") {
      search.cant = true;
      return;
    }
    else {
      search.getPage();
    };
  };
  
  // ON THE FIRST LOAD CALL SUBMIT()  
  search.submit();

}]);

// THE GETTER OF SEARCH RESULTS
app.factory('SearchFactory', ["$http", function($http) {
  
  var auctionItems = [];
  
  var SearchFactory = function() {
    this.items      = [];
    this.busy       = false;
    this.page       = 1;
    this.atend      = false;
    this.cant       = false;
    this.empty      = false;
    this.seller     = localStorage["seller"];
    //this.seller     = localStorage["seller"];
  };
  
  // 'Hey ... could you add another page of results to $scope.search?'
  SearchFactory.prototype.getPage = function() {
    var self = this;
    
    if(self.atend) {
      return;
    };
    
    var searchQuery = { 'seller': self.seller, 'cat': self.category, 'page': self.page, 'term': self.term };
    
    if (self.busy) {
      console.log("cant you see I'm busy?");
      return;
    }
    else {
      self.busy = true;
      // URLPREFIX SHOULD REALLY BE SET TO AN ENV VARIABLE
      var searchURL = urlPrefix+"auctions?callback=JSON_CALLBACK";
      var config = {
        params: searchQuery,
        cache: false
      };
      $http.jsonp(searchURL, config)
        .success(function(data, status) {
          self.atend = false;
          self.empty = false;
          if(data.length < 24) {
            self.atend = true;
          }
          for (var i = 0; i < data.length; i++) {
            self.items.push(data[i]);
          };
          self.page = self.page + 1
          self.busy = false;  
        })
        .error(function(data, status) {
          console.log("error: "+status);
          self.empty = true;
          self.atend = true;
          self.busy = false;
        });
    };    
  };
  
  return SearchFactory;
  
}]);

app.directive('favorites', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_favorites.html',
    controller: 'FavoritesCtrl'
  }
})

app.directive('searchResults', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_search-results.html',
    controller: 'SearchCtrl'
  }
});
app.directive('categories', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_categories.html',
    controller: 'CategoriesCtrl'
  }
});
app.directive('sellers', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_sellers.html',
    controller: 'SellersCtrl'
  }
});
app.directive('searchTerm', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_search.html',
  }
});
(function($){
  'use strict';
  $('#results').on('click', '.auction_link', function(e){
    e.preventDefault();
    var src = $(this).attr('data-auction');
    var height = $(this).attr('data-height') || 300;
    var width = $(this).attr('data-width') || 400;
    $("#auctionModal iframe").attr({'src':src, 'height': height, 'width': width}); 

  });

})(jQuery);
(function(){
  'use strict';

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
})();