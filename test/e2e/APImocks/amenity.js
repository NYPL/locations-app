/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  good: {
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
      rank: 1,
      _embedded: {
        locations: [
          { 
            name: "58th Street Library",
            slug: "58th-street"
          },
          {
            name: "67th Street Library",
            slug: "67th-street"
          },
          {
            name: "96th Street Library",
            slug: "96th-street"
          },
          {
            name: "115th Street Library",
            slug: "115th-street"
          },
          {
            name: "125th Street Library",
            slug: "125th-street"
          }
        ]
      }
    }
  },
  bad: {
  }
}

module.exports = response;

