/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  good: {
    division: {
      _links: {
        "self": {
          "href": "divisions/general-research-division",
          "about": "http://nypl.org/about/divisions/general-research-division"
        },
        "blogs": {
          "href": "divisions/general-research-division/blogs",
          "all": "http://nypl.org/blog/library/394"
        },
        "events": {
          "href": "divisions/general-research-division/events",
          "all": "http://nypl.org/events/calendar?location=394"
        },
        "exhibitions": {
          "href": "divisions/general-research-division/exhibitions"
        },
        "on_shelves": {
          "href": "http://nypl.bibliocommons.com/search?custom_query=available%3A%22General+Research+Division%22&circ=CIRC|NON%20CIRC"
        },
        "contact": {
          "href": "http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?institution=13306&type=1&language=1"
        },
        "concierge": {
          "href": "http://www.nypl.org/ask-nypl/make-appointment-librarian"
        }
      },
      about: "The General Research Division serves as the central research hub in the Stephen A. Schwarzman Building. The division welcomes hundreds of visitors each day, including scholars, writers, graduate and undergraduate students, general readers, tourists, and those who might simply be looking for the answer to a nagging question. Our staff of librarians is on hand to help with research questions and to instruct patrons in navigating the Catalog and our numerous electronic databases.",
      access: "Fully Accessible",
      contacts: {
        phone: "(917) 275-6975",
        manager: "Marie Coughlin"
      },
      floor: "Third Floor",
      hours: {
        regular: [
          { day: "Sun", open: null, close: null },
          { day: "Mon", open: "10:00", close: "17:45" },
          { day: "Tue", open: "10:00", close: "19:45" },
          { day: "Wed", open: "10:00", close: "19:45" },
          { day: "Thu", open: "10:00", close: "17:45" },
          { day: "Fri", open: "10:00", close: "17:45" },
          { day: "Sat", open: "10:00", close: "17:45" }
        ],
        exceptions: {
          start: "2014-08-19T10:07:24-04:00",
          end: "2015-12-20T00:00:00-04:00",
          description: "The Rose Main Reading Room and the Bill Blass Public Catalog Room in the Stephen A. Schwarzman Building will be temporarily closed. More information is available on the updates page. General Research Division (GRD) onsite materials are still available for use in the Stephen A. Schwarzman Building. We encourage you to submit requests in advance of your visit via our online form. Otherwise, you may request GRD materials in Room 217 or in any of the Schwarzman Building’s other reading rooms. For offsite requests, please consult our Classic Catalog and submit your request for any item by clicking the gray Request From Off-Site Storage button in the catalog record. Materials will be available for pickup in Room 217."
        }
      },
      id: "GRD",
      images: {
        interior: "http://www.nypl.org/sites/default/files/images/stacks.jpeg",
        collection_item: "http://www.nypl.org/sites/default/files/images/stacks.jpeg"
      },
      location_id: "SASB",
      name: "General Research Division",
      open: true,
      plan_your_visit: null,
      rank: 1,
      room: "315",
      slug: "general-research-division",
      social_media: [
        {
          site: "facebook",
          href: "http://www.facebook.com/pages/General-Research-Division-The-New-York-Public-Library/105843439484043"
        },
        {
          site: "twitter",
          href: "http://twitter.com/NYPL_GRD"
        },
        {
          site: "foursquare",
          href: "http://foursquare.com/venue/31643"
        },
        {
          site: "youtube",
          href: "http://www.youtube.com/NewYorkPublicLibrary"
        }
      ],
      synonyms: [],
      type: "research",
      _embedded: {
        events: null,
        exhibitions: null,
        blogs: [
          {
            _id: 229670,
            title: "Godzilla: Monster, Metaphor, Pop Icon",
            body: "When many of us think of Godzilla, we think of awkward dubbing and a man in a rubber suit running around crushing model cities while occasionally fighting along side or against other monsters. My first exposure to Godzilla came from watching re-runs of the adorable yet absolutely cringe-worthy Hanna-Barbera animated series as a child. But Godzilla represents far more than the child-friendly hero of the cartoon I fondly remember. Godzilla is an international film icon and his appeal goes beyond audiences' appetite for destruction.",
            author: {
              name: "Jesse Ingoglia",
              position: null,
              location: "General Research Division"
            },
            pubdate: "2014-05-21T18:11:49Z",
            image: "http://upload.wikimedia.org/wikipedia/commons/9/95/Gojira_1954_Japanese_poster.jpg",
            _links: {
              self: {
                href: "blog/2014/05/21/godzilla"
              }
            }
          },
          {
            _id: 231769,
            title: "Avant-Garde Periodicals Meet Digital Archives",
            body: "As curator for small press materials I was excited to attend \"Remediating the Avant Garde: Magazines and Digital Archives,\" a symposium at Princeton University, home of the Blue Mountain Project.",
            author: {
              name: "Karen Gisonny",
              position: null,
              location: "Stephen A. Schwarzman Building, Collection Strategy"
            },
            pubdate: "2014-04-17T16:19:54Z",
            image: "https://www.nypl.org/sites/default/files/little.jpg",
            _links: {
              self: {
                href: "blog/2014/04/17/magazines-digital-archives"
              }
            }
          },
          {
            _id: 244282,
            title: "The Time Machine: Reading List 2013",
            body: "Some years ago, while considering ideas for my next blog post, I thought I might compile a list of the books I had read during the previous year not only to keep a record for myself (tending, as I do, to forget things), but to share my bookish enthusiasms and perhaps offer a few recommendations to anyone who might be interested. Then, before I knew it, another list came along, and then another, and now, in what seems the blink of an eye, it is four years later, and I am putting together yet another list of books read during the improbable year just passed.",
            author: {
              name: "Robert Armitage",
              position: null,
              location: "Stephen A. Schwarzman Building, Gen. Research Division"
            },
            pubdate: "2014-02-13T16:43:04Z",
            image: "https://www.nypl.org/sites/default/files/time%20machine3.png",
            _links: {
              self: {
                href: "blog/2014/02/13/time-machine-reading-list-2013"
              }
            }
          },
          {
            _id: 239098,
            title: "NYPL Receives Grant for Amateur Periodical Collection",
            body: "New York Public Library has received a three-year grant from the Aeroflex Foundation and Hippocampus Press to process one of its hidden gems, the General Research Division's Amateur Periodical Collection. The grant will allow this significant collection to be catalogued for the first time, which will provide greater access as well as help identify items for digitization in the future.",
            author: {
              name: "Karen Gisonny",
              position: null,
              location: "Stephen A. Schwarzman Building, Collection Strategy"
            },
            pubdate: "2013-12-19T08:03:24Z",
            image: null,
            _links: {
              self: {
                href: "blog/2013/12/19/amateur-periodical-collection-grant"
              }
            }
          },
          {
            _id: 232331,
            title: "Edith Wharton, A Writing Life: Marriage",
            body: "In a writer's life, nothing is ever wasted. Every wrinkle in the fabric of experience can be transformed into fictional material. Although there is nothing directly autobiographical in the novels and stories of American novelist Edith Wharton (born Edith Jones), they reflect very distinctly both the shape of her life and the movements of her thought.",
            author: {
              name: "Robert Armitage",
              position: null,
              location: "Stephen A. Schwarzman Building, Gen. Research Division"
            },
            pubdate: "2013-11-08T08:03:20Z",
            image: "http://images.nypl.org/?id=102809%20&t=w",
            _links: {
              self: {
                href: "blog/2013/11/08/edith-wharton-writing-life-marriage"
              }
            }
          },
          {
            _id: 226103,
            title: "Classroom Connections: 'Grace Aguilar's American Journey,' A Common Core-aligned Research Experience (Gr. 11-12)",
            body: "By 1900, New York City and the United States were undergoing waves of dramatic, traumatic change. Industrialization, Reconstruction and a surge of immigrants from across the globe were remaking every aspect of life, from transportation to education, leisure, labor, race relations and the status of women. One response to the dislocations and turmoil of this era was the reform efforts that we now classify as the Progressive Movement.",
            author: {
              name: "Danielle Lewis",
              position: null,
              location: "Education Innovation Institute Fellow"
            },
            pubdate: "2013-09-18T16:12:51Z",
            image: "http://images.nypl.org/?id=494572&t=w",
            _links: {
              self: {
                href: "blog/2013/09/18/classroom-connections-grace-aguilar"
              }
            }
          }
        ],
        features: null,
        alerts: [
          {
            _id: "71579",
            _links: {
              self: {
                href: "node/71579"
              }
            },
            scope: "all",
            title: "Labor Day",
            body: "The New York Public Library will be closed August 30th through September 1st in observance of Labor Day.",
            start: "2014-08-23T00:00:00-04:00",
            end: "2014-09-02T01:00:00-04:00"
          },
          {
            _id: "71581",
            _links: {
              self: {
                href: "node/71581"
              }
            },
            scope: "all",
            title: "Columbus Day",
            body: "The New York Public Library will be closed on Monday, October 13 in observance of Columbus Day.",
            start: "2014-10-06T00:00:00-04:00",
            end: "2014-10-14T01:00:00-04:00"
          },
          {
            _id: "71582",
            _links: {
              self: {
                href: "node/71582"
              }
            },
            scope: "all",
            title: "Veterans Day",
            body: "The New York Public Library will be closed on November 11 in observance of Veterans Day.",
            start: "2014-11-04T00:00:00-05:00",
            end: "2014-11-12T01:00:00-05:00"
          },
          {
            _id: "71583",
            _links: {
              self: {
                href: "node/71583"
              }
            },
            scope: "all",
            title: "Thanksgiving Day",
            body: "The New York Public Library will be closed on Thanksgiving Day, Thursday, November 27.",
            start: "2014-11-20T00:00:00-05:00",
            end: "2014-11-28T01:00:00-05:00"
          },
          {
            _id: "71584",
            _links: {
              self: {
                href: "node/71584"
              }
            },
            scope: "all",
            title: "Christmas",
            body: "All NYPL locations will close at 5 PM on December 24 and will be closed on December 25.",
            start: "2014-12-17T00:00:00-05:00",
            end: "2014-12-26T23:59:00-05:00"
          }
        ],
        divisions: [
          {
            name: "DeWitt Wallace Periodical Room",
            access: "Fully Accessible",
            rank: 2,
            floor: "First Floor",
            room: "108",
            slug: "periodicals-room",
            synonyms: [ ],
            contacts: {
              phone: "(212) 930-0971"
            },
            _links: {
              self: {
              href: "http://locations-api-alpha.herokuapp.com/divisions/periodicals-room",
              about: "http://nypl.org/about/divisions/general-research-division/periodicals-room"
              },
              blogs: {
              href: "http://locations-api-alpha.herokuapp.com/divisions/periodicals-room/blogs",
              all: "http://nypl.org/blog/library/173"
              },
              events: {
              href: "http://locations-api-alpha.herokuapp.com/divisions/periodicals-room/events",
              all: "http://nypl.org/events/calendar?location=173"
              },
              exhibitions: {
              href: "http://locations-api-alpha.herokuapp.com/divisions/periodicals-room/exhibitions"
              },
              alerts: {
              href: "http://locations-api-alpha.herokuapp.com/divisions/periodicals-room/alerts"
              },
              on_shelves: {
              href: "http://nypl.bibliocommons.com/search?custom_query=available%3A%22Periodicals+Room%22&circ=CIRC|NON%20CIRC"
              },
              contact: {
              href: "http://www.nypl.org/locations/tid/36/node/173382"
              },
              concierge: {
              href: "http://www.nypl.org/ask-nypl/make-appointment-librarian"
              }
            },
            about: "The DeWitt Wallace Periodical Room 108 services current unbound issues of 68 popular periodical titles and 22 domestic and foreign newspapers. For a full list of the popular titles in Room 108, see here. You can also view new titles on our Pinterest page! The majority of the current periodicals collection is available in Room 100, the Microforms Reading Room. The Periodicals Room is Wi-Fi enabled.",
            hours: {
            regular: [
              { day: "Sun", open: null, close: null },
              { day: "Mon", open: "10:00", close: "17:45" },
              { day: "Tue", open: "10:00", close: "19:45" },
              { day: "Wed", open: "10:00", close: "19:45" },
              { day: "Thu", open: "10:00", close: "17:45" },
              { day: "Fri", open: "10:00", close: "17:45" },
              { day: "Sat", open: "10:00", close: "17:45" }
            ]
            },
            open: true,
            images: {
              interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/Zine_World.jpg"
            },
            plan_your_visit: null,
            id: "PER"
          }
        ],
        location: {
          name: "Stephen A. Schwarzman Building",
          street_address: "Fifth Avenue at 42nd Street",
          cross_street: "",
          locality: "New York",
          region: "NY",
          access: "Fully Accessible",
          postal_code: 10018,
          type: "research",
          slug: "schwarzman",
          geolocation: {
            type: "Point",
            coordinates: [
            -73.9822,
            40.7532
            ]
          },
          synonyms: [ ],
          contacts: {
            phone: "(917) 275-6975"
          },
          _links: {
            self: {
            href: "http://locations-api-alpha.herokuapp.com/locations/schwarzman",
            about: "http://nypl.org/about/locations/schwarzman"
            },
            blogs: {
            href: "http://locations-api-alpha.herokuapp.com/locations/schwarzman/blogs",
            all: "http://nypl.org/blog/library/36"
            },
            events: {
            href: "http://locations-api-alpha.herokuapp.com/locations/schwarzman/events",
            all: "http://nypl.org/events/calendar?location=36"
            },
            exhibitions: {
            href: "http://locations-api-alpha.herokuapp.com/locations/schwarzman/exhibitions"
            },
            alerts: {
            href: "http://locations-api-alpha.herokuapp.com/locations/schwarzman/alerts"
            },
            on_shelves: {
            href: "http://nypl.bibliocommons.com/search?custom_query=available%3A%22Stephen+A.+Schwarzman+Building%22&circ=CIRC|NON%20CIRC"
            },
            amenities: {
            href: "http://locations-api-alpha.herokuapp.com/locations/schwarzman/amenities"
            },
            contact: {
            href: "http://www.nypl.org/locations/tid/36/node/126488"
            },
            concierge: {
            href: "http://www.nypl.org/ask-nypl/make-appointment-sasb"
            }
          },
          about: "Stephen A. Schwarzman Building Fun Facts Built on the site of the old Croton Reservoir Cornerstone laid: November 10, 1902 (weight 7.5 tons) Cornerstone holds a relic box containing contracts between New York City and the Library, photographs, newspapers, and letters from the Trustees and Mayor of New York. Some stones from the reservoir were used to construct the original foundation and can now be seen from the lower levels of the South Court building. The building at Fifth Avenue and 42nd Street (now named the Humanities & Social Sciences Library) was dedicated by President William Howard Taft on May 23, 1911, and opened to the public at 9:00 a.m. on May 24, 1911. More than 50,000 people visited. The library was open for 13 hours until 10:00 p.m. The floor plan was sketched on a postcard in 1897 by John Shaw Billings, The New York Public Library's first director. As the postcard shows, both the northern and southern courtyards were in place from the start. John...",
          social_media: [
            {
            site: "foursquare",
            href: "http://foursquare.com/venue/31643"
            },
            {
            site: "youtube",
            href: "http://www.youtube.com/NewYorkPublicLibrary"
            }
          ],
          hours: {
            regular: [
              { day: "Sun", open: "13:00", close: "17:00" },
              { day: "Mon", open: "10:00", close: "18:00" },
              { day: "Tue", open: "10:00", close: "20:00" },
              { day: "Wed", open: "10:00", close: "20:00" },
              { day: "Thu", open: "10:00", close: "18:00" },
              { day: "Fri", open: "10:00", close: "18:00" },
              { day: "Sat", open: "10:00", close: "18:00" }
            ],
            exceptions: {
              start: "2014-10-16T12:16:03-04:00",
              end: "2014-10-17T00:00:00-04:00",
              description: "<p>The Rose Main Reading Room and the Bill Blass Public Catalog Room in the Stephen A. Schwarzman Building will be temporarily closed. <a href=\"http://www.nypl.org/readingroomupdate\">More information is available on the updates page.<a/></p> <p>General Research Division (GRD) onsite materials are still available for use in the Stephen A. Schwarzman Building. We encourage you to submit requests in advance of your visit via our <a href=\"http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm;jsessionid=7B8D22D69482BCDDAE43913EA5B374C3?&institution=13777&type=1&language=1&qphost=qpap01pxdu.prod.oclc.org&\">online form</a>.</p> <p>Otherwise, you may request GRD materials in Room 217 or in any of the Schwarzman Building’s other reading rooms.</p> <p>For offsite requests, please consult our <a href=\"http://catalog.nypl.org/\">Classic Catalog</a> and submit your request for any item by clicking the gray Request From Off-Site Storage button in the catalog record. Materials will be available for pickup in Room 217.</p> <p>Laptop computers are available for use in place of our desktop computers. If you prefer to use desktops, you can visit the Mid-Manhattan Library across Fifth Avenue at the corner of 40th Street.</p>"
              }
          },
          open: true,
          images: {
            exterior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/36/exterior_sasb2_0.jpg",
            interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/36/interior_sasb_reading_room.jpg"
          },
          plan_your_visit: [
            {
            label: "Plan Your Research Visit",
            url: "http://www.nypl.org/about/locations/plan-your-research-visit"
            },
            {
            label: "Using the Library",
            url: "http://www.nypl.org/about/locations/using-the-library"
            },
            {
            label: "Space Rental",
            url: "http://www.nypl.org/spacerental/event-spaces/schwarzman"
            },
            {
            label: "Building Tours",
            url: "http://www.nypl.org/events/tours/schwarzman"
            },
            {
            label: "Test PYV2",
            url: "http://nypl.org/about/locations/115th-street"
            }
          ],
          fundraising: null,
          id: "SASB"
        }
      }
    }
  },
  bad: {
    division: {
      _links: {},
      about: "",
      access: "Fully Accessible",
      contacts: {
        phone: "(917) 275-6975"
      },
      floor: "Third Floor",
      hours: {
        regular: [
          { day: "Sun", open: null, close: null },
          { day: "Mon", open: "10:00", close: "17:45" },
          { day: "Tue", open: "10:00", close: "19:45" },
          { day: "Wed", open: "10:00", close: "19:45" },
          { day: "Thu", open: "10:00", close: "17:45" },
          { day: "Fri", open: "10:00", close: "17:45" },
          { day: "Sat", open: "10:00", close: "17:45" }
        ]
      },
      id: "GRD",
      images: {
        interior: "http://www.nypl.org/sites/default/files/images/stacks.jpeg",
        collection_item: "http://www.nypl.org/sites/default/files/images/stacks.jpeg"
      },
      location_id: "SASB",
      name: "General Research Division",
      open: true,
      plan_your_visit: null,
      rank: 1,
      room: "315",
      slug: "general-research-division",
      social_media: [],
      synonyms: [],
      type: "research",
      _embedded: {
        events: null,
        exhibitions: null,
        blogs: null,
        features: null,
        alerts: null,
        divisions: null,
        location: null
      }
    }
  }
}

module.exports = response;
