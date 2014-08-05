window.cardTemplate = $("#auctionTemplate").html()
window.el_allSellers = document.getElementById("all_sellers") # All Sellers Button
window.el_sellers = document.getElementById("sellers") # Sellers Select Option Box
window.el_categories = document.getElementById("categories") # Categories Div
window.el_form = document.getElementById("search_form") # Search Form
window.el_clear = document.getElementById("input_clear") # Clear Button
window.el_no_results = document.getElementById("no-results")
window.el_loading = document.getElementById("loading")
window.el_the_end = document.getElementById("the_end")
window.el_results = document.getElementById("results")
window.el_page_loading = document.getElementById("page-loading")
window.el_term = document.getElementById("search-term") # Input Field

# so now I'm adding event listeners to these elements
# the handlers could be methods of different objects
el_clear.addEventListener "click", search.clearInput, true
el_form.addEventListener "submit", search.submitForm, true
el_allSellers.addEventListener "click", search.allSellers, false
el_sellers.addEventListener "change", search.changeSeller, true

$("#viewButtons").delegate "button", "click", ->
  view = @value
  $("body").attr("class", "").addClass view
  return

$("#results").delegate ".fav_input", "change", ->
  favorites.toggle event.target.value
  return

$("#results").delegate "a.details", "click", (e) ->
  e.preventDefault()
  details = $(this).attr("rel")
  products.getDetails details
  return

# these are just initializers ... do I need these or should I use a self exec funct?
search.getSellerData()
search.getCategoryData()
search.getResults()
return

