/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery,
console, $location, $ */

(function () {

  function CollectionsCtrl(
    $scope,
    $rootScope,
    config,
    divisions,
    nyplLocationsService,
    nyplUtility,
    researchCollectionService
  ) {
    var rcValues = researchCollectionService.getResearchValues(),
      sibl,
      research_order = config.research_order || ['SASB', 'LPA', 'SC', 'SIBL'],
      getHoursToday = function (obj) {
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
            _.each(data.terms, function (term) {
              var newTerms = term.terms,
                index = term.name === 'Subjects' ? 0 : 1;

              if (term.name === 'Subjects') {
                newTerms = _.chain(term.terms)
                          .pluck('terms')
                          .flatten(true)
                          .unique()
                          .value()
              }

              dataTerms[index] = {
                id: term.id,
                name: term.name,
                terms: newTerms
              };
            });
            dataTerms.push({
              name: 'Locations',
              locations: $scope.divisionLocations
            });
            $scope.terms = dataTerms;
          });
          // .finally(function (data) {
          //   $scope.terms[2] = ({
          //     name: 'Locations',
          //     locations: $scope.divisionLocations
          //   });
          // });
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

            $scope.filteredDivisions.push(sibl);
            $scope.divisions.push(sibl);
            $scope.divisionLocations.push(sibl);
          });
      };

    $rootScope.title = "Research Collections";
    $scope.filter_results = [
      {label: 'Subjects', name: '', id: undefined, active: false},
      {label: 'Media', name: '', id: undefined, active: false},
      {label: 'Locations', name: '', id: undefined, active: false}
    ];
    $scope.divisions = divisions;
    $scope.terms = [];

    $scope.filteredDivisions = rcValues.filteredDivisions || _.chain(divisions)
      .sortBy(function (elem) {
        return elem.name;
      })
      .flatten()
      .value();

    $scope.divisionLocations = _.chain(divisions)
      .pluck('_embedded')
      .flatten()
      .pluck('location')
      .indexBy('id')
      .sortBy(function (elem) {
        return nyplUtility.researchLibraryOrder(
          research_order,
          elem.id
        );
      })
      .flatten()
      .value();

    // Assign Today's hours
    getHoursToday($scope.filteredDivisions);

    loadSIBL();
    loadTerms();

    $scope.selectCategory = function (index, term) {
      if ($scope.categorySelected === index) {
        $scope.categorySelected = undefined;
        $scope.activeCategory = undefined;
        return;
      }

      $scope.activeCategory = term.name;

      // Save the filter. Need to add one for the the parent term.
      // researchCollectionService.setResearchValue('subterms', subterms);

      // For the data-ng-class for the active buttons.
      // Reset the subterm button.
      $scope.categorySelected = index;
    };

    function activeSubterm(label, term) {
      var currentSelected = _.findWhere(
        $scope.filter_results,
        {label: label, name: term.name}
      );

      if (!currentSelected) {
        _.each($scope.filter_results, function (subterm) {
          if (subterm.label === label) {
            subterm.name = term.name;
            subterm.active = true;
            subterm.id = term.id;
          }
        });
        return true;
      }

      $scope['selected' + label + 'Subterm'] = undefined;
      _.each($scope.filter_results, function (subterm) {
        if (subterm.label === label) {
          subterm.name = '';
          subterm.active = false;
          subterm.id = undefined;
        }
      });
      return false;
    }

    function selectSubTermForCategory(index, term) {
      switch ($scope.activeCategory) {
      case 'Subjects':
        $scope.selectedSubjectsSubterm = index;
        activeSubterm('Subjects', term);
        break;
      case 'Media':
        $scope.selectedMediaSubterm = index;
        activeSubterm('Media', term);
        break;
      case 'Locations':
        $scope.selectedLocationsSubterm = index;
        activeSubterm('Locations', term);
        break;
      default:
        break;
      }
    }

    function getIDFilters() {
      return _.chain($scope.filter_results)
        .filter(function (filter) {
          return filter.active;
        })
        .map(function (filter) {
          return filter.id;
        })
        .value();
    }

    function filterDivisions() {
      var idsToCheck = getIDFilters();

      // Filter and sort
      $scope.filteredDivisions = _.chain($scope.divisions)
        .filter(function (division) {
          var foundArr = [];

          if (!division.terms) {
            return false;
          }

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
                if (found) {
                  foundArr.push(true);
                }
              }
            });

            if (!found) {
              if (division._embedded.location.id === termID) {
                foundArr.push(true);
              }
            }
          });

          // Return the boolean value of found. True if there's an object,
          // false if no object was found.
          return (foundArr.length === idsToCheck.length);
        })
        .sortBy(function (elem) {
          return elem.name;
        })
        .flatten()
        .value();
    }

    $scope.filterDivisionsBy = function (index, selectedTerm) {
      // For highlighting the active subterm
      selectSubTermForCategory(index, selectedTerm);

      // // Save the filtered divisions for later.
      // researchCollectionService
      //   .setResearchValue('filteredDivisions', $scope.filteredDivisions);

      return filterDivisions();
    };
  }

  angular
    .module('nypl_research_collections')
    .controller('CollectionsCtrl', CollectionsCtrl);

})();
