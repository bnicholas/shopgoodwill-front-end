(function($){
  'use strict';
  $('#results').on('click', '.auction_link', function(e){
    e.preventDefault();
    var src = $(this).attr('data-auction');
    var height = $(this).attr('data-height') || 300;
    var width = $(this).attr('data-width') || 400;
    $("#auctionModal iframe").attr({'src':src, 'height': height, 'width': width}); 

  });

})(jQuery);