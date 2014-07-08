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

// app.controller('ModalCtrl',['$scope', '$http', 'ScrapeFactory', function($scope, $http, ScrapeFactory) {
//     var modal = new ScrapeFactory();
//     $scope.modal = modal; // var details = new
// }]);

app.controller('SellerCtrl', ['$scope', '$http', function($scope, $http) {
  $http({ method: 'GET', url: '/sellers.json'})
  .success(function(data){ 
    var sellers = [];
    var activeSeller = function() {
      $scope.search.seller = localStorage['seller'];
    }
    $scope.ngSellers = sellers;
    angular.forEach(data, function(value){
      sellers.push(value);
    });
  })
  .error(function(error){
    console.log(error);
  });
}]);

app.controller('SearchCtrl', ['$scope', '$http', 'SearchFactory', 'DetailsFactory', function($scope, $http, SearchFactory, DetailsFactory){
  var search = new SearchFactory();
  var details = new DetailsFactory();
  $scope.search = search;  
  $scope.details = details;
  search.seller = localStorage['seller'];
  search.category = localStorage['category'];
  
  search.all = function(){
    search.category = 0;
  };
  search.clear = function(){
    search.term = '';
    search.submit();
  };
  search.catClick = function(e) {
    e.preventDefault();
    var thisID = e.target.title;
    var thisChildren = document.getElementById('parent_'+thisID);
  };
  
  search.submit = function(){
    
    var searchVars = function(note){
      var msg = note+'\n'+' -- term: '+search.term +' -- category: ('+search.category+'/'+localStorage['category']+')'+' -- seller: ('+search.seller+'/'+localStorage['seller']+')'+' -- page: '+search.page+'\n'+' -- busy: '+search.busy +' -- empty: '+search.empty +' -- at end: '+search.atend +' -- features: '+search.features +' -- items length: '+search.items.length+'\n'+'------------------------------------------------';
      return msg;
    };
    
    localStorage['seller'] = this.seller;
    localStorage['category'] = this.category;
   
    search.seller   = this.seller;
    search.category = this.category;
    search.term     = this.term;
    search.empty    = false;
    search.busy     = false;
    search.atend    = false;
    search.page     = 1;
    search.items    = [];

    if(search.seller === 'all' && search.category == 0 && search.term == undefined) {
      if(search.features == true) {
        return;
      } else {
        console.log(searchVars('GETTING FEATURES'));
        search.getPage('features');
        search.features = true;
      };
    } 
    else {
      search.features = false;
      console.log(searchVars('GETTING SEARCH RESULTS'));
      search.getPage('search');
    };

  };
  
  search.submit();

}]);


app.directive('sellersList', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_sellers.html',
    controller: 'SellerCtrl' // nobody else needs this it's just a constructor
  }
});
app.directive('auctionDetailsModal', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_modal.html'
  }
});
app.directive('searchResults', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_search-results.html',
    controller: 'SearchCtrl'
  }
});
app.directive('searchTerm', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/_search.html' // I could have just used an ng-include on this.
  }
});
app.directive('categories', function($http, $compile){
  return {
    restrict: 'E',
    templateUrl: '/partials/_categories.html',
    transclude: true,
    // nobody else needs this it's just a constructor ... which is why i have it in a link ... ahh.
    link: function(scope, iElement, iAttrs, controller, transcludeFn){
      // pre: function PreLinkingFunction($scope, $element, $attributes) {  },
      // post: function PostLinkingFunction($scope, $element, $attributes) {  }
      var createCatItem = function(catId, catName, parentId) {
        var theDiv;
        
        // IF IT'S A TOP TOP LEVEL CATEGORY
        if (parentId == undefined) {
          theDiv = document.getElementById("top-categories");
        } 
        
        // OTHERWISE FIND THE RIGHT SUB-CATEGORY ELEMENT
        else {
          theDiv = document.getElementById("parent_"+parentId);
        };
        
        // IF SAID ELEMENT ISN'T THERE ... MAKE IT
        if(!theDiv) {
          var container = document.getElementById("categories");
          var newDiv = document.createElement('div');
          newDiv.id = 'parent_'+parentId;
          newDiv.setAttribute('class', 'child_categories');
          container.appendChild(newDiv);
          theDiv = document.getElementById("parent_"+parentId);
        };
        
        // CREATE THE INPUT
        var catInput = document.createElement('input');
        catInput.id = 'cat_'+catId;
        catInput.setAttribute('type', 'radio');
        catInput.setAttribute('value', catId);
        catInput.setAttribute('name', 'category');
        catInput.setAttribute('ng-model', 'search.category');
        catInput.setAttribute('ng-change', 'search.submit()');
        
        // CREATE THE LABEL
        var catLabel = document.createElement('label');
        catLabel.setAttribute('title', catId);
        //catLabel.setAttribute('ng-click', 'search.catClick($event)');
        catLabel.setAttribute('for', 'cat_'+catId);
        catLabel.innerHTML = catName;
        
        // APPEND NEW ITEM TO APPROPRIATE Div
        theDiv.appendChild(catInput);
        theDiv.appendChild(catLabel);

        return;
      
      }; 
      
      $http({ method: 'GET', url: '/categories.json'})
      .success(function(data){ 
        angular.forEach(data, function(value){
          createCatItem(value.catId, value.catName, value.parentId);
        });
        $compile(iElement.contents())(scope);
        //scope, iElement, iAttrs, controller, transcludeFn
      })
      .error(function(error){
        console.log(error);
      });
    } 
  } 
});
app.factory('DetailsFactory', ["$http", function($http) {
  
  var DetailsFactory = function() { };
  
  DetailsFactory.prototype.getDetails = function(obj) {
    var auctionID = obj.target.attributes.alt.value;
    
    console.log(auctionID);
    
    console.log("DetailsFactory.prototype.getDetails \n -------------------");
    
    var self = this;
    
    var detailsURL = urlPrefix+'favorites?callback=JSON_CALLBACK';
    
    $http.jsonp(detailsURL, { params: {'auctions': auctionID}, cache: false })
    .success(function(data,status){
      self = data;
      console.log(self);
    })
    .error(function(data, status){
      console.log("error: "+status);
    });
    
  };
  
  return DetailsFactory;

}]);


// THE GETTER OF SEARCH RESULTS
app.factory('SearchFactory', ["$http", function($http) {
  
  var auctionItems = [];
  
  var SearchFactory = function() { };
  
  SearchFactory.prototype.getPage = function(type) {
    var searchURL;
    var self = this;

    if(self.atend || self.empty || self.features) {
      return;
    };
    
    if(type == 'features') {
      self.features = true;
      searchURL = urlPrefix+'features?callback=JSON_CALLBACK';
    } else {
      searchURL = urlPrefix+"auctions?callback=JSON_CALLBACK";
    };
    
    var searchQuery = { 'seller': self.seller, 'cat': self.category, 'page': self.page, 'term': self.term };
    
    if (self.busy) {
      console.log("cant you see I'm busy? \n ------------------------------------------------");
      return;
    } 
    else {
      self.busy = true;
      var config = {
        params: searchQuery,
        cache: false
      };
      // console.log(searchURL);
      $http.jsonp(searchURL, config)
      .success(function(data, status) {
        self.atend = false;
        self.empty = false;
        if(data.length < 24 || type == 'features') {
          self.atend = true;
        };
        for (var i = 0; i < data.length; i++) {
          self.items.push(data[i]);
        };
        self.page = self.page + 1
        self.busy = false;
      })
      .error(function(data, status) {
        console.log("DAMN error: "+status+" "+data+"\n ------------------------------------------------");
        self.empty = true;
        self.atend = false;
        self.busy = false;
      });
    };    
  };
  
  return SearchFactory;
  
}]);

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