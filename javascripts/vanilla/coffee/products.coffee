# PRODUCTS ---------------------------------
products =
  
  loading: false

  # REQUIRES imagesloaded.js, jquery, handlebars
  checkImages: ->
    $(".fav_input").each ->
      $(this).attr "checked", true  unless favorites.list.indexOf(@value) is -1
      return
    imgLoad = imagesLoaded(el_results)
    imgLoad.on "progress", (imgLoad, image) ->
      card = image.img.parentNode.parentNode
      card.className = (if image.isLoaded then "auction is-loaded" else "auction is-broken")
      products.loading = false
      el_loading.className = ""
      el_page_loading.className = "page_loading"
      el_details = document.getElementsByClassName("details") # a.details
      return
    return

  #detailsTemplate: $("#detailsTemplate").html()

  showDetails: (json) ->
    template = app.getTemplate('/templates/modal.handlebars')
    options =
      backdrop: true
      keyboard: true
      show: true
    
    $("#auctionModal").html(template(json)).modal options
    
    return

  getDetails: (details) ->
    jsonp = document.createElement("script")
    jsonp.src = app.urlPrefix + "favorites?auctions=" + details + "&callback=products.showDetails"
    document.head.appendChild jsonp
    return
