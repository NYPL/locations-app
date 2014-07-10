/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery */

function headerScripts() {
  'use strict';

  // Toggle Desktop Login Form
  $('.login-button').click(function () {
    $('.sso-login').toggleClass('visible');
  });

  // Toggle Mobile Login Form
  $('.mobile-login').click(function () {
    $('.sso-login').toggleClass('visible');
  });

  // Toggle Mobile Navigation
  $('.nav-open-button').click(function () {
    $(this).toggleClass('open');
    $('.search-open-button').removeClass('open');
    $('#search-block-form-input').removeClass('open-search');
    $('.search-options-resp').removeClass('open');
    $('#search-top').removeClass('open');
    $('#main-nav').toggleClass('open-navigation');
    $('.sso-login').removeClass('visible');
    return false;
  });

  // Toggle Mobile Search
  $('.search-open-button').click(function () {
    $(this).toggleClass('open');
    $('.nav-open-button').removeClass('open');
    $('#main-nav').removeClass('open-navigation');
    $('#search-block-form-input').toggleClass('open-search');
    $('#search-top').toggleClass('open');
    $('.sso-login').removeClass('visible');
    return false;
  });

  // Open/Close Main Navigation
  $('.dropDown').hover(
    function () {
      $(this).addClass('openDropDown');
    },
    function () {
      $(this).removeClass('openDropDown');
    }
  );

  // Search
  (function ($) {

    var o = {}, methods = {
      init : function (options) {

        // Close open pseudo-select when user clicks outside
        (function (search) {
          $('html').click(function () {
            search.each(function () {
              $(this).find('.pseudo-select')
                .removeClass('open');
              $(this).find('.error').removeClass('error');
            });
          });
        }(this));

        return this.each(function () {
          var lmnt = $(this),
            mobile_hidden = lmnt.find('.hidden-xs').eq(0);

          o.term = lmnt.find('#search-block-form-input');
          o.search_button = lmnt.find('.search_button');
          o.choices = lmnt.find('.pseudo-select');
          o.mobile_flag = lmnt.find('.search-button');
          o.prompt = {
            default_val: o.term.attr("placeholder"),
            catalog: "Search the catalog",
            site: "Search NYPL.org"
          };

          // Don't let clicks get out of the search box
          lmnt.click(function (e) {
            e.stopPropagation();
          });

          // Override default submit, fire search button click event 
          // instead
          lmnt.find("#search-block-form").submit(function () {
            o.search_button.click();
            return false;
          });

          // Open search scope pane when you click into the
          // search input
          o.term.focus(function (e) {
            o.choices.addClass('open');
          });

          // If the error class has been set on the input box, remove it
          // when the user clicks into it
          o.term.focus(function () {
            methods.clear_error();
          });

          // Setup click action on submit button.
          lmnt.find('.search-button').click(function () {
            return methods.do_search();
          });

          // Setup click action on radio butons
          o.choices.find('li input').click(function () {
            methods.set_prompt(this);
          });

          // Setup click action on list items (will be active when items are
          // as buttons on narrow screens
          o.choices.find('li').click(function () {
            if (methods.is_mobile()) {
              if (methods.search_term().length === 0) {
                methods.set_error();
              } else {
                methods.do_search(methods.get_choice(this));
              }
            }
          });
        });
      },

      // Set search box placeholder based on selected item
      set_prompt: function (lmnt) {
        var item = $(lmnt).closest('li');
        if (item.hasClass('search-the-catalog')) {
          return o.term.attr('placeholder', o.prompt.catalog);
        }

        if (item.hasClass('search-the-website')) {
          return o.term.attr('placeholder', o.prompt.site);
        }

        return o.term.attr('placeholder', o.prompt.default_val);
      },

      // Get the search term from the input box. Returns '' if the
      // term is undefined
      search_term: function () {
        return $.trim(o.term.val());
      },

      // Set error state in the search input box
      set_error: function (err) {
        if (err === undefined) {
          err = 'Please enter a search term';
        }
        return o.term.addClass('error').attr('placeholder', err);
      },

      // Clear error state in the search input box
      clear_error: function () {
        return o.term.removeClass('error').attr('placeholder', '');
      },

      // The element referred to by mobile_flag should be hidden by
      // a media query. Checking whether or not it is visible will tell
      // us if that mediq query is active
      is_mobile: function () {
        return !o.mobile_flag.is(':visible');
      },

      // Get text of the active search scope selection.
      // choice: optional element to use
      get_choice: function (choice) {
        if (choice === undefined) {
          choice = o.choices.find('input[type=radio]:checked').parent();
        }
        return $.trim($(choice).text()).toLowerCase();
      },

      // Execute the search
      do_search: function (scope) {
        var term = methods.search_term(),
          target;

        if (scope === undefined) {
          scope = methods.get_choice();
        }

        // Don't perform search if no term has been entered
        if (term.length === 0) {
          methods.set_error();
          return false;
        }

        if (scope === 'nypl.org') {
          target = window.location.protocol + '//' + 'nypl.org'
            + '/search/apachesolr_search/' + term;
        } else {
          // Bibliocommons by default
          target = 'http://nypl.bibliocommons.com/search?t=smart&q='
            + term + '&commit=Search&searchOpt=catalogue';
        }
        window.location = target;
        return false;
      }
    };

    $.fn.nypl_search = function (method) {
      if (methods[method]) {
        return methods[method]
          .apply(this, Array.prototype.slice.call(arguments, 1));
      }

      if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      }

      $.error('Method ' +  method + ' does not exist');
    };
  }(jQuery));

  var defaultInputText  = 'Find books, music, movies and more',
      defaultInputText2 = 'NYPL events, locations and more',
      header_search     = $('#search-top').nypl_search();
}

// On Document Load
// $(headerScripts());