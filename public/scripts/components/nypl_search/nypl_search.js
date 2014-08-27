/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

function nyplSearch() {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: 'scripts/components/nypl_search/nypl_search.html',
    link: function (scope, element, attrs) {
      var o = {};

      // Set search box placeholder based on selected item
      function setPrompt(lmnt) {
        var item = lmnt.closest('li');
        if (item.hasClass('search-the-catalog')) {
          return o.term.attr('placeholder', o.prompt.catalog);
        }

        if (item.hasClass('search-the-website')) {
          return o.term.attr('placeholder', o.prompt.site);
        }

        return o.term.attr('placeholder', o.prompt.default_val);
      }

      // Get the search term from the input box. Returns '' if the
      // term is undefined
      function searchTerm() {
        return $.trim(o.term.val());
      }

      // Set error state in the search input box
      function setError(err) {
        if (err === undefined) {
          err = 'Please enter a search term';
        }
        return o.term.addClass('error').attr('placeholder', err);
      }

      // Clear error state in the search input box
      function clearError() {
        return o.term.removeClass('error').attr('placeholder', '');
      }

      // The element referred to by mobile_flag should be hidden by
      // a media query. Checking whether or not it is visible will tell
      // us if that mediq query is active
      function isMobile() {
        return !o.mobile_flag.is(':visible');
      }

      // Get text of the active search scope selection.
      // choice: optional element to use
      function getChoice(choice) {
        if (choice === undefined) {
          choice = o.choices.find('input[type=radio]:checked').parent();
        }
        return $.trim(choice.text()).toLowerCase();
      }

      // Execute the search
      function doSearch(scope) {
        var term = searchTerm(),
          target;

        if (scope === undefined) {
          scope = getChoice();
        }

        // Don't perform search if no term has been entered
        if (term.length === 0) {
          setError();
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

      function init() {
        angular.element('html').click(function () {
          element.find('.pseudo-select').removeClass('open');
          element.find('.error').removeClass('error');
        });

        var lmnt = element;

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
          clearError();
        });

        // Setup click action on submit button.
        lmnt.find('.search-button').click(function () {
          return doSearch();
        });

        // Setup click action on radio butons
        o.choices.find('li input').click(function () {
          setPrompt(angular.element(this));
        });

        // Setup click action on list items (will be active when items are
        // as buttons on narrow screens
        o.choices.find('li').click(function () {
          if (isMobile()) {
            if (searchTerm().length === 0) {
              setError();
            } else {
              doSearch(getChoice(angular.element(this)));
            }
          }
        });
      }

      init();
    }
  };
}

angular
  .module('nyplSearch', [])
  .directive('nyplSearch', nyplSearch);
