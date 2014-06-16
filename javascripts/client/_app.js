(function(){

  'use strict';

  var goodwillApp = angular.module('goodwillApp', ['infinite-scroll', 'wu.masonry', 'akoenig.deckgrid']);
  var urlPrefix = "http://goodwillapi.herokuapp.com/";
  // var urlPrefix = "http://localhost:5000/";

  var sellers;
  
  console.log("code");
  
  

  goodwillApp.controller('AuctionController', function($scope, $http, AuctionsFactory) {
    
    // FETCH AND POPULATE SELLERS
    $.getJSON(urlPrefix+'sellers?callback=?', function(data) {
      $scope.sellers = data;
    });    
    
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
    
    // CLEAR THE SARCH INPUT
    $scope.clear = function(){
      $scope.search.term = "";
      $scope.submit();
    };

    $scope.$on('masonry.created', function (scope, element, attrs) {
      console.log(element);
    });

    // SUBMIT THE SEARCH QUERY
    $scope.submit = function(){
      // I NEED TO KILL ANY MASONRY TASKS RUNNING
      // wu.masonry MasonryCtrl
      auctions.empty = false;
      // NOT BUSY
      auctions.busy = false;
      // NOT AT END
      auctions.atend = false;
      // RESET TO PAGE 1
      auctions.page = 1;
      // EMPTY THE AUCTIONS ARRAY
      auctions.items = [];
      // THE ALL ALL QUERY JUST DOESN'T WORK
      auctions.cant = false;

      auctions.term = this.search.term;
      auctions.seller = this.search.seller;
      auctions.category = this.search.category;
      
      if(auctions.seller == 'all' && auctions.category == 0) {
        auctions.cant = true;
        return;
      }
      else {
        auctions.getPage($scope);
      };
      
      // SAVE THE LAST SELECTED CATEGORY AND SELLER TO localStorage
      localStorage["category"] = this.search.category;
      localStorage["seller"] = this.search.seller;
    };
    
    $scope.submit();

  });
  
  goodwillApp.directive('ng-imageloading', function () {
    'use strict';
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {   
        element.bind('load', function (e) {
          angular.element(element).addClass('ng-imageloaded');
          angular.element(element).removeClass('ng-imageloading');
        });
      }
    }
  });

  
  goodwillApp.factory('AuctionsFactory', function($http) {
    
    var AuctionsFactory = function($scope) {
      this.items        = [];
      this.busy         = false;
      this.page         = 1;
      this.empty        = false;
      this.atend        = false;
      this.cant         = false;
    };

    AuctionsFactory.prototype.getPage = function($scope) {
      if(this.atend) {
        console.log("at end");
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
            self.empty = true;
            self.atend = true;
            self.busy = false;
          });
        // -------------------------------------------
      };
      
    };
    
    AuctionsFactory.prototype.getItem = function($scope, auctionID) {

    };

    return AuctionsFactory;

  });

})();