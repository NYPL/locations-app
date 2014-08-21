# Code Documentation

At the moment, AngularJS services are broken up into namespaces, instead of modules broken up into namespaces. This makes it easier to see the public functions from each service.
Example: nyplLocationsService

    /** @namespace nyplLocationsService */
    function nyplLocationsService($http, $q) {
      var locationsApi = {};
      // ...

      /** @function nyplLocationsService.allLocations 
       * @returns {object} Deferred promise. If it resolves, JSON response from
       *  the API of all NYPL locations. If it is rejected, an error message
       *  is returned saying that it "Could not reach API".
       * @example
       *  nyplLocationsService.allLocations()
       *    .then(function (data) {
       *      var locations = data.locations;
       *    });
       *    .catch(function (error) {
       *      // error = "Could not reach API"
       *    });
       */
      locationsApi.allLocations = function () {
          var defer = $q.defer();

          $http.get(api + '/locations', {cache: true})
              .success(function (data) {
                  defer.resolve(data);
              })
              .error(function () {
                  defer.reject(apiError);
              });
          return defer.promise;
      };
      // ...
      return locationsApi;
    }

Always start JSdoc comments with /**

* @namespace functionName
  * For the function that returns all the functions available in the service.
* @function functionName
  * For every function in the service.
* @private
  * Use if the function or variable is private.
* @param {type} nameOfParam Description of the parameter.
  * @param {type} [nameOfOptionalParam] Use brackets for optional parameters.
* @returns {type} Description of what is returned.
* @description Description of what the function or piece of code does.
* @memberof namespaceName
* @todo Description of what needs to be done to complete the piece of code.
* @example

    nyplLocationsService.allLocations().then(function () {
      ...
    });

## Public function pattern
For the functions that are returned, including the namespace in the @function assigns it to that namespace.

    @function namespaceName.functionName

## Private function pattern
For private functions, denote that it's private with the @private symbol. Instead of including the namespace in the @function name, include it in the @memberof symbol.

    @function privateFunction
    @memberof namespaceName

