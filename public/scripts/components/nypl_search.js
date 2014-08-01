/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery */

function nyplSearch() {
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: 'scripts/components/nypl_search.html',
    link: function (scope, element, attrs) {
      console.log(scope);
      console.log(element.find('.search-the-catalog'));

      var o = {};

      function init() {
        angular.element('html').click(function () {
          element.find('.pseudo-select').removeClass('open');
          element.find('.error').removeClass('error');
        });

        var lmnt = element,
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
          clear_error();
        });

        // Setup click action on submit button.
        lmnt.find('.search-button').click(function () {
          return do_search();
        });

        // Setup click action on radio butons
        o.choices.find('li input').click(function () {
          set_prompt(angular.element(this));
        });

        // Setup click action on list items (will be active when items are
        // as buttons on narrow screens
        o.choices.find('li').click(function () {
          if (is_mobile()) {
            if (search_term().length === 0) {
              set_error();
            } else {
              do_search(get_choice(this));
            }
          }
        });
      }

      // Set search box placeholder based on selected item
      function set_prompt(lmnt) {
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
      function  search_term() {
        return $.trim(o.term.val());
      }

      // Set error state in the search input box
      function set_error(err) {
        if (err === undefined) {
          err = 'Please enter a search term';
        }
        return o.term.addClass('error').attr('placeholder', err);
      }

      // Clear error state in the search input box
      function clear_error() {
        return o.term.removeClass('error').attr('placeholder', '');
      }

      // The element referred to by mobile_flag should be hidden by
      // a media query. Checking whether or not it is visible will tell
      // us if that mediq query is active
      function is_mobile() {
        return !o.mobile_flag.is(':visible');
      }

      // Get text of the active search scope selection.
      // choice: optional element to use
      function get_choice(choice) {
        var selectChoice = angular.element(choice);
        if (selectChoice === undefined) {
          selectChoice = o.choices.find('input[type=radio]:checked').parent();
        }
        return $.trim(selectChoice.text()).toLowerCase();
      }

      // Execute the search
      function do_search(scope) {
        var term = search_term(),
          target;

        if (scope === undefined) {
          scope = get_choice();
        }

        // Don't perform search if no term has been entered
        if (term.length === 0) {
          set_error();
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

      init();
    }
  }
}

angular
  .module('nyplSearch', [])
  .directive('nyplSearch', nyplSearch);
