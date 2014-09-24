/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  bad: {
    location: {
      "_id": "GC",
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
    "location": {
      "_id": "GC", 
      "_links": {
        "self": {
          "href": "locations/grand-central"
        },
        "alerts": {
          "href": "locations/grand-central/alerts"
        },
        "amenities": {
          "href": "locations/grand-central/amenities"
        }, 
        "blogs": {
          "all": "http://www.nypl.org/blog/library/871", 
          "href": "locations/grand-central/blogs"
        },
        "events": {
          "href": "locations/grand-central/events",
          "all": "http://dev.www.aws.nypl.org/events/calendar?location=871"
        },
        "exhibitions": {
          "href": "locations/grand-central/exhibitions"
        },
        "on_shelves": {
          "href": "http://nypl.bibliocommons.com/search?custom_query=available%3A%22Grand+Central%22&circ=CIRC|NON%20CIRC"
        },
        "contact": {
          "href": "http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=10208&type=1&language=1"
        }
      },
      "about": "The Grand Central Branch is conveniently situated for commuters and area workers as well as families living to the east. Boasting 45 computers, 32 of which are laptops, there are outlets and data ports located at the bar-height seating looking out on 46th street. Follow Grand Central on Twitter @GrandCentralLib and Facebook, and Teen Central on Twitter @TnCntrl and on Facebook.", 
      "access": "Fully Accessible", 
      "contacts": {
        "manager": "Genoveve Stowell", 
        "phone": "(212) 621-0670"
      }, 
      "cross_street": "between Lexington &amp; Third Aves.", 
      "geolocation": {
        "coordinates": [
          -73.974, 
          40.7539
        ], 
        "type": "Point"
      }, 
      "hours": {
        "regular": [
          {
            "close": null, 
            "day": "Sun", 
            "open": null
          }, 
          {
            "close": "19:00", 
            "day": "Mon", 
            "open": "11:00"
          }, 
          {
            "close": "18:00", 
            "day": "Tue", 
            "open": "10:00"
          }, 
          {
            "close": "18:00", 
            "day": "Wed", 
            "open": "11:00"
          }, 
          {
            "close": "18:00", 
            "day": "Thu", 
            "open": "11:00"
          }, 
          {
            "close": "18:00", 
            "day": "Fri", 
            "open": "11:00"
          }, 
          {
            "close": "17:00", 
            "day": "Sat", 
            "open": "10:00"
          }
        ]
      }, 
      "id": "GC", 
      "images": {
        "interior": "http://www.nypl.org/sites/default/files/images/grand_central.jpg",
        "exterior": "http://www.nypl.org/sites/default/files/images/grand_central.jpg"
      },
      "locality": "New York", 
      "name": "Grand Central Library",
      "open": true,
      "postal_code": 10017, 
      "region": "NY", 
      "slug": "grand-central", 
      "social_media": [
        {
          "href": "https://www.facebook.com/pages/Grand-Central-Library/145759075487536", 
          "site": "facebook"
        }, 
        {
          "href": "http://twitter.com/GrandCentralLib", 
          "site": "twitter"
        }, 
        {
          "href": "http://foursquare.com/venue/231626", 
          "site": "foursquare"
        }, 
        {
          "href": "http://www.youtube.com/NewYorkPublicLibrary", 
          "site": "youtube"
        }, 
        {
          "href": "http://nypl.bibliocommons.com/lists/show/87523849_nypl_grand_central", 
          "site": "bibliocommons"
        }
      ], 
      "street_address": "135 East 46th Street", 
      "synonyms": null, 
      "type": "circulating",
      "_embedded": {
        "amenities": [],
        "events": [
          {
            "_id": 265631, 
            "_links": {
              "self": {
                "href": "events/programs/2014/08/14/spa-time"
              }
            }, 
            "body": "Need an afternoon to pamper yourself? Want to make a gift for someone special? Learn how to make your own bath salts, lip balms, shower scrubs and more in this scent-ual workshop. All materials will be provided. Presented by Jailin Acevedo. For ages 12 to 18 years old.", 
            "end": "2014-08-14T20:00:00Z", 
            "id": 265631, 
            "image": null, 
            "registration": null, 
            "start": "2014-08-14T20:00:00Z", 
            "title": "Spa Time"
          }, 
          {
            "_id": 266528, 
            "_links": {
              "self": {
                "href": "events/programs/2014/08/15/teen-central-talkies-warm-bodies"
              }
            }, 
            "body": "Movies and weekends. They just go together so well, don't they? Come start your weekend off right with a movie in Teen Central. Whether it's a vintage classic from the 1980s, a modern animated masterpiece or the latest YA vampire novel adaptation, we're showing something you'll love! This week we're checking out a zombie twist on the classic teen love story with Summit Entertainment's Warm Bodies.", 
            "end": "2014-08-15T21:00:00Z", 
            "id": 266528, 
            "image": "http://media1.swank.com/Assets/0000032796/OneSheet/en/0034873photo.jpg", 
            "registration": null, 
            "start": "2014-08-15T19:00:00Z", 
            "title": "Teen Central Talkies: Warm Bodies"
          }, 
          {
            "_id": 259308, 
            "_links": {
              "self": {
                "href": "events/programs/2014/08/15/story-songs-bob-basey"
              }
            }, 
            "body": "A Summer Reading Celebration Come in and join Bob Basey for stories and songs of the season. For children ages 3 and older.", 
            "end": "2014-08-15T20:00:00Z", 
            "id": 259308, 
            "image": null, 
            "registration": null, 
            "start": "2014-08-15T20:00:00Z", 
            "title": "Story Songs with Bob Basey"
          }, 
          {
            "_id": 265926, 
            "_links": {
              "self": {
                "href": "events/programs/2014/08/02/super-smash-saturdays-grand-central"
              }
            }, 
            "body": "Do you love Super Smash Brothers as much as we do? Bring your own Nintendo GameCube controller and join other SSB fanatics from around NYC in our weekly day-long tournaments on multiple CRT televisions!", 
            "end": "2014-08-16T20:45:00Z", 
            "id": 265926, 
            "image": null, 
            "registration": null, 
            "start": "2014-08-16T14:00:00Z", 
            "title": "Super Smash Saturdays @ Grand Central"
          }, 
          {
            "_id": 257174, 
            "_links": {
              "self": {
                "href": "events/programs/2014/08/16/piney-fork-press-theater"
              }
            }, 
            "body": "Members of Manhattan s Piney Fork Press Theater present short pieces by playwright Johnny Culver, in a casual setting.Join us!", 
            "end": "2014-08-16T17:00:00Z", 
            "id": 257174, 
            "image": null, 
            "registration": null, 
            "start": "2014-08-16T17:00:00Z", 
            "title": "Piney Fork Press Theater"
          }, 
          {
            "_id": 266945, 
            "_links": {
              "self": {
                "href": "events/programs/2014/08/05/grand-central-public-speaking-workshop"
              }
            }, 
            "body": "Public speaking is an essential skill in today's workplace and a valuable ability to have to further your endeavors in whatever you're doing. The Grand Central Public Speaking Workshop, a continuing series held on the first and third Tuesdays of each month, is led by experienced public speakers in a supportive environment. All materials for this workshop are provided.", 
            "end": "2014-08-19T17:30:00Z", 
            "id": 266945, 
            "image": null, 
            "registration": null, 
            "start": "2014-08-19T16:15:00Z", 
            "title": "Grand Central Public Speaking Workshop"
          },
        ],
        "exhibitions": [],
        "blogs": [
          {
            "_id": 261087, 
            "_links": {
              "self": {
                "href": "blog/2014/06/10/ner-beck-interview"
              }
            }, 
            "author": {
              "location": "Grand Central Library", 
              "name": "Brian Stokes", 
              "position": null
            }, 
            "body": "On view now through July 3, 2014, is NER BECK s NYC Street Oddities: A Photo Exhibit. Over 30 recent photographs are on display at the Grand Central Branch of the New York Public Library. Ner has had a lifelong interest in overlooked street art found on his daily walks in neighborhoods throughout the city. Also on display are a few select photos of colorful prism-like reflections on windows from another of Ner's collections. Ner recently answered some questions I had about his work, his inspriation and, of course, selfies.", 
            "id": 261087, 
            "image": "https://www.nypl.org/sites/default/files/exterior_ner_0.jpg", 
            "pubdate": "2014-06-10T21:18:31Z", 
            "title": "Meet Ner Beck, NYC Street Photographer"
          }, 
          {
            "_id": 222298, 
            "_links": {
              "self": {
                "href": "blog/2014/04/28/booktalking-fifteen-love-nicole-leigh-shepherd"
              }
            }, 
            "author": {
              "location": "Grand Concourse", 
              "name": "Miranda J. McDermott", 
              "position": null
            }, 
            "body": "Fifteen-year-old ninth-grade identical twins Maggie and Bella Anderson did not know what was in store for them when they met Coach Kasinski. Coach K, as she did not appreciate being called, liked her players to play the Kasinski way, whatever that meant. Maggie eats junk food while Bella watches her diet. Maggie twirls the racket while Bella perfects her game. Bella is obsessed with the game, while Maggie reluctantly participates. Is a Classic title on their horizon?", 
            "id": 222298, 
            "image": "http://www.nypl.org/sites/default/files/images/tennis.inline%20vertical.jpg", 
            "pubdate": "2014-04-28T20:06:05Z", 
            "title": "Booktalking \"Fifteen Love\" by Nicole Leigh Shepherd"
          }, 
          {
            "_id": 198814, 
            "_links": {
              "self": {
                "href": "blog/2013/02/12/christopher-stadulis-actor-firefighter-teen-central"
              }
            }, 
            "author": {
              "location": "Columbus Library", 
              "name": "Rodger Taylor", 
              "position": "Supervising Librarian"
            }, 
            "body": "The partnership between Yianni Stamas and Lights Camera Read and NYPL's Teen Central at Grand Central continues with our 2013 entrepreneurial series for teens examining jobs in the real world. Our first event featured actor/firefighter Christopher Stadulis.", 
            "id": 198814, 
            "image": null, 
            "pubdate": "2013-02-12T09:04:17Z", 
            "title": "Christopher Stadulis: Actor-Firefighter at Teen Central"
          }, 
          {
            "_id": 199324, 
            "_links": {
              "self": {
                "href": "blog/2013/02/06/happy-birthday-grand-central-terminal"
              }
            }, 
            "author": {
              "location": "Stephen A. Schwarzman Building, General Research Division", 
              "name": "Raymond Pun", 
              "position": null
            }, 
            "body": "The Concourse, Grand Central Station, New York Did you know that Grand Central Station (also known as Grand Central Terminal) recently turned 100? Opened in 1871 on 42nd Street between Park and Lexington avenues, the station was renovated and reopened in February 1913. Grand Central is one of the largest train connecters to the Metropolitan Transportation Authority's (MTA) 4, 5, 6, 7 and S lines that run in four boroughs; and connections to Metro-North Railway going to Westchester, Putnam and Duchess counties.", 
            "id": 199324, 
            "image": "http://images.nypl.org/?id=96640&t=w", 
            "pubdate": "2013-02-06T07:02:11Z", 
            "title": "Happy Birthday Grand Central Terminal!"
          }, 
          {
            "_id": 188631, 
            "_links": {
              "self": {
                "href": "blog/2012/11/13/borimix-2012-puerto-rican-fest-clemente-soto-velez-cultural-center"
              }
            }, 
            "author": {
              "location": "Columbus Library", 
              "name": "Rodger Taylor", 
              "position": "Supervising Librarian"
            }, 
            "body": "Miguel Trelles, one of the hands behind the scenes of Festival Borimix, is the kind of New Yorker who gives you hope.", 
            "id": 188631, 
            "image": null, 
            "pubdate": "2012-11-13T06:01:41Z", 
            "title": "Borimix 2012 Puerto Rican Fest and the Clemente Soto Velez Cultural Center"
          }, 
          {
            "_id": 179119, 
            "_links": {
              "self": {
                "href": "blog/2012/09/04/teen-central-anti-bullying-movement-take-two-books-bullying"
              }
            }, 
            "author": {
              "location": "Columbus Library", 
              "name": "Rodger Taylor", 
              "position": "Supervising Librarian"
            }, 
            "body": "Welcome to our Books On Bullying reading list. It includes items from the Teen collection with some Adult titles and one very sentimental Children's favorite. We'd like this list to be as interactive as possible. Any good suggested additions will be considered and if appropriate added.", 
            "id": 179119, 
            "image": null, 
            "pubdate": "2012-09-04T10:06:12Z", 
            "title": "The Teen Central Anti-Bullying Movement: Books on Bullying"
          }
        ],
        "features": [],
        "alerts": [
          {
            "_id": 71579, 
            "_links": {
              "self": {
                "href": "node/71579"
              }
            }, 
            "body": "The New York Public Library will be closed August 30th through September 1st in observance of Labor Day.", 
            "end": "2014-09-02T01:00:00-04:00", 
            "id": "71579", 
            "scope": "all", 
            "start": "2014-08-23T00:00:00-04:00", 
            "title": "Labor Day"
          }, 
          {
            "_id": 71581, 
            "_links": {
              "self": {
                "href": "node/71581"
              }
            }, 
            "body": "The New York Public Library will be closed on Monday, October 13 in observance of Columbus Day.", 
            "end": "2014-10-14T01:00:00-04:00", 
            "id": "71581", 
            "scope": "all", 
            "start": "2014-10-06T00:00:00-04:00", 
            "title": "Columbus Day"
          }, 
          {
            "_id": 71582, 
            "_links": {
              "self": {
                "href": "node/71582"
              }
            }, 
            "body": "The New York Public Library will be closed on November 11 in observance of Veterans Day.", 
            "end": "2014-11-12T01:00:00-05:00", 
            "id": "71582", 
            "scope": "all", 
            "start": "2014-11-04T00:00:00-05:00", 
            "title": "Veterans Day"
          }, 
          {
            "_id": 71583, 
            "_links": {
              "self": {
                "href": "node/71583"
              }
            }, 
            "body": "The New York Public Library will be closed on Thanksgiving Day, Thursday, November 27.", 
            "end": "2014-11-28T01:00:00-05:00", 
            "id": "71583", 
            "scope": "all", 
            "start": "2014-11-20T00:00:00-05:00", 
            "title": "Thanksgiving Day"
          }, 
          {
            "_id": 71584, 
            "_links": {
              "self": {
                "href": "node/71584"
              }
            }, 
            "body": "All NYPL locations will close at 5 PM on December 24 and will be closed on December 25.", 
            "end": "2014-12-26T23:59:00-05:00", 
            "id": "71584", 
            "scope": "all", 
            "start": "2014-12-17T00:00:00-05:00", 
            "title": "Christmas"
          }
        ], 
        "divisions": null,
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
