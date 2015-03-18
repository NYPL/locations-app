/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  global: {
    alerts: [
      {
        id: 287824,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/287824"
        }
        },
        closed_for: "Daylight closing",
        msg: "Daylight Test Alert",
        display: {
        start: "2015-03-07T00:00:00-05:00",
        end: "2015-03-20T00:00:00-04:00"
        },
        applies: {
        start: "2015-03-07T00:00:00-05:00",
        end: "2015-03-20T00:00:00-04:00"
        }
      },
      {
        id: 283839,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283839"
        }
        },
        msg: "<p>The New York Public Library will be closed on Sunday, April 5.</p>",
        display: {
        start: "2015-04-01T00:00:00-04:00",
        end: "2015-04-06T00:00:00-04:00"
        }
      },
      {
        id: 283840,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283840"
        }
        },
        msg: "<p>The New York Public Library will be closed from May 23 through May 25 in observance of Memorial Day.</p>",
        display: {
        start: "2015-05-17T00:00:00-04:00",
        end: "2015-05-26T00:00:00-04:00"
        }
      },
      {
        id: 283846,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283846"
        }
        },
        msg: "<p>All units of the NYPL will be closed July 4.</p>",
        display: {
        start: "2015-06-27T00:00:00-04:00",
        end: "2015-07-05T00:00:00-04:00"
        }
      },
      {
        id: 283851,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283851"
        }
        },
        msg: "<p>The New York Public Library will be closed September 5th through September 7th in observance of Labor Day.</p>",
        display: {
        start: "2015-08-28T00:00:00-04:00",
        end: "2015-09-08T00:00:00-04:00"
        }
      },
      {
        id: 283892,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283892"
        }
        },
        msg: "<p>The New York Public Library will be closed on Monday, October 12 in observance of Columbus Day.</p>",
        display: {
        start: "2015-10-07T00:00:00-04:00",
        end: "2015-10-13T00:00:00-04:00"
        }
      },
      {
        id: 283893,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283893"
        }
        },
        msg: "<p>The New York Public Library will be closed on November 11 in observance of Veterans Day.</p>",
        display: {
        start: "2015-11-06T00:00:00-05:00",
        end: "2015-11-12T00:00:00-05:00"
        }
      },
      {
        id: 283894,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283894"
        }
        },
        msg: "<p>The New York Public Library will be closed on Thanksgiving Day, Thursday, November 26.</p>",
        display: {
        start: "2015-11-20T00:00:00-05:00",
        end: "2015-11-27T00:00:00-05:00"
        }
      },
      {
        id: 283895,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283895"
        }
        },
        msg: "<p>All NYPL locations will close at 5 PM on December 24 and will be closed on December 25.</p>",
        display: {
        start: "2015-12-17T00:00:00-05:00",
        end: "2015-12-26T00:00:00-05:00"
        }
      },
      {
        id: 283896,
        scope: "all",
        _links: {
        web: {
        href: "http://dev.www.aws.nypl.org/node/283896"
        }
        },
        msg: "<p>All NYPL locations will close at 5 PM on December 31 and will be closed on January 1, 2015.</p>",
        display: {
        start: "2015-12-26T00:00:00-05:00",
        end: "2016-01-02T00:00:00-05:00"
        }
      }
    ]
  },
  lpa: {
    location: {
      about: "The New York Public Library for the Performing Arts houses one of the world's most extensive combinations of circulating, reference, and rare archival collections in its field. These materials are available free of charge, along with a wide range of special programs, including exhibitions, seminars, and performances. An essential resource for everyone with an interest in the arts—whether professional or amateur—the Library is known particularly for its prodigious collections of non-book materials such as historic recordings, videotapes, autograph manuscripts, correspondence, sheet music, stage designs, press clippings, programs, posters and photographs.",
      access: "Fully Accessible",
      accessibility_note: null,
      contacts: {
      phone: "(917) 275-6975",
      manager: {
      fn: null,
      title: null
      }
      },
      cross_street: "",
      geolocation: {
      type: "Point",
      coordinates: [
      -73.9848,
      40.7735
      ]
      },
      hours: {
      regular: [
      {
      day: "Sun",
      open: null,
      close: null
      },
      {
      day: "Mon",
      open: "12:00",
      close: "20:00"
      },
      {
      day: "Tue",
      open: "12:00",
      close: "18:00"
      },
      {
      day: "Wed",
      open: "12:00",
      close: "18:00"
      },
      {
      day: "Thu",
      open: "12:00",
      close: "20:00"
      },
      {
      day: "Fri",
      open: "12:00",
      close: "18:00"
      },
      {
      day: "Sat",
      open: "12:00",
      close: "18:00"
      }
      ]
      },
      id: "LPA",
      images: {
      exterior: "http://cdn-qa.www.aws.nypl.org/sites/default/files/images/locations/55/exterior_lpa-9747.jpg",
      interior: "http://cdn-qa.www.aws.nypl.org/sites/default/files/images/locations/55/interior_lpa-9855_0.jpg"
      },
      locality: "New York",
      name: "New York Public Library for the Performing Arts, Dorothy and Lewis B. Cullman Center",
      open: true,
      postal_code: "10023",
      region: "NY",
      slug: "lpa",
      type: "research",
      _embedded: {
        alerts: [
          {
          id: 283839,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283839"
          }
          },
          msg: "<p>The New York Public Library will be closed on Sunday, April 5.</p>",
          display: {
          start: "2015-04-01T00:00:00-04:00",
          end: "2015-04-06T00:00:00-04:00"
          }
          },
          {
          id: 283840,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283840"
          }
          },
          msg: "<p>The New York Public Library will be closed from May 23 through May 25 in observance of Memorial Day.</p>",
          display: {
          start: "2015-05-17T00:00:00-04:00",
          end: "2015-05-26T00:00:00-04:00"
          }
          },
          {
          id: 283846,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283846"
          }
          },
          msg: "<p>All units of the NYPL will be closed July 4.</p>",
          display: {
          start: "2015-06-27T00:00:00-04:00",
          end: "2015-07-05T00:00:00-04:00"
          }
          },
          {
          id: 283851,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283851"
          }
          },
          msg: "<p>The New York Public Library will be closed September 5th through September 7th in observance of Labor Day.</p>",
          display: {
          start: "2015-08-28T00:00:00-04:00",
          end: "2015-09-08T00:00:00-04:00"
          }
          },
          {
          id: 283892,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283892"
          }
          },
          msg: "<p>The New York Public Library will be closed on Monday, October 12 in observance of Columbus Day.</p>",
          display: {
          start: "2015-10-07T00:00:00-04:00",
          end: "2015-10-13T00:00:00-04:00"
          }
          },
          {
          id: 283893,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283893"
          }
          },
          msg: "<p>The New York Public Library will be closed on November 11 in observance of Veterans Day.</p>",
          display: {
          start: "2015-11-06T00:00:00-05:00",
          end: "2015-11-12T00:00:00-05:00"
          }
          },
          {
          id: 283894,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283894"
          }
          },
          msg: "<p>The New York Public Library will be closed on Thanksgiving Day, Thursday, November 26.</p>",
          display: {
          start: "2015-11-20T00:00:00-05:00",
          end: "2015-11-27T00:00:00-05:00"
          }
          },
          {
          id: 283895,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283895"
          }
          },
          msg: "<p>All NYPL locations will close at 5 PM on December 24 and will be closed on December 25.</p>",
          display: {
          start: "2015-12-17T00:00:00-05:00",
          end: "2015-12-26T00:00:00-05:00"
          }
          },
          {
          id: 283896,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283896"
          }
          },
          msg: "<p>All NYPL locations will close at 5 PM on December 31 and will be closed on January 1, 2015.</p>",
          display: {
          start: "2015-12-26T00:00:00-05:00",
          end: "2016-01-02T00:00:00-05:00"
          }
          },
          {
          id: 231361,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283896"
          }
          },
          msg: "<p>Daylight Test Alert",
          closed_for: "Closed for Daylight Savings",
          display: {
          start: "2015-02-15T00:00:00-05:00",
          end: "2016-01-02T00:00:00-05:00"
          },
          applies: {
          start: "2015-02-15T00:00:00-05:00",
          end: "2016-01-02T00:00:00-05:00"
          }
          }
        ]
      }
    } /* end location */
  }, /* end lpa */
  new_amsterdam: {
    location: {
      about: "Established in 1989, the New Amsterdam Branch is housed on the ground floor of an office building, one block west of City Hall. Although small in size, the library bustles with activity and people all day long. Fully wheelchair accessible, the branch offers collections, services, and programs for all ages.",
      access: "Fully Accessible",
      accessibility_note: null,
      contacts: {
      phone: "(212) 732-8186",
      manager: {
      fn: "Kimberly Spring",
      title: "Library Manager"
      }
      },
      cross_street: "between Broadway & Church St.",
      geolocation: {
      type: "Point",
      coordinates: [
      -74.0078,
      40.7134
      ]
      },
      hours: {
      regular: [
      {
      day: "Sun",
      open: null,
      close: null
      },
      {
      day: "Mon",
      open: "11:00",
      close: "19:00"
      },
      {
      day: "Tue",
      open: "10:00",
      close: "18:00"
      },
      {
      day: "Wed",
      open: "11:00",
      close: "19:00"
      },
      {
      day: "Thu",
      open: "10:00",
      close: "18:00"
      },
      {
      day: "Fri",
      open: "10:00",
      close: "17:00"
      },
      {
      day: "Sat",
      open: "10:00",
      close: "17:00"
      }
      ]
      },
      id: "LM",
      images: {
      exterior: "http://cdn-qa.www.aws.nypl.org/sites/default/files/images/locations/53/exterior_newamsterdam-7473.jpg",
      interior: "http://cdn-qa.www.aws.nypl.org/sites/default/files/images/locations/53/interior_newamsterdam-7474.jpg"
      },
      locality: "New York",
      name: "New Amsterdam Library",
      open: true,
      plan_your_visit: null,
      postal_code: "10007",
      region: "NY",
      slug: "new-amsterdam",
      street_address: "9 Murray Street",
      synonyms: [ ],
      type: "circulating",
      _embedded: {
        alerts: [
          {
          id: 283839,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283839"
          }
          },
          msg: "<p>The New York Public Library will be closed on Sunday, April 5.</p>",
          display: {
          start: "2015-04-01T00:00:00-04:00",
          end: "2015-04-06T00:00:00-04:00"
          }
          },
          {
          id: 283840,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283840"
          }
          },
          msg: "<p>The New York Public Library will be closed from May 23 through May 25 in observance of Memorial Day.</p>",
          display: {
          start: "2015-05-17T00:00:00-04:00",
          end: "2015-05-26T00:00:00-04:00"
          }
          },
          {
          id: 283846,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283846"
          }
          },
          msg: "<p>All units of the NYPL will be closed July 4.</p>",
          display: {
          start: "2015-06-27T00:00:00-04:00",
          end: "2015-07-05T00:00:00-04:00"
          }
          },
          {
          id: 283851,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283851"
          }
          },
          msg: "<p>The New York Public Library will be closed September 5th through September 7th in observance of Labor Day.</p>",
          display: {
          start: "2015-08-28T00:00:00-04:00",
          end: "2015-09-08T00:00:00-04:00"
          }
          },
          {
          id: 283892,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283892"
          }
          },
          msg: "<p>The New York Public Library will be closed on Monday, October 12 in observance of Columbus Day.</p>",
          display: {
          start: "2015-10-07T00:00:00-04:00",
          end: "2015-10-13T00:00:00-04:00"
          }
          },
          {
          id: 283893,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283893"
          }
          },
          msg: "<p>The New York Public Library will be closed on November 11 in observance of Veterans Day.</p>",
          display: {
          start: "2015-11-06T00:00:00-05:00",
          end: "2015-11-12T00:00:00-05:00"
          }
          },
          {
          id: 283894,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283894"
          }
          },
          msg: "<p>The New York Public Library will be closed on Thanksgiving Day, Thursday, November 26.</p>",
          display: {
          start: "2015-11-20T00:00:00-05:00",
          end: "2015-11-27T00:00:00-05:00"
          }
          },
          {
          id: 283895,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283895"
          }
          },
          msg: "<p>All NYPL locations will close at 5 PM on December 24 and will be closed on December 25.</p>",
          display: {
          start: "2015-12-17T00:00:00-05:00",
          end: "2015-12-26T00:00:00-05:00"
          }
          },
          {
          id: 283896,
          scope: "all",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283896"
          }
          },
          msg: "<p>All NYPL locations will close at 5 PM on December 31 and will be closed on January 1, 2015.</p>",
          display: {
          start: "2015-12-26T00:00:00-05:00",
          end: "2016-01-02T00:00:00-05:00"
          }
          },
          {
          id: 283896,
          scope: "location",
          _links: {
          web: {
          href: "http://qa.www.aws.nypl.org/node/283896"
          }
          },
          msg: "This branch will be closed for a few days for repairs",
          closed_for: "Closed for repairs",
          display: {
          start: "2015-02-12T00:00:00-05:00",
          end: "2016-01-02T00:00:00-05:00"
          },
          applies: {
          start: "2015-02-12T00:00:00-05:00",
          end: "2016-01-02T00:00:00-05:00"
          }
          }
        ]
      }
    }
  }
};

module.exports = response;