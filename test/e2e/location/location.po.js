var locationPage = function () {
  this.name = element(by.binding('location.name'));

  this.street_address = element(by.binding('location.street_address'));
  this.locality = element(by.binding('location.locality'));
  this.region = element(by.binding('location.region'));
  this.postal_code = element(by.binding('location.postal_code'));

  this.manager = element(by.binding('location.contacts.manager'));
  this.social_media = element.all(by.repeater('social in location.social_media'));

  this.hoursToday = element(by.css('.hours-today'));
  this.hours = element.all(by.repeater('hours in location.hours.regular'));

  this.divisions = element.all(by.repeater('division in location._embedded.divisions'));

  this.events = element.all(by.repeater('event in location._embedded.events'));

  this.about = element(by.binding('location.about'));

  this.blogs = element.all(by.repeater('blog in location._embedded.blogs'));

  this.exhibitions = element.all(by.repeater('exhibition in location._embedded.exhibitions'));
};

module.exports = new locationPage();