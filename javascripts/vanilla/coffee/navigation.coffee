(->
  "use strict"
  
  searchNav = document.querySelector("header")
  
  Headroom.options =
    tolerance:
      up: 5
      down: 0

    offset: 40
    
    # css classes to apply
    classes:
      
      # when element is initialised
      initial: "headroom"
      
      # when scrolling up
      pinned: "headroom--pinned"
      
      # when scrolling down
      unpinned: "headroom--unpinned"
      
      # when above offset
      top: "headroom--top"
      
      # when below offset
      notTop: "headroom--not-top"

  headroom = new Headroom(searchNav)

  headroom.init()

  return

)()
