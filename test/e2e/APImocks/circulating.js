/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  bad: {
    location: {
      "_links": {},
      "about": "",
      "access": "Fully Accessible",
      "contacts": {
        "phone": "(212) 621-0670",
        "manager": "Genoveve Stowell"
      },
      "cross_street": null,
      "floor": null,
      "geolocation": {
        "type": "Point",
        "coordinates": [
          -73.974,
          40.7539
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
        ],
        "exceptions": {}
      },
      "id": "GC",
      "image": "/sites/default/files/images/grand_central.jpg",
      "lat": null,
      "locality": "New York",
      "long": null,
      "name": "Grand Central Library",
      "postal_code": 10017,
      "region": "NY",
      "room": null,
      "slug": "grand-central",
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
  },
  good: {
    location: {
      _links: {
        self: {
        href: "http://locations-api-beta.nypl.org/locations/grand-central",
        about: "http://www.nypl.org/about/locations/grand-central"
        },
        blogs: {
        href: "http://locations-api-beta.nypl.org/locations/grand-central/blogs",
        all: "http://www.nypl.org/blog/library/871"
        },
        events: {
        href: "http://locations-api-beta.nypl.org/locations/grand-central/events",
        all: "http://www.nypl.org/events/calendar?location=871"
        },
        exhibitions: {
        href: "http://locations-api-beta.nypl.org/locations/grand-central/exhibitions"
        },
        alerts: {
        href: "http://locations-api-beta.nypl.org/locations/grand-central/alerts"
        },
        on_shelves: {
        href: "http://nypl.bibliocommons.com/search?custom_query=available%3A%22Grand+Central%22&circ=CIRC|NON%20CIRC"
        },
        amenities: {
        href: "http://locations-api-beta.nypl.org/locations/grand-central/amenities"
        },
        contact: {
        href: "http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=10208&type=1&language=1"
        }
      },
      about: "The Grand Central Branch is conveniently situated for commuters and area workers as well as families living to the east. Boasting 45 computers, 32 of which are laptops, there are outlets and data ports located at the bar-height seating looking out on 46th street. Follow Grand Central on Twitter @GrandCentralLib and Facebook, and Teen Central on Twitter @TnCntrl and on Facebook.", 
      access: "Fully Accessible",
      accessibility_note: null,
      contacts: {
        phone: "(212) 621-0670",
        manager: "Genoveve Stowell"
      },
      cross_street: "between Lexington &amp; Third Aves.",
      fundraising: {
        _id: 275290,
        statement: "Friends of the Library can support their favorite library and receive great benefits!",
        appeal: "Become a Member",
        button_label: "Join or Renew",
        link: "https://secure3.convio.net/nypl/site/SPageServer?pagename=branch_friend_form&s_src=FRQ15ZZ_CADN"
      },
      geolocation: {
        type: "Point",
        coordinates: [
          -73.974,
          40.7539
        ]
      },
      hours: {
        regular: [
          { day: "Sun", open: null, close: null },
          { day: "Mon", open: "11:00", close: "19:00" },
          { day: "Tue", open: "10:00", close: "18:00" },
          { day: "Wed", open: "11:00", close: "18:00" },
          { day: "Thu", open: "11:00", close: "18:00" },
          { day: "Fri", open: "11:00", close: "18:00" },
          { day: "Sat", open: "10:00", close: "17:00" }
        ]
      },
      id: "GC", 
      images: {
        exterior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/871/exterior_grand_central-5512_0.jpg",
        interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/871/interior_grand_central_7762.jpg"
      },
      locality: "New York",
      name: "Grand Central Library",
      open: true,
      plan_your_visit: null,
      postal_code: 10017,
      region: "NY",
      slug: "grand-central",
      social_media: [
        {
        site: "facebook",
        href: "https://www.facebook.com/pages/Grand-Central-Library/145759075487536"
        },
        {
        site: "twitter",
        href: "http://twitter.com/GrandCentralLib"
        },
        {
        site: "foursquare",
        href: "http://foursquare.com/venue/231626"
        },
        {
        site: "youtube",
        href: "http://www.youtube.com/NewYorkPublicLibrary"
        }
      ],
      street_address: "135 East 46th Street",
      synonyms: [ ],
      type: "circulating",
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
          href: "http://locations-api-beta.nypl.org/amenities/7964"
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
          href: "http://locations-api-beta.nypl.org/amenities/7965"
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
          href: "http://locations-api-beta.nypl.org/amenities/7966"
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
          href: "http://locations-api-beta.nypl.org/amenities/7967"
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
          href: "http://locations-api-beta.nypl.org/amenities/7968"
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
          href: "http://locations-api-beta.nypl.org/amenities/7969"
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
          href: "http://locations-api-beta.nypl.org/amenities/7970"
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
          href: "http://locations-api-beta.nypl.org/amenities/7972"
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
          href: "http://locations-api-beta.nypl.org/amenities/7975"
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
          href: "http://locations-api-beta.nypl.org/amenities/7976"
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
          href: "http://locations-api-beta.nypl.org/amenities/7980"
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
          href: "http://locations-api-beta.nypl.org/amenities/7984"
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
          href: "http://locations-api-beta.nypl.org/amenities/7989"
          }
          },
          category: "Facilities",
          id: 7989,
          name: "Water fountain",
          rank: 13
          }
          }
        ],
        events: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/17/teen-central-talkies-jurassic-park"
          }
          },
          body: "Movies and weekends. They just go together so well, don't they? Come start your weekend off right with a movie in Teen Central. Whether it's a vintage classic from the 1980s, a modern animated masterpiece or the latest YA vampire novel adaptation, we're showing something you'll love! This week we're revisiting one of the biggest blockbusters of the 1990s, Universal Pictures' 1993 smash Jurassic Park.",
          end: "2014-10-17T21:30:00Z",
          id: 274711,
          image: "http://media1.swank.com/Assets/0000012152/OneSheet/en/0013371photo.jpg",
          registration: null,
          start: "2014-10-17T19:30:00Z",
          title: "Teen Central Talkies: Jurassic Park"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/03/craft-fun"
          }
          },
          body: "Fun crafts for ages 4-12.",
          end: "2014-10-17T20:00:00Z",
          id: 272150,
          image: "http://www.nypl.org/sites/default/files/images/craft_program_0.inline%20vertical.jpg",
          registration: null,
          start: "2014-10-17T20:00:00Z",
          title: "Craft Fun!"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/03/music-makers-story-shakers-0"
          }
          },
          body: "Children will make a musical instrument from a different part of the world and play along while listening to a great story. Designed for children 6-10 years old.",
          end: "2014-10-17T20:00:00Z",
          id: 273358,
          image: null,
          registration: null,
          start: "2014-10-17T20:00:00Z",
          title: "Music Makers & Story Shakers"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/04/super-smash-saturdays-grand-central"
          }
          },
          body: "Do you love Super Smash Brothers as much as we do? Bring your own Nintendo GameCube controller and join other SSB fanatics from around NYC in our weekly day-long tournaments on multiple CRT televisions!",
          end: "2014-10-18T20:45:00Z",
          id: 272512,
          image: null,
          registration: null,
          start: "2014-10-18T14:00:00Z",
          title: "Super Smash Saturdays @ Grand Central"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/18/ya-book-discussion-reality-boy-0"
          }
          },
          body: "A.S. King is probably the best YA author you’ve never read. Her 2013 novel, Reality Boy, tells the story of Gerald, a 17-year-old boy who did something really gross on a reality TV show when he was five. Will he ever be able to overcome the reputation his infamous act has earned him? Maybe with the help of an equally troubled girl! Drop by the library and pick up a copy today, or download the eBook or eAudiobook at eNYPL. YA fans of any age are welcome to attend!",
          end: "2014-10-18T20:00:00Z",
          id: 273438,
          image: "http://contentcafe2.btol.com/ContentCafe/Jacket.aspx?&userID=NYPL49807&password=CC68707&Value=9780316222709&content=M&Return=1&Type=M",
          registration: null,
          start: "2014-10-18T19:00:00Z",
          title: "YA Book Discussion: Reality Boy"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/07/grand-central-public-speaking-workshop"
          }
          },
          body: "Public speaking is an essential skill in today's workplace and a valuable ability to have to further your endeavors in whatever you're doing. The Grand Central Public Speaking Workshop, a continuing series held on the first and third Tuesdays of each month, is led by experienced public speakers in a supportive environment. All materials for this workshop are provided.",
          end: "2014-10-21T17:30:00Z",
          id: 273072,
          image: null,
          registration: null,
          start: "2014-10-21T16:15:00Z",
          title: "Grand Central Public Speaking Workshop"
          }
        ],
        exhibitions: [ ],
        blogs: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/06/10/ner-beck-interview"
          }
          },
          author: {
          name: "Brian Stokes",
          position: null,
          location: "Grand Central Library"
          },
          body: "On view now through August 26, 2014, is NER BECK’s NYC Street Oddities: A Photo Exhibit. Over 30 recent photographs are on display at the Grand Central Branch of the New York Public Library. Ner has had a lifelong interest in overlooked street art found on his daily walks in neighborhoods throughout the city. Also on display are a few select photos of colorful prism-like reflections on windows from another of Ner's collections. Ner recently answered some questions I had about his work, his inspriation and, of course, selfies.",
          id: 261087,
          image: "https://www.nypl.org/sites/default/files/exterior_ner_0.jpg",
          pubdate: "2014-06-10T21:18:31Z",
          title: "Meet Ner Beck, NYC Street Photographer"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/04/28/booktalking-fifteen-love-nicole-leigh-shepherd"
          }
          },
          author: {
          name: "Miranda J. McDermott",
          position: null,
          location: "Grand Concourse"
          },
          body: "Fifteen-year-old ninth-grade identical twins Maggie and Bella Anderson did not know what was in store for them when they met Coach Kasinski. Coach K, as she did not appreciate being called, liked her players to play the Kasinski way, whatever that meant. Maggie eats junk food while Bella watches her diet. Maggie twirls the racket while Bella perfects her game. Bella is obsessed with the game, while Maggie reluctantly participates. Is a Classic title on their horizon?",
          id: 222298,
          image: "http://www.nypl.org/sites/default/files/images/tennis.inline%20vertical.jpg",
          pubdate: "2014-04-28T20:06:05Z",
          title: "Booktalking \"Fifteen Love\" by Nicole Leigh Shepherd"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2013/02/12/christopher-stadulis-actor-firefighter-teen-central"
          }
          },
          author: {
          name: "Rodger Taylor",
          position: "Supervising Librarian",
          location: "Columbus Library"
          },
          body: "The partnership between Yianni Stamas and Lights Camera Read and NYPL's Teen Central at Grand Central continues with our 2013 entrepreneurial series for teens — examining jobs in the real world. Our first event featured actor/firefighter Christopher Stadulis. I have to thank him for taking time out of his busy schedule to come to Teen Central and make his presentation on a pro bono basis. I found our conversation with Chris inspirational and informative, plus Chris showed that he cares about young people in this city. One thing he said that jumped out at me was no matter what you've been thro...",
          id: 198814,
          image: null,
          pubdate: "2013-02-12T09:04:17Z",
          title: "Christopher Stadulis: Actor-Firefighter at Teen Central"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2013/02/06/happy-birthday-grand-central-terminal"
          }
          },
          author: {
          name: "Raymond Pun",
          position: null,
          location: "Stephen A. Schwarzman Building, General Research Division"
          },
          body: "The Concourse, Grand Central Station, New York Did you know that Grand Central Station (also known as Grand Central Terminal) recently turned 100? Opened in 1871 on 42nd Street between Park and Lexington avenues, the station was renovated and reopened in February 1913. Grand Central is one of the largest train connecters to the Metropolitan Transportation Authority's (MTA) 4, 5, 6, 7 and S lines that run in four boroughs; and connections to Metro-North Railway going to Westchester, Putnam and Duchess counties. N.Y. Central Station, N.Y. in 1910 (From Library of Congress Flickr)The Grand Centr...",
          id: 199324,
          image: "http://images.nypl.org/?id=96640&t=w",
          pubdate: "2013-02-06T07:02:11Z",
          title: "Happy Birthday Grand Central Terminal!"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2012/11/13/borimix-2012-puerto-rican-fest-clemente-soto-velez-cultural-center"
          }
          },
          author: {
          name: "Rodger Taylor",
          position: "Supervising Librarian",
          location: "Columbus Library"
          },
          body: "Miguel Trelles, one of the hands behind the scenes of Festival Borimix, is the kind of New Yorker who gives you hope. After Sandy blacked out and knocked us off our hinges — like the Lower East Side and the rest of the City, Borimix 2012 Puerto Rico Fest picked itself up dusted off and now also in the aftermath of a contentious racially and sexually charged but hopefully empowering election, from the Belly-ache opera to the Mexican Pinocchio, Miguel and his cohorts at the Clemente Vélez Soto Cultural Center and elsewhere unleash a real let your hair down rest of the month celebration of Puer...",
          id: 188631,
          image: null,
          pubdate: "2012-11-13T06:01:41Z",
          title: "Borimix 2012 Puerto Rican Fest and the Clemente Soto Velez Cultural Center"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2012/09/04/teen-central-anti-bullying-movement-take-two-books-bullying"
          }
          },
          author: {
          name: "Rodger Taylor",
          position: "Supervising Librarian",
          location: "Columbus Library"
          },
          body: "Welcome to our Books On Bullying reading list. It includes items from the Teen collection with some Adult titles and one very sentimental Children's favorite. We'd like this list to be as interactive as possible. Any good suggested additions will be considered and if appropriate added. The Teen Central Digi Arts Projects and Workshop at Grand Central Library in partnership with Yianni Stamas and Lights Camera Read, has mainly been about developing our anti-bullying movement this spring and summer. We invite you to see what has been done so far by the young people participating on a totall...",
          id: 179119,
          image: null,
          pubdate: "2012-09-04T10:06:12Z",
          title: "The Teen Central Anti-Bullying Movement: Books on Bullying"
          }
        ],
        features: [ ],
        alerts: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/node/71582"
          }
          },
          body: "The New York Public Library will be closed on November 11 in observance of Veterans Day.",
          end: "2014-11-12T01:00:00-05:00",
          id: 71582,
          scope: "all",
          start: "2014-11-04T00:00:00-05:00",
          title: "Veterans Day"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/node/71583"
          }
          },
          body: "The New York Public Library will be closed on Thanksgiving Day, Thursday, November 27.",
          end: "2014-11-28T01:00:00-05:00",
          id: 71583,
          scope: "all",
          start: "2014-11-20T00:00:00-05:00",
          title: "Thanksgiving Day"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/node/71584"
          }
          },
          body: "All NYPL locations will close at 5 PM on December 24 and will be closed on December 25.",
          end: "2014-12-26T23:59:00-05:00",
          id: 71584,
          scope: "all",
          start: "2014-12-17T00:00:00-05:00",
          title: "Christmas"
          }
        ]
      }
    }, 
    "response": {
        "count": 1, 
        "limit": 1, 
        "offset": 0
    }
  }
};

module.exports = response;
