/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $location, $ */

(function () {
  'use strict';

  function CollectionsCtrl(
    $scope,
    $rootScope,
    config,
    divisions,
    terms,
    nyplLocationsService,
    researchCollectionService,
    nyplUtility
  ) {
    'use strict';
    var rcValues = researchCollectionService.getResearchValues(),
      research_order = config.research_order || ['SASB', 'LPA', 'SC', 'SIBL'],
      getHoursToday = function(obj) {
        _.each(obj, function (elem) {
          if (elem.hours) {
            elem.hoursToday = nyplUtility.hoursToday(elem.hours);
          }
        });
      };

    $rootScope.title = "Research Collections";
    $scope.terms = terms;
    $scope.divisions = divisions;
    // Get saved values first, if not then the default will display.
    $scope.subterms = rcValues.subterms;
    $scope.activeFilter = false;
    $scope.filteredDivisions = rcValues.filteredDivisions || divisions;
    $scope.divisionLocations = _.chain(divisions)
                                .pluck('_embedded')
                                .flatten()
                                .pluck('location')
                                .indexBy('id')
                                .sortBy( function (elem) {
                                  nyplUtility.researchLibraryOrder(
                                    research_order,
                                    elem.id
                                  );
                                })
                                .flatten()
                                .value();

    $scope.setSubterms = function (index, term) {
      var subterms;

      // The Subjects term has nested terms so we must pluck the 
      // terms property from every term. Check the API.
      if (term.id == 42) {
        subterms = _.chain(terms[index].terms)
          .pluck('terms')
          .flatten(true)
          .unique()
          .value();
      } else {
      // The Media term has all the terms listed as a flat array.
        subterms = terms[index].terms;
      }

      // Save the filter. Need to add one for the the parent term.
      researchCollectionService.setResearchValue('subterms', subterms);
      $scope.subterms = subterms;

      // For the data-ng-class for the active buttons. Reset the subterm button.
      $scope.selected = index;
      $scope.activeFilter = false;
      $scope.selectedSubterm = undefined;
    };

    $scope.filterDivisionsBy = function (index, selectedTerm) {
      var termID = selectedTerm.id;

      // Set class active to the subterm.
      $scope.selectedSubterm = index;
      $scope.filteredDivisions = $scope.divisions.filter(function (division) {
        var found;

        // Only search through divisions with terms property
        if (division.terms) {
          // Search through each parent term
          _.each(division.terms, function (parentTerm) {
            // If already found, no need to keep searching;
            if (!found) {
              // Find the term where the ID matches what was selected
              found = _.find(parentTerm.terms, function (term) {
                return term.id === termID;
              });
            }
          });
        } else if (division._embedded.location) {
          _.each(division._embedded, function (parent) {
            found = parent.id === termID;
          });
        }

        // Return the boolean value of found. True if there's an object,
        // false if no object was found.
        return !!found;
      });

      // Save the filtered divisions for later.
      researchCollectionService
        .setResearchValue('filteredDivisions', $scope.filteredDivisions);
    };

    $scope.setLocations = function (obj) {
      // Toggles Active filter
      $scope.activeFilter = $scope.activeFilter === false ? true : false;
      $scope.selected = undefined;
      $scope.selectedSubterm = undefined;

      // Ensure data exists
      if (obj) {
        $scope.subterms = $scope.activeFilter === true ? obj : undefined;
      } else {
        throw new Error('Could not determine filtered locations. Check API response');
      }
    };

    // Assign Today's hours
    getHoursToday($scope.divisions);
  }

  angular
    .module('nypl_locations')
    .controller('CollectionsCtrl', CollectionsCtrl);
})();
