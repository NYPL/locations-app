/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  good: {
    amenities: [
      {
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
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7965"
        }
        },
        category: "Computer Services",
        id: 7965,
        name: "Laptops for Public Use",
        rank: 2
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7966"
        }
        },
        category: "Computer Services",
        id: 7966,
        name: "Printing (from PC)",
        rank: 3
      },
      {
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
        rank: 4
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7968"
        }
        },
        category: "Computer Services",
        id: 7968,
        name: "Electric outlets available",
        rank: 5
      },
      {
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
        rank: 6
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7970"
        }
        },
        category: "Circulation",
        id: 7970,
        name: "Self-service check-out",
        rank: 7
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7971"
        }
        },
        category: "Circulation",
        id: 7971,
        name: "Book drop box (24 hour)",
        rank: 8
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7972"
        }
        },
        category: "Circulation",
        id: 7972,
        name: "Book drop box (limited hours)",
        rank: 9
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7973"
        }
        },
        category: "Circulation",
        id: 7973,
        name: "Books in braille",
        rank: 10
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7974"
        },
        info: {
        href: "http://www.nypl.org/about/locations/heiskell/digital-player"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/about/locations/heiskell/digital-player"
        }
        },
        category: "Circulation",
        id: 7974,
        name: "Talking books",
        rank: 11
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7975"
        }
        },
        category: "Printing and Copy Services",
        id: 7975,
        name: "Photocopiers (black/white)",
        rank: 12
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7976"
        }
        },
        category: "Printing and Copy Services",
        id: 7976,
        name: "Photocopiers (color)",
        rank: 13
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7977"
        }
        },
        category: "Printing and Copy Services",
        id: 7977,
        name: "Scanners",
        rank: 14
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7978"
        }
        },
        category: "Printing and Copy Services",
        id: 7978,
        name: "Map photocopiers (up to 36\" wide)",
        rank: 15
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7979"
        }
        },
        category: "Printing and Copy Services",
        id: 7979,
        name: "Change machine",
        rank: 16
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7980"
        }
        },
        category: "Facilities",
        id: 7980,
        name: "Public Restrooms",
        rank: 17
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7981"
        }
        },
        category: "Facilities",
        id: 7981,
        name: "Children's Only Restrooms",
        rank: 18
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7982"
        }
        },
        category: "Facilities",
        id: 7982,
        name: "Research Study Rooms",
        rank: 19
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7983"
        }
        },
        category: "Facilities",
        id: 7983,
        name: "Parking",
        rank: 20
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7984"
        }
        },
        category: "Facilities",
        id: 7984,
        name: "Lost and found",
        rank: 21
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7985"
        }
        },
        category: "Facilities",
        id: 7985,
        name: "Bicycle Rack",
        rank: 22
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7986"
        }
        },
        category: "Facilities",
        id: 7986,
        name: "Checkroom Service",
        rank: 23
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7987"
        }
        },
        category: "Facilities",
        id: 7987,
        name: "Payphones",
        rank: 24
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7988"
        }
        },
        category: "Facilities",
        id: 7988,
        name: "Changing station",
        rank: 25
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7989"
        }
        },
        category: "Facilities",
        id: 7989,
        name: "Water fountain",
        rank: 26
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7990"
        },
        info: {
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/software"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/software"
        }
        },
        category: "Assistive Technologies",
        id: 7990,
        name: "Screen magnification software (MAGic)",
        rank: 27
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7991"
        },
        info: {
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/software"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/software"
        }
        },
        category: "Assistive Technologies",
        id: 7991,
        name: "Screen reading software (JAWS)",
        rank: 28
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7992"
        },
        info: {
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        }
        },
        category: "Assistive Technologies",
        id: 7992,
        name: "Closed-Circuit Television Enlargers (CCTVs)",
        rank: 29
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7993"
        }
        },
        category: "Assistive Technologies",
        id: 7993,
        name: "Scanner/Reading Machines",
        rank: 30
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7994"
        }
        },
        category: "Assistive Technologies",
        id: 7994,
        name: "Braille translation software",
        rank: 31
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7995"
        }
        },
        category: "Assistive Technologies",
        id: 7995,
        name: "Braille embossing",
        rank: 32
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7996"
        }
        },
        category: "Assistive Technologies",
        id: 7996,
        name: "Refreshable braille display",
        rank: 33
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7997"
        }
        },
        category: "Assistive Technologies",
        id: 7997,
        name: "Adjustable height tables",
        rank: 34
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7998"
        },
        info: {
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        }
        },
        category: "Assistive Technologies",
        id: 7998,
        name: "Braille writers",
        rank: 35
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/7999"
        },
        info: {
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        }
        },
        category: "Assistive Technologies",
        id: 7999,
        name: "Assistive Amplification Systems",
        rank: 36
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/8000"
        }
        },
        category: "Assistive Technologies",
        id: 8000,
        name: "Telecommunications Devices for the Deaf (TTYs)",
        rank: 37
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/8001"
        }
        },
        category: "Assistive Technologies",
        id: 8001,
        name: "VRS (Video Relay Service)",
        rank: 38
      },
      {
        _links: {
        self: {
        href: "http://locations-api-alpha.herokuapp.com/amenities/8004"
        },
        info: {
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        },
        action: {
        name: null,
        href: "http://www.nypl.org/help/community-outreach/services-for-persons-with-disabilities/assistive-technologies/other-assistive-technologies"
        }
        },
        category: "Assistive Technologies",
        id: 8004,
        name: "Personal Reading Machines",
        rank: 39
      }
    ]
  },
  bad: {
    amenities: {

    }
  }
}

module.exports = response;

