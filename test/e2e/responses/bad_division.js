/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var bad_response = {
  division: {
    "_id": "GRD",
    "_links": {},
    "about": "",
    "access": "Fully Accessible",
    "contacts": {
      "phone": "(212) 275-6975",
      "email": "grdref@nypl.org"
    },
    "cross_street": null,
    "floor": null,
    "geolocation": {
      "type": "Point",
      "coordinates": [
        -73.9822,
        40.7532
      ]
    },
    "hours": {
      "regular": [
        { "day": "Sun", "open": null, "close": null },
        { "day": "Mon", "open": null, "close": null },
        { "day": "Tue", "open": null, "close": null },
        { "day": "Wed", "open": null, "close": null },
        { "day": "Thu", "open": null, "close": null },
        { "day": "Fri", "open": null, "close": null },
        { "day": "Sat", "open": null, "close": null }
      ]
    },
    "id": "GRD",
    "image": "/sites/default/files/images/stacks.jpg",
    "locality": "New York",
    "location_id": "SASB",
    "location_name": "Stephen A. Schwarzman Building",
    "location_slug": "schwarzman",
    "name": "General Research Division",
    "postal_code": 10018,
    "region": "NY",
    "room": 315,
    "slug": "general-research-division",
    "social_media": [],
    "street_address": "135 East 46th Street",
    "type": "circulating",
    "_embedded": {
      "services": [],
      "events": [],
      "exhibitions": null,
      "blogs": [],
      "alerts": [],
      "divisions": []
    }
  }
};

module.exports = bad_response;
