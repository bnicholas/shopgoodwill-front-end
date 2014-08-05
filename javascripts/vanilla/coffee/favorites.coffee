# FAVORITES ------------------
favorites = 
  
  list: JSON.parse(localStorage.getItem("favorites"))

  show: (json) ->
    # favoritesTemplate = $("#favoritesTemplate").html()
    # template = Handlebars.compile(favoritesTemplate)
    template = app.getTemplate('/templates/favorites.handlebars')
    $("body").toggleClass "favorites"
    $("#favorites").html template(json)
    return

  view: ->
    app.view = "favorites"
    jsonp = document.createElement("script")
    details = favorites.list.join()
    jsonp.src = app.urlPrefix + "favorites?auctions=" + details + "&callback=favorites.show"
    document.head.appendChild jsonp
    return

  toggle: (v) ->
    favId = v
    addRemove = favorites.list.indexOf(favId)
    unless addRemove is -1
      favorites.list.splice addRemove, 1
      favorites.updateLocalStorage()
    else
      favorites.list.push favId
      favorites.updateLocalStorage()
    return


  # convert localStorage favorites to array
  updateLocalStorage: ->
    localStorage["favorites"] = JSON.stringify(favorites.list)
    return