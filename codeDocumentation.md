# Code Documentation
We are currently using ngdocs for documentation. It's a version of [jsdoc](http://usejsdoc.org/) made specifically for AngularJS apps. Grunt is used along with [grunt-ngdocs](https://www.npmjs.org/package/grunt-ngdocs) to generate the documentation as a website. With ngdocs, the website documentation displays the AngularJS modules, filters, services, and directives (but it is not responsive :disappointed:).

## Generating Documentation
Run the following command to generate the documentation:

    grunt ngdocumentation

This will generate a website in /ngdocs. To view it locally, a server is needed. To start a very simple server at localhost:8080, run:

    cd ngdocs
    python -m SimpleHTTPServer 8080

## How to add documentation
This is a short writeup on how to add comments in the AngularJS code to generate documentation. Further and more detailed reading can be found in the Resources section below.

* Always start comment block with /**
* The comment block must have
** @ngdoc
** @name
** @description
* @ngdoc is used to describe the module, service, filter, etc. Use one of the following keywords:
** overview
** directive
** filter
** interface
** service
** object
** function
* @name must be written in the following syntax:
** @name <module_name>.<unit>:<unit_name>
* @description is the description of the code that follows
* @methodOf is very useful for a function that returns an API. Services, for example, return objects with functions available in that service. Those functions are methods of the larger service,
** The syntax must follow: @methodOf <module_name>.<unit>:<unit_name>
* @private Use if the function or variable is private.
* @param {type} nameOfParam Description of the parameter.
  * @param {type} [nameOfOptionalParam] Use brackets for optional parameters.
* @requires To indicate what services or modules are required.
* @returns {type} Description of what is returned.
* @todo Description of what needs to be done to complete the piece of code.
* @example Use to display code. Can use three ticks (`) to surround the code but <pre> is preferable.

### Use case: nyplGeocoderService
    /**
     * @ngdoc service
     * @name nypl_locations.service:nyplGeocoderService
     * @requires $q
     * @description
     * AngularJS service that deals with all Google Maps related functions.
     * Can add a map to a page and add markers to the map.
     */
    function nyplGeocoderService($q) {
      var geocoderService = {},
      // ...

      /**
       * @ngdoc function
       * @name geocodeAddress
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} address Address or location to search for.
       * @returns {object} Deferred promise. If it resolves, an object is returned with coordinates and formatted address, or an error if rejected.
       * @example
       * <pre>
       *  nyplGeocoderService.geocodeAddress('Bryant Park')
       *    .then(function (coords) {
       *      // coords.lat, coords.long, coords.name
       *    });
       *    .catch(function (error) {
       *      // "Query too short" or Google error status
       *    });
       * </pre>
       */
      geocoderService.geocodeAddress = function (address) {
        // ...
      }

      // ...

      return geocoderService;
    }

    angular
      .module('nypl_locations')
      .factory('nyplGeocoderService', nyplGeocoderService);


## Resources
A short list of resources on how to implement the documentation in the code.
* [jsdoc](http://usejsdoc.org/)
* [Official AngularJS Documentation wiki](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation)
* [grunt-ngdocs wiki](https://github.com/m7r/grunt-ngdocs/wiki) NOTE: Out of date.
* [angularjs 1.3 source code](https://github.com/angular/code.angularjs.org/blob/master/1.3.0-rc.5/angular.js) - The source code is a great way to learn how to add documentation (and about AngularJS).

