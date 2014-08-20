
  describe('One service page', function () {
    beforeEach(function () {
      browser.get('/#/services/36');
      browser.sleep(1000);
    });

    it('should display the name of the service', function () {
      expect(servicesPage.serviceName.getText()).toEqual('Bicycle Rack');
    });

    it('should display a list of locations', function () {
      expect(servicesPage.locations.count()).toBe(24);
    });
  });