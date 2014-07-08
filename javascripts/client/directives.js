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