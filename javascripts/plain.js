var el_categories ,el_subCategories ,el_allSellers ,el_form ,el_clear ,el_term ,el_sellers ,el_catRadio 
,el_details ,el_no_results ,el_loading ,el_the_end ,el_results, el_page_loading;

var app = {
  // "http://goodwillapi.herokuapp.com/"
  urlPrefix: "http://localhost:5000/",
  debug: true,
  view: "search"
};

var cardTemplate = $('#auctionTemplate').html();

// FAVORITES ------------------
var favorites = {
  list: JSON.parse(localStorage.getItem('favorites'))
};

favorites.show = function(json){  
  var favoritesTemplate = $('#favoritesTemplate').html();
  var template = Handlebars.compile(favoritesTemplate);
  $('body').toggleClass('favorites');
  $('#favorites').html( template(json) );
};

favorites.view = function(){
  app.view = "favorites";
  var jsonp = document.createElement('script');
  details = favorites.list.join();
  jsonp.src = app.urlPrefix+'favorites?auctions='+details+'&callback=favorites.show';
  document.head.appendChild(jsonp);  
};

favorites.toggle = function(v) {  
  var favId = v;
  var addRemove = favorites.list.indexOf(favId);
  if( addRemove != -1) {
    favorites.list.splice(addRemove,1);
    favorites.updateLocalStorage();
  } else {
    favorites.list.push(favId);
    favorites.updateLocalStorage();
  };
};
// convert localStorage favorites to array
favorites.updateLocalStorage = function(){
  localStorage['favorites'] = JSON.stringify(favorites.list);
};

$('#viewFavorites').click(favorites.view);

jQuery('#results').delegate( '.fav_input', 'change', function(){
  favorites.toggle(event.target.value);
});

// SEARCH ------------------------
var search = { 
  categories: [],
  sellers: [],
  seller: localStorage['seller'],
  category: localStorage['category'],
  term: "",
  page: 1,
  pages: []
};

// Get and Set search.sellers
search.getSellerData = function(){  
  sellers = new XMLHttpRequest();
  sellers.open('GET', '/sellers.json', false);
  sellers.onload = function() {
    search.sellers = JSON.parse(sellers.responseText);
    search.createSellers();
  };
  sellers.send();
};

// Populate Seller Navigation
search.createSellers = function(){  
  search.sellers.forEach(function(value) {
    sellerSelect = document.getElementById('sellers');
    newoption = document.createElement('option');
    newoption.innerHTML =  value.name;
    newoption.setAttribute('value', value.sellerId);
    sellerSelect.appendChild(newoption);
  });
  el_sellers.value = localStorage['seller'];

};
// Get and Set search.categories
search.getCategoryData = function(){  
  categories = new XMLHttpRequest();
  categories.open('GET', '/categories.json', false);
  categories.onload = function() {
    search.categories = JSON.parse(categories.responseText);
    search.createCatItems();
  };
  categories.send();
};
// Populate Category Navigation
search.createCatItems = function(){  
  search.categories.forEach(function(val){
    var theDiv;
    // IF IT'S A TOP TOP LEVEL CATEGORY
    if (val.parentId == undefined) {
      theDiv = document.getElementById("top-categories");
    } 
    // OTHERWISE FIND THE RIGHT SUB-CATEGORY ELEMENT
    else {
      theDiv = document.getElementById("parent_"+val.parentId);
    };
    // IF SAID ELEMENT ISN'T THERE ... MAKE IT
    if(!theDiv) {
      var container = document.getElementById("categories");
      var newDiv = document.createElement('div');
      newDiv.id = 'parent_'+val.parentId;
      newDiv.setAttribute('class', 'child_categories');
      container.appendChild(newDiv);
      theDiv = document.getElementById("parent_"+val.parentId);
    };
    // CREATE THE INPUT
    var catInput = document.createElement('input');
    catInput.id = 'cat_'+val.catId;
    catInput.setAttribute('type', 'radio');
    catInput.setAttribute('class', 'cat_radio');
    catInput.setAttribute('value', val.catId);
    if(catInput.value == localStorage['category']){
      catInput.setAttribute('checked', true);
    }
    catInput.setAttribute('name', 'category');
    catInput.addEventListener('change', search.changeCat, true);
    
    // CREATE THE LABEL
    var catLabel = document.createElement('label');
    catLabel.setAttribute('title', val.catId);
    catLabel.setAttribute('for', 'cat_'+val.catId);
    catLabel.innerHTML = val.catName;
    catLabel.addEventListener('click', search.clickCat, false);
    
    // APPEND NEW ITEM TO APPROPRIATE Div
    theDiv.appendChild(catInput);
    theDiv.appendChild(catLabel);
  });
  el_catRadio      = document.getElementsByClassName('cat_radio'); // Category radio
  el_subCategories = document.getElementsByClassName('child_categories'); // Sub Category Divs
};
// process JSONp search results
search.displayResults = function(json) {  
  var old_results = document.getElementsByClassName('.auction');
  if(search.page == 1) {
    el_results.innerHTML = "";
  };
  el_results.classList.remove('busy');
  products.loading = true;
  var cardTmpl = Handlebars.compile(cardTemplate);
  $('#results').append( cardTmpl(json) );
  products.checkImages();
  search.pages.push(search.page);
  search.page = search.page+1;
  search.scroll();
};

// getting results JSONp
search.getResults = function() {  
  search.term = el_term.value;
  products.loading = true;
  el_page_loading.className = "page_loading visible";
  var jsonp = document.createElement('script');
  if(search.seller == 'all' && search.category == 0) {
    search.features = true;
    url = app.urlPrefix+'features?callback=search.JSONcallback';
  } else {
    search.features = false;
    url = app.urlPrefix+'auctions?seller='+search.seller+'&page='+search.page+'&category='+search.category+'&term='+search.term+'&callback=search.displayResults';
  }
  //console.log(url);
  jsonp.src = url;
  document.head.appendChild(jsonp);
};

search.setSeller = function(seller){  
  localStorage['seller'] = seller;
  search.seller = seller;
};

search.setCategory = function(category){  
  localStorage['category'] = category;
  search.category = category;
};

search.changeSeller = function(){  
  search.setSeller(this.value);
  search.sendSearch();
}

search.allSellers = function(){  
  el_sellers.value = 'all';
  search.setSeller('all');
  search.sendSearch();
};

search.changeCat = function(){  
  search.setCategory(this.value);
  search.sendSearch();
}

search.clickCat = function(){  
  // console.log('if there is a child pane > toggle class open on both the label and the pane');
};

search.sendSearch = function(){  
  search.page = 1;
  search.loading = true;
  el_results.classList.add('busy');
  search.getResults();
  return false;
};

search.submitForm = function(e){  
  e.preventDefault();
  search.sendSearch();
  return false;
};
search.clearInput = function(e){  
  e.preventDefault();
  el_term.value = "";
  search.sendSearch();
  return false;
};

// trigger the getting of paginated results
search.scroll = function(){
  if(app.view == "favorites") {    
    return;
  } 
  else {
    window.onscroll = function(){
      scrollDiff = document.body.scrollHeight - document.body.scrollTop;
      fromBottom = window.innerHeight + 300;
      if(!search.features && fromBottom >= scrollDiff && !products.loading && search.pages.indexOf(search.page) == -1) {        
        search.getResults();
        el_loading.className = "visible";
      };
    };
  };

};

// PRODUCTS ---------------------------------
var products = {
  loading: false
};

// check for search results images loaded
products.checkImages = function(){  
  $('.fav_input').each(function(){
    if( favorites.list.indexOf(this.value) != -1 ) {
      $(this).attr('checked', true);
    }
  });
  var imgLoad = imagesLoaded(el_results);
  imgLoad.on( 'progress', function(imgLoad, image) {
    card = image.img.parentNode.parentNode;
    card.className = image.isLoaded ? 'auction is-loaded' : 'auction is-broken';
    products.loading = false;
    el_loading.className = "";
    el_page_loading.className = "page_loading";
    el_details = document.getElementsByClassName('details'); // a.details
  });
};

var detailsTemplate = $('#detailsTemplate').html();
products.showDetails = function(json){  
  var template = Handlebars.compile(detailsTemplate);
  var options = {
    backdrop : true,
    keyboard : true,
    show : true
  };
  $('#auctionModal').html( template(json) ).modal(options);
  // $('#myModal').modal(options)
};

products.getDetails = function(details){  
  var jsonp = document.createElement('script');
  jsonp.src = app.urlPrefix+'favorites?auctions='+details+'&callback=products.showDetails';
  document.head.appendChild(jsonp);
};

jQuery('#results').delegate( 'a.details', 'click', function(e){
  e.preventDefault();
  details = $(this).attr('rel');
  products.getDetails(details);
});

(function(){
  el_allSellers   = document.getElementById('all_sellers'); // All Sellers Button
  el_sellers      = document.getElementById('sellers'); // Sellers Select Option Box
  el_categories   = document.getElementById('categories'); // Categories Div
  el_form         = document.getElementById('search_form'); // Search Form
  el_clear        = document.getElementById('input_clear');// Clear Button
  el_no_results   = document.getElementById('no-results');
  el_loading      = document.getElementById('loading');
  el_the_end      = document.getElementById('the_end');
  el_results      = document.getElementById('results');
  el_page_loading = document.getElementById('page-loading');
  el_term         = document.getElementById('search-term'); // Input Field
  el_clear.addEventListener('click', search.clearInput, true);
  el_form.addEventListener('submit', search.submitForm, true);
  el_allSellers.addEventListener('click', search.allSellers, false);
  el_sellers.addEventListener('change', search.changeSeller, true);

  // $('#results').delegate( '.fav_input', 'change', function(e){
  //   console.log(this.value);
  // });

  if(!localStorage['favorites']) {    
    localStorage.setItem('favorites', '[]');
  };
  if(!localStorage['seller'] || localStorage['seller'] === 'undefined') {    
    localStorage['seller'] = 12;
  };
  if(!localStorage['category'] || localStorage['category'] === 'undefined') {    
    localStorage['category'] = 0;
  };

  search.getSellerData();
  search.getCategoryData();
  search.getResults();

})();

// HEADROOM NAVIGATION
(function(){  
  var searchNav = document.querySelector("header");
  Headroom.options = {
    tolerance : {up : 5, down : 0 },
    offset : 40,
    classes : {initial:"headroom",pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top"}
  };
  var headroom  = new Headroom(searchNav);
  headroom.init();
})();