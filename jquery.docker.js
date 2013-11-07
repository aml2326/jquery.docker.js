/*global jQuery, _gaq, window, document */

/**
 * jQuery Docker Plugin
 *
 * Copyright (c) 2013 Adam Leder
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 0.5
 *
 * @param {object} options A JSON object containing configuration options to override defaults. Possible values are:
 *        {bool}   fade       Whether the transitions should fade in. [Default: false] 
 *        {int}    fadeSpeed  Fade transition speed. [Default: 200]
 *        {int}    height     Height of the docked container. [Default: 200]
 *        {int}    offset     Vertical offset used for hiding/showing the docked container. [Default: 0]
 */
(function ($) {
  $.fn.extend({docker: function (options) {

    // Default options
    var defaults = {
      fade: false,
      fadeSpeed: 200,
      height: 200,
      offset: 0
    };

    // Extened the default options with the user inputted ones
    options = $.extend(defaults, options);

    // DOM element to apply plugin to
    var $dockRef = $(this);
    // Store the position of the container 
    // in reference to the document
    var $dockRefPos = $dockRef.offset().top;

    /**
     * [isInView description]
     * 
     * Function used to determine whether or not to display the docked
     * container and whether it has already been added to the DOM.
     * 
     */
    var isInView = function () {
      // Store the window height
      var $windowHeight = $(window).height();
      // Store the amount scrolled
      var $scrolled = $(document).scrollTop();
      var $foundDocker = false;

      // Clone the content of the referenced container
      // This gets appended to the docked continer
      var $dockRefContent = $dockRef.contents().clone();

      // Docked Container
      var $docked = $('<div />', {
        'class': 'docked-container',
        css: {
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 200,
          display: 'none',
          zIndex: 9000
        }
      });

      // Add a content div to the docked container
      // This is where the cloned content will be appended to
      $docked.append('<div class="content" />');

      // Check to see if the docker container has been added
      if ($('.docked-container').length) {
        // Docker container found
        $foundDocker = true;
      } else {
        // Docker container NOT found
        $foundDocker = false;
      }

      // Determine if the docked container lines up with the referenced container ($dockRef)
      if (($windowHeight + $scrolled) < ($dockRefPos + options.height + options.offset)) {
        // Determine whether to append docked-container to DOM or just show it
        if ($foundDocker) {
          // Check settings to fade in or pop in the docked container
          if (options.fade) {
            $('.docked-container').fadeIn(options.fadeSpeed);
          } else {
            $('.docked-container').show();
          }
        } else {
          // Check settings to fade in or pop in the docked container
          if (options.fade) {
            // Added docked container to DOM by fading in
            // append cloned content
            $docked.appendTo('body').fadeIn(options.fadeSpeed).find('.content').append($dockRefContent);
          } else {
            // Added docked container to DOM by poping in
            // append cloned content
            $docked.appendTo('body').show().find('.content').append($dockRefContent);
          }
        }
      } else {
        // Check settings to fade in or pop in the docked container
        if (options.fade) {
          $('.docked-container').fadeOut(options.fadeSpeed, function () {
            // After docked container fades out remove it from the DOM
            $(this).remove();
          });
        } else {
          // Remove docked container from DOM
          $('.docked-container').remove();
        }
      }
    };

    // Check if $dockRef is out of view 
    // on page load
    isInView();

    // On page scroll determine if $dockRef is out of view
    $(document).scroll(isInView);

    // On window resize determine if $dockRef is out of view
    $(window).resize(isInView);

    // Return the element with docker applied
    return this;

  }});
}(jQuery));
