app =
  # "http://goodwillapi.herokuapp.com/"
  
  urlPrefix: "http://localhost:5000/"
  
  debug: true
  
  view: "search"

  view: (view) ->
    document.querySelectorAll("body").className view
    return

  getTemplate : (path) ->
    $.ajax(
      url: path
      success: (data) ->
        source = data
        template = Handlebars.compile(source)
    )
        