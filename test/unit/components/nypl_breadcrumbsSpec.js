/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

/*
 * <nyplbreadcrumbs></nyplbreadcrumbs>
 */
describe('Directive: nyplbreadcrumbs', function () {
  var nyplbreadcrumbs, html, httpBackend, compile, scope;

  beforeEach(function () {
    module('nypl_locations');
    module('directiveTemplates');

    inject(function (_$httpBackend_, _$compile_, _$rootScope_) {
      httpBackend = _$httpBackend_;
      compile = _$compile_;
      scope = _$rootScope_.$new();

      // httpBackend
      //   .expectGET('languages/en.json')
      //   .respond('public/languages/en.json');
    });

    html = '<nypl-breadcrumbs crumb-name="data.crumbName"></nypl-breadcrumbs>';
    nyplbreadcrumbs = createDirective(html);
  });

  function createDirective(template) {
    var element;
    element = compile(template)(scope);
    scope.$digest();

    return element;
  }

  it('should create an unordered list with class breadcrumb', function () {
    var crumbList = nyplbreadcrumbs.find('ul');
    expect(crumbList.attr('class')).toContain('breadcrumb');
  });

  it('should contain attribute "crumb-name"', function () {
    expect(nyplbreadcrumbs.attr('crumb-name')).toBeTruthy();
  });

  it('should contain attribute "crumb-name" value to be "data.crumbName"', function () {
    expect(nyplbreadcrumbs.attr('crumb-name')).toBe('data.crumbName');
  });

  it('should create an empty breadcrumbs scope array element', function () {
    var isoScope = nyplbreadcrumbs.isolateScope();
    expect(isoScope.breadcrumbs.length).toBeLessThan(1);
  });

  it('once a Crumb is inserted, it should add elements to breadcrumbs array', function () {
    var isoScope = nyplbreadcrumbs.isolateScope();

    isoScope.breadcrumbs.push({
      displayName: 'Amenities',
      route: 'amenities'
    });
    expect(isoScope.breadcrumbs.length).toBeGreaterThan(0);
  });
});
