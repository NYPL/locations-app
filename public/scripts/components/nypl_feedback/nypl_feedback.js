/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplFeedback.directive:nyplFeedback
   * @restrict E
   * @requires $sce
   * @requires $rootScope
   * @scope
   * @description
   * Creates a small form component on the page that outputs an iframe to a
   * the link that's passed as an attribute. The height and width must also
   * be included when being created. The feedback button can display on the
   * right or left side of the page.
   * @example
   * <pre>
   *  <!-- Display the button on the right side and slide the feedback left -->
   *  <nypl-feedback data-url="https://www.surveymonkey.com/s/8T3CYMV"
   *    data-side="right" data-height="660" data-width="300"></nypl-feedback>
   *
   *  <!-- Display the button on the left side and slide the feedback right,
   *    different height and width -->
   *  <nypl-feedback data-url="https://www.surveymonkey.com/s/8T3CYMV"
   *    data-side="right" data-height="500" data-width="290"></nypl-feedback>
   * </pre>
   */
  function nyplFeedback($sce, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/nypl_feedback/nypl_feedback.html',
      replace: true,
      scope: {
        height: '@',
        width: '@',
        url: '@',
        side: '@'
      },
      link: function (scope, element, attrs) {
        var arrow_direction = 'right';

        scope.trusted_url = $sce.trustAsResourceUrl(scope.url);
        scope.feedback = 'Feedback';

        if (scope.side === 'left') {
          element.addClass('left');
          arrow_direction = 'left';
        } else {
          element.addClass('right');
        }

        $rootScope.$watch('close_feedback', function (newVal, oldVal) {
          if (newVal) {
            $rootScope.close_feedback = false;
            element.removeClass('open');
            scope.feedback = 'Feedback';
            // element.find('a').removeClass('icon-arrow-' + arrow_direction);
          }
        });

        element.find('a').click(function () {
          element.toggleClass('open');
          // element.find('a').toggleClass('icon-arrow-' + arrow_direction);
          scope.feedback = element.hasClass('open') ? 'Close' : 'Feedback';

          scope.$apply();
        });
      }
    };
  }
  nyplFeedback.$inject = ["$sce", "$rootScope"];

  /**
   * @ngdoc overview
   * @module nyplFeedback
   * @name nyplFeedback
   * @description
   * AngularJS module for adding a feedback button and iframe to the site.
   * Currently used for adding Survey Monkey as the feedback form.
   */
  angular
    .module('nyplFeedback', [])
    .directive('nyplFeedback', nyplFeedback);

})();