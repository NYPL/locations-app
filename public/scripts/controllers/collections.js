/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $location, $ */

(function () {
  'use strict';

  function CollectionsCtrl(
    $scope,
    $rootScope,
    config,
    divisions,
    nyplLocationsService,
    nyplUtility,
    researchCollectionService
  ) {
    'use strict';
    var rcValues = researchCollectionService.getResearchValues(),
      sibl,
      research_order = config.research_order || ['SASB', 'LPA', 'SC', 'SIBL'],
      getHoursToday = function(obj) {
        _.each(obj, function (elem) {
          if (elem.hours) {
            elem.hoursToday = nyplUtility.hoursToday(elem.hours);
          }
        });
      },
      loadTerms = function () {
        return nyplLocationsService
                .terms()
                .then(function (data) {
                  var dataTerms = [];
                  dataTerms.push({
                    name: 'Subjects',
                    terms: _.chain(data.terms[0].terms)
                            .pluck('terms')
                            .flatten(true)
                            .unique()
                            .value()
                  });
                  dataTerms.push(data.terms[1]);
                  dataTerms.push({
                    name: 'Locations',
                    locations: $scope.divisionLocations
                  });
                  $scope.terms = dataTerms;
                });
                // .catch(function (error) {
                //     throw error;
                // });
      },
      loadSIBL = function () {
        return nyplLocationsService
                .singleLocation('sibl')
                .then(function (data) {
                  getHoursToday([data.location]);
                  sibl = data.location;
                  sibl._embedded.location = {
                    id: 'SIBL'
                  };

                  divisions.push(sibl);
                  $scope.divisionLocations.push(sibl);
                });
      };

    $scope.filter_results = [
      {label: 'Subjects', name: '', id: undefined, active: false},
      {label: 'Media', name: '', id: undefined, active: false},
      {label: 'Locations', name: '', id: undefined, active: false}
    ];
    $scope.active_filter = 'subjects';
    $rootScope.title = "Research Collections";
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
                                  return nyplUtility.researchLibraryOrder(
                                    research_order,
                                    elem.id
                                  );
                                })
                                .flatten()
                                .value();

    loadSIBL();
    loadTerms();

    $scope.setSubterms = function (index, term) {
      var subterms;

      if ($scope.selected == index) {
        $scope.selected = undefined;
        $scope.active_filter = undefined;
        return;
      }

      $scope.active_filter = term.name;

      // Save the filter. Need to add one for the the parent term.
      researchCollectionService.setResearchValue('subterms', subterms);

      // For the data-ng-class for the active buttons. Reset the subterm button.
      $scope.selected = index;
    };

    function activeSubterm(label, term) {
      var currentSelected = _.findWhere(
          $scope.filter_results,
          {label: label, name: term.name}
        );

      if (!currentSelected) {
        _.each($scope.filter_results, function (subterm) {
          if (subterm.label == label) {
            subterm.name = term.name;
            subterm.active = true;
            subterm.id = term.id;
          }
        });
        return true;
      } else {
        $scope['selected' + label + 'Subterm'] = undefined;
        _.each($scope.filter_results, function (subterm) {
          if (subterm.label == label) {
            subterm.name = '';
            subterm.active = false;
            subterm.id = undefined;
          }
        });
        return false;
      }
    }

    function selectSubTermForCategory(index, term) {
      var selectOrDeselect;
      switch ($scope.active_filter) {
        case 'Subjects':
          $scope.selectedSubjectsSubterm = index;
          selectOrDeselect = activeSubterm('Subjects', term);
          break;
        case 'Media':
          $scope.selectedMediaSubterm = index;
          selectOrDeselect = activeSubterm('Media', term);
          break;
        case 'Locations':
          $scope.selectedLocationsSubterm = index;
          selectOrDeselect = activeSubterm('Locations', term);
          break;
        default:
          break;
      }

      return selectOrDeselect;
    }

    function getIDFilters() {
      return _.chain($scope.filter_results)
              .filter(function (filter) {
                return filter.active;
              })
              .map(function (filter){
                return filter.id; 
              })
              .value();
    }

    function filterDivisions() {
      var idsToCheck = getIDFilters();

      $scope.filteredDivisions = $scope.divisions.filter(function (division) {
        var foundArr = [];

        // if (!termID) return true;

        // Only search through divisions with terms property
        // if (division.terms) {
          _.each(idsToCheck, function (termID) {
            var found = false;
            // Search through each parent term
            _.each(division.terms, function (parentTerm) {
              // If already found, no need to keep searching;
              if (!found) {
                // Find the term where the ID matches what was selected
                found = _.find(parentTerm.terms, function (term) {
                  return term.id === termID;
                });
                if (found) foundArr.push(true);
              }
            });

            if (!found) {
              if (division._embedded.location.id === termID) {
                foundArr.push(true);
              }
            }
          });
        // } else if (division._embedded.location) {
          // Matches Locations w/ ID
          // if (division._embedded.location.id === termID) {
          //   foundArr.push(true);
          // }
        // }

        console.log(foundArr);

        if (foundArr.length === idsToCheck.length) {
          console.log('same length');
        }
        // Return the boolean value of found. True if there's an object,
        // false if no object was found.
        return (foundArr.length === idsToCheck.length);
      });
    }

    $scope.filterDivisionsBy = function (index, selectedTerm) {
      // For highlighting the active subterm
      if (!selectSubTermForCategory(index, selectedTerm)) {
        return filterDivisions();
      }

      // // Save the filtered divisions for later.
      // researchCollectionService
      //   .setResearchValue('filteredDivisions', $scope.filteredDivisions);

      return filterDivisions(selectedTerm.id);
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
