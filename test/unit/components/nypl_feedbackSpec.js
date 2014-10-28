/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

describe('nyplFeedback module', function () {
  'use strict';

  var $compile, $scope, httpBackend, $rootScope;

  beforeEach(module('nyplFeedback'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  function createDirective(template) {
    var element;
    element = $compile(template)($scope);
    $scope.$digest();

    return element;
  }

  describe('Directive: nyplFeedback', function () {
    var nyplFeedback, feedbackBtn, html;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $scope = $rootScope.$new();
    }));

    describe('Default options', function () {
      beforeEach(function () {
        html = '<nypl-feedback data-url="https://www.surveymonkey.com"/>';
        nyplFeedback = createDirective(html);
      });

      it('should compile', function () {
        expect(nyplFeedback.attr('id')).toContain('nyplFeedback');
      });

      it('should have a "right" class assigned', function () {
        // By default, the feedback will be located on the right side
        // of the page.
        expect(nyplFeedback.attr('class')).toContain('right');
      });

      it('should toggle the class "open" when the button is clicked',
        function () {
          feedbackBtn = nyplFeedback.find('a');

          expect(nyplFeedback.attr('class')).not.toContain('open');

          feedbackBtn.click();
          expect(nyplFeedback.attr('class')).toContain('open');

          feedbackBtn.click();
          expect(nyplFeedback.attr('class')).not.toContain('open');
        });

      it('should toggle the button text between "Feedback" and "Close"',
        function () {
          feedbackBtn = nyplFeedback.find('a');

          expect(feedbackBtn.text()).toEqual('Feedback');

          feedbackBtn.click();
          expect(feedbackBtn.text()).toEqual('Close');

          feedbackBtn.click();
          expect(feedbackBtn.text()).toEqual('Feedback');
        });

      it('should watch the rootScope variable', function () {
        feedbackBtn = nyplFeedback.find('a');

        // Initially the feedback is closed and the button displays 'Feedback'
        expect(feedbackBtn.text()).toEqual('Feedback');
        expect(nyplFeedback.attr('class')).not.toContain('open');

        // Now it is opened and the text reads 'Close'
        feedbackBtn.click();
        expect(feedbackBtn.text()).toEqual('Close');
        expect(nyplFeedback.attr('class')).toContain('open');

        // A state was changed and the $rootScope variable was updated
        // which closes the feedback survey.
        $rootScope.close_feedback = true;
        $rootScope.$apply();

        expect($rootScope.close_feedback).toEqual(false);
        expect(feedbackBtn.text()).toEqual('Feedback');
        expect(nyplFeedback.attr('class')).not.toContain('open');
      });
    });

    describe('Assign left side of the page', function () {
      beforeEach(function () {
        // Explicitly making the survey go on the left side.
        html = '<nypl-feedback data-url="https://www.surveymonkey.com" ' +
          'side="left"/>';
        nyplFeedback = createDirective(html);
      });

      it('should compile', function () {
        expect(nyplFeedback.attr('id')).toContain('nyplFeedback');
      });

      it('should have a "left" class assigned', function () {
        expect(nyplFeedback.attr('class')).toContain('left');
      });
    });

  });

});

