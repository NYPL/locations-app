/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  good: {
    location: {
      id: "Gc",
      name: "Grand Central Library",
      slug: "grand-central",
      _embedded: {
        amenities: [
          {
            location_rank: 1,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7964"
              },
              info: {
              href: "http://www.nypl.org/help/computers-internet-and-wireless-access/reserving-computer"
              },
              action: {
              name: "Reserve a PC",
              href: "http://www.nypl.org/help/computers-internet-and-wireless-access/reserving-computer"
              }
              },
              category: "Computer Services",
              id: 7964,
              name: "Computers for Public Use",
              rank: 1
            }
          },
          {
            location_rank: 2,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7965"
              }
              },
              category: "Computer Services",
              id: 7965,
              name: "Laptops for Public Use",
              rank: 20
            }
          },
          {
            location_rank: 3,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7966"
              }
              },
              category: "Computer Services",
              id: 7966,
              name: "Printing (from PC)",
              rank: 11
            }
          },
          {
            location_rank: 4,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7967"
              },
              info: {
              href: "http://www.nypl.org/help/computers-internet-and-wireless-access/wireless-internet-access"
              },
              action: {
              name: null,
              href: "http://www.nypl.org/help/computers-internet-and-wireless-access/wireless-internet-access"
              }
              },
              category: "Computer Services",
              id: 7967,
              name: "Wireless Internet Access",
              rank: 2
            }
          },
          {
            location_rank: 5,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7968"
              }
              },
              category: "Computer Services",
              id: 7968,
              name: "Electric outlets available",
              rank: 33
            }
          },
          {
            location_rank: 6,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7969"
              },
              info: {
              href: "http://www.nypl.org/help/research-services/interlibrary-loan"
              },
              action: {
              name: null,
              href: "http://www.nypl.org/help/research-services/interlibrary-loan"
              }
              },
              category: "Circulation",
              id: 7969,
              name: "Inter-Library Loan",
              rank: 16
            }
          },
          {
            location_rank: 7,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7970"
              }
              },
              category: "Circulation",
              id: 7970,
              name: "Self-service check-out",
              rank: 4
            }
          },
          {
            location_rank: 8,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7972"
              }
              },
              category: "Circulation",
              id: 7972,
              name: "Book drop box (limited hours)",
              rank: 21
            }
          },
          {
            location_rank: 9,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7975"
              }
              },
              category: "Printing and Copy Services",
              id: 7975,
              name: "Photocopiers (black/white)",
              rank: 5
            }
          },
          {
            location_rank: 10,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7976"
              }
              },
              category: "Printing and Copy Services",
              id: 7976,
              name: "Photocopiers (color)",
              rank: 6
            }
          },
          {
            location_rank: 11,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7980"
              }
              },
              category: "Facilities",
              id: 7980,
              name: "Public Restrooms",
              rank: 14
            }
          },
          {
            location_rank: 12,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7984"
              }
              },
              category: "Facilities",
              id: 7984,
              name: "Lost and found",
              rank: 28
            }
          },
          {
            location_rank: 13,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
              _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/amenities/7989"
              }
              },
              category: "Facilities",
              id: 7989,
              name: "Water fountain",
              rank: 13
            }
          }
        ]
      }
    }
  },
  bad: {
  }
}

module.exports = response;

