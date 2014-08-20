/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  good: {
    amenities: {
      "amenities": [
        {
          "weight": 0,
          "name": "Computer Services",
          "amenities": [
            {
              "_id": 7950,
              "_links": {
                "self": {
                  "href": "amenities/7950"
                },
                "info": {
                  "href": "help/computers-internet-and-wireless-access/reserving-computer"
                },
                "action": {
                  "name": "Reserce a PC",
                  "href": "http://pcreserve.nypl.org/"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Computer Services",
              "id": 7950,
              "location_rank": 2,
              "name": "Computers for Public Use",
              "rank": 1,
              "staff_assistance": null
            },
            {
              "_id": 7952,
              "_links": {
                "self": {
                  "href": "amenities/7952"
                },
                "info": {
                  "href": "help/computers-internet-and-wireless-access/wireless-internet-access"
                },
                "action": {
                  "name": null,
                  "href": null
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Computer Services",
              "id": 7952,
              "location_rank": 5,
              "name": "Wireless Internet Access",
              "rank": 4,
              "staff_assistance": null
            },
            {
              "_id": 7953,
              "_links": {
                "self": {
                  "href": "amenities/7953"
                },
                "info": {
                  "href": "help/computers-internet-and-wireless-access/reserving-computer"
                },
                "action": {
                  "name": "Reserve a Laptop",
                  "href": "http://pcreserve.nypl.org/"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Computer Services",
              "id": 7953,
              "location_rank": 3,
              "name": "Laptops for Public Use",
              "rank": 2,
              "staff_assistance": null
            },
            {
              "_id": 7954,
              "_links": {
                "self": {
                  "href": "amenities/7954"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Computer Services",
              "id": 7954,
              "location_rank": 4,
              "name": "Printing (from PC)",
              "rank": 3,
              "staff_assistance": null
            },
            {
              "_id": 7955,
              "_links": {
                "self": {
                  "href": "amenities/7955"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Computer Services",
              "id": 7955,
              "location_rank": 6,
              "name": "Electric outlets available",
              "rank": 5,
              "staff_assistance": null
            }
          ]
        },
        {
          "weight": 1,
          "name": "Circulation",
          "amenities": [
            {
              "_id": 7956,
              "_links": {
                "self": {
                  "href": "amenities/7956"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Circulation",
              "id": 7956,
              "location_rank": 13,
              "name": "Inter-Library Loan",
              "rank": 6,
              "staff_assistance": null
            },
            {
              "_id": 7957,
              "_links": {
                "self": {
                  "href": "amenities/7957"
                },
                "info": {
                  "href": "help/borrowing-materials"
                },
                "action": {
                  "name": null,
                  "href": null
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Circulation",
              "id": 7957,
              "location_rank": 9,
              "name": "Self-service check-out",
              "rank": 7,
              "staff_assistance": null
            },
            {
              "_id": 7951,
              "_links": {
                "self": {
                  "href": "amenities/7951"
                },
                "info": {
                  "href": "help/borrowing-materials/book-drops"
                },
                "action": {
                  "name": null,
                  "href": null
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Circulation",
              "id": 7951,
              "location_rank": 2,
              "name": "Book drop box (24 hour)",
              "rank": 8,
              "staff_assistance": null
            },
            {
              "_id": 7958,
              "_links": {
                "self": {
                  "href": "amenities/7958"
                },
                "info": {
                  "href": "help/borrowing-materials/book-drops"
                },
                "action": {
                  "name": null,
                  "href": null
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Circulation",
              "id": 7958,
              "location_rank": 1,
              "name": "Book drop box (limited hours)",
              "rank": 9,
              "staff_assistance": null
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Books in Braille"
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Talking Books"
            }
          ]
        },
        {
          "weight": 2,
          "name": "Office Services",
          "amenities": [
            {
              "_id": 7961,
              "_links": {
                "self": {
                  "href": "amenities/7961"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Office Services",
              "id": 7961,
              "location_rank": 10,
              "name": "Photocopiers (black/white)",
              "rank": 12,
              "staff_assistance": null
            },
            {
              "_id": 7964,
              "_links": {
                "self": {
                  "href": "amenities/7964"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Office Services",
              "id": 7964,
              "location_rank": 11,
              "name": "Map photocopiers (up to 36\" wide)",
              "rank": 15,
              "staff_assistance": null
            },
            {
              "_id": 7979,
              "_links": {
                "self": {
                  "href": "amenities/7979"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Assistive Technologies",
              "id": 7979,
              "location_rank": 17,
              "name": "Scanner/Reading Machines",
              "rank": 30,
              "staff_assistance": null
            },
            {
              "_id": 7964,
              "_links": {
                "self": {
                  "href": "amenities/7964"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Office Services",
              "id": 7964,
              "location_rank": 11,
              "name": "Map photocopiers (up to 36\" wide)",
              "rank": 15,
              "staff_assistance": null
            },
            {
              "_id": 7965,
              "_links": {
                "self": {
                  "href": "amenities/7965"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Office Services",
              "id": 7965,
              "location_rank": 12,
              "name": "Change machine",
              "rank": 16,
              "staff_assistance": null
            }
          ]
        },
        {
          "weight": 3,
          "name": "Facilities",
          "amenities": [
            {
              "_id": 7966,
              "_links": {
                "self": {
                  "href": "amenities/7966"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Facilities",
              "id": 7966,
              "location_rank": 5,
              "name": "Public Restrooms",
              "rank": 17,
              "staff_assistance": null
            },
            {
              "_id": 7967,
              "_links": {
                "self": {
                  "href": "amenities/7967"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Facilities",
              "id": 7967,
              "location_rank": 6,
              "name": "Children's Only Restrooms",
              "rank": 18,
              "staff_assistance": null
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Research Study Rooms"
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Parking"
            },
            {
              "_id": 7970,
              "_links": {
                "self": {
                  "href": "amenities/7970"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Facilities",
              "id": 7970,
              "location_rank": 12,
              "name": "Lost and found",
              "rank": 21,
              "staff_assistance": null
            },
            {
              "_id": 7971,
              "_links": {
                "self": {
                  "href": "amenities/7971"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Facilities",
              "id": 7971,
              "location_rank": 6,
              "name": "Bicycle Rack",
              "rank": 22,
              "staff_assistance": null
            },
          ]
        },
        {
          "weight": 4,
          "name": "Assistive Technologies",
          "amenities": [
            {
              "_id": 7976,
              "_links": {
                "self": {
                  "href": "amenities/7976"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Assistive Technologies",
              "id": 7976,
              "location_rank": 9,
              "name": "Screen magnification software (MAGic)",
              "rank": 27,
              "staff_assistance": null
            },
            {
              "_id": 7977,
              "_links": {
                "self": {
                  "href": "amenities/7977"
                }
              },
              "accessibility_note": null,
              "accessible": true,
              "category": "Assistive Technologies",
              "id": 7977,
              "location_rank": 10,
              "name": "Screen reading software (JAWS)",
              "rank": 28,
              "staff_assistance": null
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Closed-Circuit Television Enlargers (CCTVs)"
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Scanner/reading Rooms"
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Brailler Translation Software"
            },
            {
              "_id":62183,
              "_links": {
                "self": {
                  "href":"amenities/6"
                }
              },
              "id":62183,
              "name":"Braille Embossing"
            }
          ]
        }
      ]
    }
  }
}

module.exports = response;

