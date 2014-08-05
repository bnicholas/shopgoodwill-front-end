(function() {
  var app, favorites, products, search, throttled;

  window.cardTemplate = $("#auctionTemplate").html();

  window.el_allSellers = document.getElementById("all_sellers");

  window.el_sellers = document.getElementById("sellers");

  window.el_categories = document.getElementById("categories");

  window.el_form = document.getElementById("search_form");

  window.el_clear = document.getElementById("input_clear");

  window.el_no_results = document.getElementById("no-results");

  window.el_loading = document.getElementById("loading");

  window.el_the_end = document.getElementById("the_end");

  window.el_results = document.getElementById("results");

  window.el_page_loading = document.getElementById("page-loading");

  window.el_term = document.getElementById("search-term");

  el_clear.addEventListener("click", search.clearInput, true);

  el_form.addEventListener("submit", search.submitForm, true);

  el_allSellers.addEventListener("click", search.allSellers, false);

  el_sellers.addEventListener("change", search.changeSeller, true);

  $("#viewButtons").delegate("button", "click", function() {
    var view;
    view = this.value;
    $("body").attr("class", "").addClass(view);
  });

  $("#results").delegate(".fav_input", "change", function() {
    favorites.toggle(event.target.value);
  });

  $("#results").delegate("a.details", "click", function(e) {
    var details;
    e.preventDefault();
    details = $(this).attr("rel");
    products.getDetails(details);
  });

  search.getSellerData();

  search.getCategoryData();

  search.getResults();

  return;

  app = {
    urlPrefix: "http://localhost:5000/",
    debug: true,
    view: "search",
    view: function(view) {
      document.querySelectorAll("body").className(view);
    },
    getTemplate: function(path) {
      return $.ajax({
        url: path,
        success: function(data) {
          var source, template;
          source = data;
          return template = Handlebars.compile(source);
        }
      });
    }
  };

  if (!localStorage["favorites"]) {
    localStorage.setItem("favorites", "[]");
  }

  if (!localStorage["seller"] || localStorage["seller"] === "undefined") {
    localStorage["seller"] = 12;
  }

  if (!localStorage["category"] || localStorage["category"] === "undefined") {
    localStorage["category"] = 0;
  }

  products = {
    loading: false,
    checkImages: function() {
      var imgLoad;
      $(".fav_input").each(function() {
        if (favorites.list.indexOf(this.value) !== -1) {
          $(this).attr("checked", true);
        }
      });
      imgLoad = imagesLoaded(el_results);
      imgLoad.on("progress", function(imgLoad, image) {
        var card, el_details;
        card = image.img.parentNode.parentNode;
        card.className = (image.isLoaded ? "auction is-loaded" : "auction is-broken");
        products.loading = false;
        el_loading.className = "";
        el_page_loading.className = "page_loading";
        el_details = document.getElementsByClassName("details");
      });
    },
    showDetails: function(json) {
      var options, template;
      template = app.getTemplate('/templates/modal.handlebars');
      options = {
        backdrop: true,
        keyboard: true,
        show: true
      };
      $("#auctionModal").html(template(json)).modal(options);
    },
    getDetails: function(details) {
      var jsonp;
      jsonp = document.createElement("script");
      jsonp.src = app.urlPrefix + "favorites?auctions=" + details + "&callback=products.showDetails";
      document.head.appendChild(jsonp);
    }
  };

  search = {
    page: 1,
    pages: [],
    sellers: function() {
      return $.ajax({
        url: "/sellers.json",
        settings: {
          async: true,
          success: function(data) {
            var sellerSelect;
            sellerSelect = document.getElementById("sellers");
            data.forEach(function(value) {
              var newoption;
              newoption = document.createElement("option");
              newoption.innerHTML = value.name;
              newoption.setAttribute("value", value.sellerId);
              sellerSelect.appendChild(newoption);
            });
            return sellerSelect.value = localStorage["seller"];
          }
        }
      });
    },
    categories: function() {
      return $.ajax({
        url: "/categories.json",
        settings: {
          async: true,
          success: function(data) {
            return data.forEach(function(value) {
              var catInput, catLabel, container, newDiv, theDiv;
              if (value.parentId === undefined) {
                theDiv = document.getElementById("top-categories");
              } else {
                theDiv = document.getElementById("parent_" + value.parentId);
              }
              if (!theDiv) {
                container = document.getElementById("categories");
                newDiv = document.createElement("div");
                newDiv.id = "parent_" + value.parentId;
                newDiv.setAttribute("class", "child_categories");
                container.appendChild(newDiv);
                theDiv = document.getElementById("parent_" + value.parentId);
              }
              catInput = document.createElement("input");
              catInput.id = "cat_" + value.catId;
              catInput.setAttribute("type", "radio");
              catInput.setAttribute("class", "cat_radio");
              catInput.setAttribute("value", value.catId);
              if (catInput.value === localStorage["category"]) {
                catInput.setAttribute("checked", true);
              }
              catInput.setAttribute("name", "category");
              catInput.addEventListener("change", search.changeCat, true);
              catLabel = document.createElement("label");
              catLabel.setAttribute("title", value.catId);
              catLabel.setAttribute("for", "cat_" + value.catId);
              catLabel.innerHTML = value.catName;
              catLabel.addEventListener("click", search.clickCat, false);
              theDiv.appendChild(catInput);
              theDiv.appendChild(catLabel);
            });
          }
        }
      });
    },
    displayResults: function(json) {
      var old_results, template;
      old_results = document.getElementsByClassName(".auction");
      if (search.page === 1) {
        el_results.innerHTML = "";
      }
      el_results.classList.remove("busy");
      products.loading = true;
      template = app.getTemplate('/templates/auction.handlebars');
      $("#results").append(template(json));
      products.checkImages();
      search.pages.push(search.page);
      search.page = search.page + 1;
      search.scroll();
    },
    getResults: function() {
      var jsonp, url;
      search.term = el_term.value;
      products.loading = true;
      el_page_loading.className = "page_loading visible";
      jsonp = document.createElement("script");
      if (search.seller === "all" && search.category === 0) {
        search.features = true;
        url = app.urlPrefix + "features?callback=search.displayResults";
      } else {
        search.features = false;
        url = app.urlPrefix + "auctions?seller=" + search.seller + "&page=" + search.page + "&category=" + search.category + "&term=" + search.term + "&callback=search.displayResults";
      }
      jsonp.src = url;
      document.head.appendChild(jsonp);
    },
    changeSeller: function() {
      localStorage['seller'] = this.value;
      search.sendSearch();
    },
    allSellers: function() {
      el_sellers.value = "all";
      search.setSeller("all");
      search.sendSearch();
    },
    changeCat: function() {
      localStorage['category'] = this.value;
      search.sendSearch();
    },
    sendSearch: function() {
      search.page = 1;
      search.loading = true;
      el_results.classList.add("busy");
      search.getResults();
      return false;
    },
    submitForm: function(e) {
      e.preventDefault();
      search.sendSearch();
      return false;
    },
    clearInput: function(e) {
      e.preventDefault();
      el_term.value = "";
      search.sendSearch();
      return false;
    },
    scroll: function() {
      var fromBottom, scrollDiff;
      if (app.view === "favorites") {
        return;
      } else {
        console.log("search.scroll");
        scrollDiff = document.body.scrollHeight - document.body.scrollTop;
        fromBottom = window.innerHeight + 300;
        if (!search.features && fromBottom >= scrollDiff && !products.loading && search.pages.indexOf(search.page) === -1) {
          search.getResults();
          el_loading.className = "visible";
        }
      }
    }
  };

  throttled = _.throttle(search.scroll, 100);

  $(window).scroll(search.scroll);

  favorites = {
    list: JSON.parse(localStorage.getItem("favorites")),
    show: function(json) {
      var template;
      template = app.getTemplate('/templates/favorites.handlebars');
      $("body").toggleClass("favorites");
      $("#favorites").html(template(json));
    },
    view: function() {
      var details, jsonp;
      app.view = "favorites";
      jsonp = document.createElement("script");
      details = favorites.list.join();
      jsonp.src = app.urlPrefix + "favorites?auctions=" + details + "&callback=favorites.show";
      document.head.appendChild(jsonp);
    },
    toggle: function(v) {
      var addRemove, favId;
      favId = v;
      addRemove = favorites.list.indexOf(favId);
      if (addRemove !== -1) {
        favorites.list.splice(addRemove, 1);
        favorites.updateLocalStorage();
      } else {
        favorites.list.push(favId);
        favorites.updateLocalStorage();
      }
    },
    updateLocalStorage: function() {
      localStorage["favorites"] = JSON.stringify(favorites.list);
    }
  };

}).call(this);
