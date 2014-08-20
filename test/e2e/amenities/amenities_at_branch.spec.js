  describe('One location page', function () {
    beforeEach(function () {
      browser.get('/#/services/location/CHR');
      browser.sleep(1000);
    });

    it('should display the name of the service', function () {
      expect(servicesPage.locationName.getText())
        .toEqual('Chatham Square Library');
    });

    it('should display a list of services', function () {
      expect(servicesPage.services.count()).toBe(49);
    });
  });