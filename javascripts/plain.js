// TO DO
// -------------------------------------
// DEAL WITH ALL ALL SITUATION
// LOADING INDICATOR
// category and sub-category interaction
// fetch results function 
// fetch single auction function

// Elements
var el_categories ,el_subCategories ,el_allSellers ,el_form ,el_clear ,el_term ,el_sellers ,el_catRadio 
,el_details ,el_no_results ,el_loading ,el_the_end ,el_results, el_page_loading;

var app = {
  // "http://goodwillapi.herokuapp.com/"
  urlPrefix: "http://localhost:5000/"
};


// FAVORITES ------------------
var favorites = {
  list: JSON.parse(localStorage.getItem('favorites'))
};
// toggle a favorite
favorites.toggle = function(e) {
  var favId = e.value;
  var addRemove = favorites.indexOf(favId);
  if( addRemove != -1) {
    favorites.splice(addRemove,1);
    updateFavorites();
  } else {
    favorites.push(favId);
    updateFavorites();
  };
};
// convert localStorage favorites to array
favorites.updateLocalStorage = function(){
  localStorage['favorites'] = JSON.stringify(favorites.list);
};


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
// search.getSellerData();

// Populate Seller Navigation
search.createSellers = function(){
  search.sellers.forEach(function(value) {
    sellerSelect = document.getElementById('sellers');
    newoption = document.createElement('option');
    newoption.innerHTML =  value.name;
    newoption.setAttribute('value', value.sellerId);
    sellerSelect.appendChild(newoption);
  });

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
search.JSONcallback = function(json) {
  var old_results = document.getElementsByClassName('.auction');
  if(search.page == 1) {
    el_results.innerHTML = "";
  };
  el_results.classList.remove('busy');
  products.loading = true;
  json.forEach(function(val, i, arr){
    products.makeCard(val);
    if(i+1 == arr.length) {
      products.checkImages();
    };
  });
  search.pages.push(search.page);
  search.page = search.page+1;
  // Init here so it doesn't call unitl there's results
  search.scroll();
};
// getting results JSONp
search.getResults = function() {
  search.term = el_term.value;
  console.log(search.term);
  products.loading = true;
  el_page_loading.className = "page_loading visible";
  var jsonp = document.createElement('script');
  if(search.seller == 'all' && search.category == 0) {
    search.features = true;
    url = app.urlPrefix+'features?callback=search.JSONcallback';
  } else {
    search.features = false;
    url = app.urlPrefix+'auctions?seller='+search.seller+'&page='+search.page+'&category='+search.category+'&term='+search.term+'&callback=search.JSONcallback';
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
  window.onscroll = function(){
    scrollDiff = document.body.scrollHeight - document.body.scrollTop;
    fromBottom = window.innerHeight + 300;
    // console.log(search.pages.indexOf(search.page) == -1);
    // if we've scrolled to the bottom & products aren't loading & we haven't called this page yet
    if(!search.features && fromBottom >= scrollDiff && !products.loading && search.pages.indexOf(search.page) == -1) {
      console.log("At the Bottom Sir");
      console.log(scrollDiff+" "+fromBottom);
      search.getResults();
      el_loading.className = "visible";
      // add loading
    }
  }
};

// PRODUCTS ---------------------------------
var products = {
  loading: false
};
products.getDetails = function(){
  // console.log('getDetails()');
};
// create auction card
products.makeCard = function(a) {
  resultsDiv = document.getElementById('results');  
  card       = document.createElement('div');
  info       = document.createElement('div');
  price      = document.createElement('span');
  ending     = document.createElement('span');
  bids       = document.createElement('span');
  fav        = document.createElement('input');
  label      = document.createElement('label');
  link       = document.createElement('a');
  thumb      = document.createElement('img');
  
  price.innerHTML = a.itemPrice;
  ending.innerHTML = a.itemEnd;
  bids.innerHTML = a.itemBids;
  fav.setAttribute('value', a.itemNumber);
  fav.id = "a_"+a.itemNumber;
  fav.setAttribute('type', 'checkbox');
  label.innerHTML = 'favorite';
  label.setAttribute('for', "a_"+a.itemNumber);
  info.setAttribute('class', 'info');
  info.appendChild(price);
  info.appendChild(ending);
  info.appendChild(bids);
  info.appendChild(fav);
  info.appendChild(label);

  link.setAttribute('href', a.itemURL);
  link.setAttribute('class', 'details');
  link.setAttribute('target', '_tab');
  thumb.className = "";
  thumb.setAttribute('src', a.itemImage);
  thumb.setAttribute('alt', a.itemNumber);
  link.appendChild(thumb);
  link.addEventListener('click', products.getDetails, true);
  
  card.className = 'auction';
  card.appendChild(info);
  card.appendChild(link);
  
  resultsDiv.appendChild(card);
};
// check for search results images loaded
products.checkImages = function(){
  //var container = document.getElementById('results');
  var imgLoad = imagesLoaded(el_results);
  imgLoad.on( 'progress', function(imgLoad, image) {
    card = image.img.parentNode.parentNode;
    card.className = image.isLoaded ? 'auction is-loaded' : 'auction is-broken';
    products.loading = false;
    el_loading.className = "";
    el_page_loading.className = "page_loading";
    el_details = document.getElementsByClassName('details'); // a.details
    // console.log(document.body.scrollHeight);
  });
};


// simple init of dom elements 


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
  el_sellers.value = localStorage['seller'];
  el_sellers.addEventListener('change', search.changeSeller, true);


  if(!localStorage['favorites']) {
    localStorage.setItem('favorites', '[]');
  };
  if(!localStorage['seller'] || localStorage['seller'] === "undefined") {
    localStorage['seller'] = 12;
  };
  if(!localStorage['category'] || localStorage['category'] === "undefined") {
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