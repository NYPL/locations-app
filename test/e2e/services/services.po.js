var servicesPage = function () {
  this.serviceName = element(by.binding('service_name'));
  this.locationName = element(by.binding('location.name'));

  this.services = element.all(by.repeater('service in services'));
  this.locations = element.all(by.repeater('location in locations'));
};

module.exports = new servicesPage();