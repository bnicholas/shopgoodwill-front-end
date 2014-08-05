# REQUIRES jquery, underscore, Products, App

# SEARCH ------------------------
search =
  
  page: 1
  pages: []

  # POPULATE SELLERS DROPDOWN
  sellers: ->
    $.ajax
      url: "/sellers.json"
      settings:
        async: true
        success: (data)->
          sellerSelect = document.getElementById("sellers")
          data.forEach (value) ->
            newoption = document.createElement("option")
            newoption.innerHTML = value.name
            newoption.setAttribute "value", value.sellerId
            sellerSelect.appendChild newoption
            return
          sellerSelect.value = localStorage["seller"]

  # POPULATE CATEGORIES
  categories: ->
    $.ajax
      url: "/categories.json"
      settings:
        async: true
        success: (data)->
          # JSON.parse(categories.responseText)
          data.forEach (value) ->
            
            # IF IT'S A TOP TOP LEVEL CATEGORY
            if value.parentId is `undefined`
              theDiv = document.getElementById("top-categories")
            
            # OTHERWISE FIND THE RIGHT SUB-CATEGORY ELEMENT
            else
              theDiv = document.getElementById("parent_" + value.parentId)
            
            # IF SAID ELEMENT ISN'T THERE ... MAKE IT
            unless theDiv
              container = document.getElementById("categories")
              newDiv = document.createElement("div")
              newDiv.id = "parent_" + value.parentId
              newDiv.setAttribute "class", "child_categories"
              container.appendChild newDiv
              theDiv = document.getElementById("parent_" + value.parentId)
            
            # CREATE THE INPUT
            catInput = document.createElement("input")
            catInput.id = "cat_" + value.catId
            catInput.setAttribute "type", "radio"
            catInput.setAttribute "class", "cat_radio"
            catInput.setAttribute "value", value.catId
            catInput.setAttribute "checked", true  if catInput.value is localStorage["category"]
            catInput.setAttribute "name", "category"
            catInput.addEventListener "change", search.changeCat, true
            
            # CREATE THE LABEL
            catLabel = document.createElement("label")
            catLabel.setAttribute "title", value.catId
            catLabel.setAttribute "for", "cat_" + value.catId
            catLabel.innerHTML = value.catName
            catLabel.addEventListener "click", search.clickCat, false
            
            # APPEND NEW ITEM TO APPROPRIATE Div
            theDiv.appendChild catInput
            theDiv.appendChild catLabel
            return

  # process JSONp search results
  displayResults: (json) ->
    old_results = document.getElementsByClassName(".auction")
    el_results.innerHTML = ""  if search.page is 1
    el_results.classList.remove "busy"
    products.loading = true
    
    #cardTmpl = Handlebars.compile(cardTemplate)
    template = app.getTemplate('/templates/auction.handlebars')
    $("#results").append template(json)
    products.checkImages()
    search.pages.push search.page
    search.page = search.page + 1
    search.scroll()
    return

  # getting results JSONp
  getResults: ->
    search.term = el_term.value
    products.loading = true
    el_page_loading.className = "page_loading visible"
    jsonp = document.createElement("script")
    if search.seller is "all" and search.category is 0
      search.features = true
      url = app.urlPrefix + "features?callback=search.displayResults"
    else
      search.features = false
      url = app.urlPrefix + "auctions?seller=" + search.seller + "&page=" + search.page + "&category=" + search.category + "&term=" + search.term + "&callback=search.displayResults"
    
    #console.log(url);
    jsonp.src = url
    document.head.appendChild jsonp
    return

  changeSeller: ->
    localStorage['seller'] = @value
    search.sendSearch()
    return

  allSellers: ->
    el_sellers.value = "all"
    search.setSeller "all"
    search.sendSearch()
    return

  changeCat: ->
    localStorage['category'] = @value
    search.sendSearch()
    return

  sendSearch: ->
    search.page = 1
    search.loading = true
    el_results.classList.add "busy"
    search.getResults()
    false

  submitForm: (e) ->
    e.preventDefault()
    search.sendSearch()
    false

  clearInput: (e) ->
    e.preventDefault()
    el_term.value = ""
    search.sendSearch()
    false

  # trigger the getting of paginated results
  scroll: ->
    if app.view is "favorites"
      return
    else
      console.log "search.scroll"
      scrollDiff = document.body.scrollHeight - document.body.scrollTop
      fromBottom = window.innerHeight + 300
      if not search.features and fromBottom >= scrollDiff and not products.loading and search.pages.indexOf(search.page) is -1
        search.getResults()
        el_loading.className = "visible"
    return

throttled = _.throttle(search.scroll, 100)

$(window).scroll search.scroll


