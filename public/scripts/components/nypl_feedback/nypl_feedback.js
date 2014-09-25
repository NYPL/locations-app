/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  function nyplFeedback() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/nypl_feedback/nypl_feedback.html',
      replace: true,
      link: function (scope, element, attrs) {
        // angular.element('body')
        // .append(
        //   angular.element('<script src="https://www.surveymonkey.com/jsEmbed.aspx?sm=wgm6MpPvYEOBmkziK9HOKA_3d_3d"> </script>')
        //   );
      }
    };
  }

  angular
    .module('nyplFeedback', [])
    .directive('nyplFeedback', nyplFeedback);

})();