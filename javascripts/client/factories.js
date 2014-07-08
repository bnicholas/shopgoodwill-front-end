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