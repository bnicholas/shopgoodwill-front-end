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

