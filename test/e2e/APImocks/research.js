/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var response = {
  good: {
    location: {
      _links: {
        self: {
        href: "http://locations-api-beta.nypl.org/locations/schomburg",
        about: "http://www.nypl.org/about/locations/schomburg"
        },
        blogs: {
        href: "http://locations-api-beta.nypl.org/locations/schomburg/blogs",
        all: "http://www.nypl.org/blog/library/64"
        },
        events: {
        href: "http://locations-api-beta.nypl.org/locations/schomburg/events",
        all: "http://www.nypl.org/events/calendar?location=64"
        },
        exhibitions: {
        href: "http://locations-api-beta.nypl.org/locations/schomburg/exhibitions"
        },
        alerts: {
        href: "http://locations-api-beta.nypl.org/locations/schomburg/alerts"
        },
        on_shelves: {
        href: "http://nypl.bibliocommons.com/search?custom_query=available%3A%22Schomburg+Center%22&circ=CIRC|NON%20CIRC"
        },
        amenities: {
        href: "http://locations-api-beta.nypl.org/locations/schomburg/amenities"
        },
        contact: {
        href: "http://www.nypl.org/locations/tid/64/node/126585"
        }
      },
      about: "The Schomburg Center for Research in Black Culture located in Harlem, New York is a research unit of The New York Public Library system. It is recognized as one of the leading institutions focusing exclusively on African-American, African Diaspora, and African experiences. Begun with the collections of Arturo Alfonso Schomburg more than 85 years ago, the Schomburg has collected, preserved, and provided access to materials documenting black life in America and worldwide. It has also promoted the study and interpretation of the history and culture of peoples of African descent.",
      access: "Partially Accessible",
      accessibility_note: null,
      contacts: {
      phone: "(917) 275-6975"
      },
      cross_street: "",
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
        -73.941,
        40.8144
        ]
      },
      hours: {
        regular: [
          { day: "Sun", open: null, close: null },
          { day: "Mon", open: "10:00", close: "18:00" },
          { day: "Tue", open: "10:00", close: "20:00" },
          { day: "Wed", open: "10:00", close: "20:00" },
          { day: "Thu", open: "10:00", close: "20:00" },
          { day: "Fri", open: "10:00", close: "18:00" },
          { day: "Sat", open: "10:00", close: "18:00" }
        ],
        exceptions: {
          start: "2014-10-16T14:45:31-04:00",
          end: "2014-10-17T00:00:00-04:00",
          description: "Our Research Divisions have various hours. To see their operating hours, please click here: <a href="/locations/tid/64/schomburg-collections">Research Collections</a>. The exhibition galleries and The Gift Shop are OPEN Monday—Saturday. "
        }
      },
      id: "SC",
      images: {
        exterior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/64/exterior_schomburg-3198.jpg",
        interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/64/interior_schomburg-2787_0.jpg"
      },
      locality: "New York",
      name: "Schomburg Center for Research in Black Culture",
      open: true,
      plan_your_visit: [
        { label: "Using the Library", url: "http://www.nypl.org/about/locations/using-the-library" },
        { label: "Space Rental", url: "http://www.nypl.org/spacerental/event-spaces/schomburg" },
        { label: "Plan Your Research Visit", url: "about/locations/using-the-library/plan-your-research-visit" }
      ],
      postal_code: 10037,
      region: "NY",
      slug: "schomburg",
      social_media: [
        { site: "facebook", href: "http://www.facebook.com/Schomburgcenter" },
        { site: "twitter", href: "http://twitter.com/schomburgcenter" },
        { site: "foursquare", href: "http://foursquare.com/venue/69423" },
        { site: "youtube", href: "http://www.youtube.com/user/theschomburgcenter" },
        { site: "tumblr", href: "http://schomburgcenter.tumblr.com/" }
      ],
      street_address: "515 Malcolm X Boulevard",
      synonyms: [ ],
      type: "research",
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
            location_rank: 8,
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
            location_rank: 9,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
            _links: {
            self: {
            href: "http://locations-api-beta.nypl.org/amenities/7977"
            }
            },
            category: "Printing and Copy Services",
            id: 7977,
            name: "Scanners",
            rank: 7
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
            href: "http://locations-api-beta.nypl.org/amenities/7982"
            }
            },
            category: "Facilities",
            id: 7982,
            name: "Research Study Rooms",
            rank: 12
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
            href: "http://locations-api-beta.nypl.org/amenities/7986"
            }
            },
            category: "Facilities",
            id: 7986,
            name: "Checkroom Service",
            rank: 34
            }
            },
            {
            location_rank: 14,
            accessibility_note: null,
            accessible: true,
            staff_assistance: null,
            amenity: {
            _links: {
            self: {
            href: "http://locations-api-beta.nypl.org/amenities/7987"
            }
            },
            category: "Facilities",
            id: 7987,
            name: "Payphones",
            rank: 14
            }
            },
            {
            location_rank: 15,
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
            rank: 15
            }
          }
        ],
        events: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/20/carnegie-neighborhood-concerts-abdullah-ibrahim-and-friends"
          }
          },
          body: "Pianist and composer Abdullah Ibrahim performs with members of his trio, septet Ekaya, and big band in a concert filled with gorgeous melodies and sparkling colors. Abdullah Ibrhaim is South Africa's most distinguished pianist and a world-respected master musician. His distinctive style fuses jazz improvisation with a classical technical proficiency and a traditional CapeMalay sound. Carnegie Hall’s Neighborhood Concert Series is a program of the Weill Music Institute and is sponsored by Target. FIRST COME, FIRST SEATED For all free events, we generally overbook to ensure a full...",
          end: "2014-10-20T23:00:00Z",
          id: 268938,
          image: null,
          registration: null,
          start: "2014-10-20T23:00:00Z",
          title: "Carnegie Neighborhood Concerts: Abdullah Ibrahim and Friends"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/22/5-xenobia-bailey-and-tammi-lawson"
          }
          },
          body: "From the influences of Africa, Native America, China, and Eastern philosophies, mixed in with a bit of funk, comes the work of Xenobia Bailey. Her eclectic crocheted hats and the bright repeating circular patterns often found in her pieces have certainly distinguished her as a renowned contemporary artist and visionary whose work is on display in several museums. Join us for a conversation between artist Xenobia Bailey and Tammi Lawson, Assistant Curator, Arts and Artifacts, Schomburg Center. Beofre 5 is a popular program series of mid-day events featuring writers and artists in a range of p...",
          end: "2014-10-22T18:00:00Z",
          id: 273942,
          image: null,
          registration: null,
          start: "2014-10-22T18:00:00Z",
          title: "Before 5: Xenobia Bailey and Tammi Lawson"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/23/afro-latins-now-race-counts"
          }
          },
          body: "The AfroLatin@ Forum is pleased to present Afro-Latin@s Now: Race Counts!, a three-day international conference to be held October 23–25, 2014, in New York City. This gathering will provide a unique opportunity to examine the structural and ideological barriers to full Afro-Latino representation and discuss opportunities for positive social change. For more information on the Forum and the conference: www.afrolatinoforum.org. The afrolatin@ forum raises awareness of Latin@s of African descent in the United States. The organization is committed to advancing the visibility of Black Latin@s thro...",
          end: "2014-10-23T22:00:00Z",
          id: 273961,
          image: null,
          registration: null,
          start: "2014-10-23T22:00:00Z",
          title: "Afro-Latin@s Now: Race Counts!"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/27/films-schomburg-muslim-voices-philadelphia-and-new-york"
          }
          },
          body: "Join us for screenings of a series of short documentaries produced by the Muslim Voices community history project. The goal of the Muslim Voices Project is to provide instruction and media tools to traditionally underrepresented Muslim groups so that they can research and share the stories, significant events, achievements and issues that are part of both the history of Islam in Philadelphia and New York. FIRST COME, FIRST SEATED For all free events, we generally overbook to ensure a full house. All registered seats are released 15 to 30 minutes before start time, so we recommend that you...",
          end: "2014-10-27T22:30:00Z",
          id: 268934,
          image: null,
          registration: null,
          start: "2014-10-27T22:30:00Z",
          title: "Films at the Schomburg: Muslim Voices of Philadelphia and New York"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/28/between-lines-george-clinton"
          }
          },
          body: "The funk musician George Clinton shares stories about his life and career on the occasion of the publication of his new book, Brothas Be, Yo Like George, Ain't That Funkin' Kinda Hard on You?: A Memoir. Clinton will be in conversation with the Roots’ drummer, DJ, writer, and producer Questlove. Grammy award winning artist George Clinton was the mastermind behind Parliament and Funkadelic, the two bands that virtually defined the funk genre. Clinton began recording solo in 1981, and has earned a widespread recognition for his contributions to the music world. FIRST COME, FIRST SEATED For a...",
          end: "2014-10-28T22:30:00Z",
          id: 271334,
          image: null,
          registration: null,
          start: "2014-10-28T22:30:00Z",
          title: "Between the Lines: George Clinton & Questlove"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/programs/2014/10/29/caribbean-lecture-series-dr-peter-david-phillips"
          }
          },
          body: "Dr. Peter David Phillips, Jamaica’s Minister of Finance will be the presenter at the Tenth Annual CIN Lecture Series, one of the premier Caribbean events in New York, attracting a cross-section of diplomats, media, business and religious leaders and other noteworthy members of the Caribbean community. Each year the Lecture Series attracts large audiences with each presentation rbroadcast on CINTV reaching the over two million Caribbean-Americans in New York, New Jersey and Connecticut. FIRST COME, FIRST SEATED For all free events, we generally overbook to ensure a full house. All r...",
          end: "2014-10-29T23:00:00Z",
          id: 273963,
          image: "http://cdn-prod.www.aws.nypl.org/sites/default/files/unnamed%20(1).jpg",
          registration: null,
          start: "2014-10-29T23:00:00Z",
          title: "Caribbean Lecture Series: Dr. Peter David Phillips"
          }
        ],
        exhibitions: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/exhibitions/clone-lighthouse-new-york"
          }
          },
          body: "Photographer: Austin HansenThis exhibit commemorates 80 years since the founding of the Antigua and Barbuda Progressive Society, which has dedicated itself to the principle of cultivating and promoting social and intellectual activities as well as providin",
          end: "2015-01-03T00:00:00Z",
          id: 276011,
          image: "http://www.nypl.org/sites/default/files/images/abps_by_austin_hansen004.thumbnail_square.jpg",
          start: "2013-10-04T00:00:00Z",
          title: "A Lighthouse in New York"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/exhibitions/going-home-coming-home-remembering"
          }
          },
          body: "Going Home, Coming Home: Remembering is a memorial dedication that honors seven African and African American legends, whose lives have impacted humankind throughout the world. They all have influenced, inspired and supported our humanity globally, but especially and particularly in Harlem, USA, where the Schomburg Center is a satellite, a landmark institution, a safe haven and a home for all peoples of African descent.",
          end: "2015-01-03T00:00:00Z",
          id: 266558,
          image: null,
          start: "2014-07-25T00:00:00Z",
          title: "Going Home, Coming Home: Remembering"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/exhibitions/slave-route-0"
          }
          },
          body: "The Schomburg Center s Lapidus Center for the Historical Analysis of Transatlantic Slavery presents The Slave Route, a flash display of artifacts, documents, and photographs marking the 20th anniversary of The Slave Route Project, the United Nations Educational, Scientific and Cultural Organization s worldwide initiative to break the silence about the slave trade and slavery.",
          end: "2014-10-18T00:00:00Z",
          id: 271464,
          image: null,
          start: "2014-09-05T00:00:00Z",
          title: "The Slave Route"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/exhibitions/question-bridge"
          }
          },
          body: "Question Bridge is an innovative transmedia project that facilitates a dialogue between a critical mass of black men from diverse and contending backgrounds: and creates a platform for them to represent and redefine black male identity in America.",
          end: "2015-01-03T00:00:00Z",
          id: 270517,
          image: null,
          start: "2014-09-19T00:00:00Z",
          title: "Question Bridge: Black Males"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/events/exhibitions/i-found-god-myself"
          }
          },
          body: "Since its debut performance in California in 1974, Shange s work has captivated, provoked, inspired and transformed audiences all over the world. Turning to the choreopoem not simply as an engaging work of text or drama but as a well of social, political and deeply personal issues affecting the lives of women of color, the exhibition will feature 20 specially commissioned pieces in honor of each individual poem, additional non-commissioned artworks on display at satellite locations that address the work s themes and archival material donated by Shange.",
          end: "2015-01-03T00:00:00Z",
          id: 270500,
          image: null,
          start: "2014-09-19T00:00:00Z",
          title: "i found god in myself: The 40th Anniversary of Ntozake Shange's for colored girls"
          }
        ],
        blogs: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/08/06/symphony-new-world-50th-anniversary"
          }
          },
          author: {
          name: "Steven Fullwood",
          position: "Assistant Curator",
          location: "Schomburg Manuscripts, Archives & Rare Books"
          },
          body: "In May 1964, two months before The Civil Rights Act (outlawing discrimination based on race, color, religion, sex, or national origin) became law, noted conductor Benjamin Steinberg formed a committee of 13 musicians, 12 of whom were African American, with the intention of forming a new integrated orchestra called the Symphony of the New World (SNW).",
          id: 267728,
          image: "https://www.nypl.org/sites/default/files/SNW%20program_1.jpg",
          pubdate: "2014-08-06T21:02:45Z",
          title: "Symphony of the New World: 50th Anniversary of a Pioneering Organization"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/08/05/get-on-up-james-brown-movie"
          }
          },
          author: {
          name: "Christopher Paul Moore",
          position: null,
          location: "Senior Researcher, Schomburg Center"
          },
          body: "“All musical instruments are drums,” says Chad Boseman, convincingly portraying James Brown. Words were drums, too, to “The Godfather Of Soul.”",
          id: 267860,
          image: "https://www.nypl.org/sites/default/files/blog_attachments/GETONUP.jpg",
          pubdate: "2014-08-05T20:50:01Z",
          title: "Get On Up: Review Of The James Brown Movie"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/04/18/lasting-influence-illmatic"
          }
          },
          author: {
          name: "Ann-Marie Nicholson",
          position: "Communications Manager",
          location: "Schomburg Center for Research in Black Culture"
          },
          body: "Tomorrow marks the 20th anniversary of Nas’s debut album, Illmatic. On Wednesday, I had the privilege to attend the opening of the Tribeca Film Festival to watch my friend and former colleague Erik Parker’s documentary, Time Is Illmatic. Parker’s film examines Nas’s groundbreaking album because it symbolizes the shift of hip-hop’s nerve center and lyrics in 1994.",
          id: 254397,
          image: "https://www.nypl.org/sites/default/files/220px-NasIllmatic.jpg",
          pubdate: "2014-04-18T17:05:32Z",
          title: "A Trip Down Memory Lane: The Lasting Influence of Illmatic"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/03/03/lorraine-hansberry-dreamer-supreme"
          }
          },
          author: {
          name: "Christopher Paul Moore",
          position: null,
          location: "Senior Researcher, Schomburg Center"
          },
          body: "The Lorraine Hansberry Collection at the Schomburg Center For Research In Black Culture is a remarkably thorough record of family, personal, and professional papers, letters, manuscripts and photographs documenting her entire life as an artist and activist.",
          id: 248175,
          image: "https://www.nypl.org/sites/default/files/LVH2014_2.jpg",
          pubdate: "2014-03-03T16:52:50Z",
          title: "Lorraine Hansberry: Dreamer Supreme"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2014/01/31/12-years-slave"
          }
          },
          author: {
          name: "Sylviane A. Diouf",
          position: null,
          location: "Curator of Digital Collections, Schomburg Center for Research in Black Culture"
          },
          body: "We’ll know in one month if Steve McQueen’s film gets an Oscar. But one thing is sure: the heretofore largely unfamiliar Solomon Northup has become a household name.",
          id: 242598,
          image: "http://images.nypl.org/index.php?id=497439&t=r",
          pubdate: "2014-01-31T20:37:15Z",
          title: "12 Years a Slave. What About 15 Years in a Cave?"
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/blog/2013/12/18/review-how-i-learned-what-i-learned"
          }
          },
          author: {
          name: "Christopher Paul Moore",
          position: null,
          location: "Senior Researcher, Schomburg Center"
          },
          body: "Frederick August Kittle Jr. loved libraries. That's a point clearly made in How I Learned What I Learned, August Wilson's autobiographical play at the Signature Center, directed by Todd Kreidler, starring Ruben Santiago Hudson. Freddie Kittle Jr. preferred libraries to Pittsburgh schools which were not an easy way for him to learn. He also loved his mother, Daisy Wilson, and he loved people, particularly black people. How I Learned What I Learned is a memoir monologue, written and originally performed by the playwright in 2003. Chronicling August Wilson's youthful past and path through the Hi...",
          id: 239036,
          image: null,
          pubdate: "2013-12-18T06:01:53Z",
          title: "August Wilson's How I Learned What I Learned"
          }
        ],
        features: [
          {
          _links: {
          self: {
          href: "http://www.nypl.org/locations/tid/64/node/65912"
          }
          },
          body: "<p><span id="docs-internal-guid-01b1f701-f132-c16d-4a9c-bb78126545b5"><span>The Schomburg Center </span><span>advances knowledge of the global black experience through dynamic</span><span> </span><span>programs and exhibitions.</span></span></p> ",
          id: 275373,
          image: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/features/Screen%20Shot%202014-10-08%20at%203.35.16%20PM.png",
          title: "Programs and Exhibitions",
          weight: -10
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/about/locations/schomburg/fellowships"
          }
          },
          body: "<p><span id="docs-internal-guid-01b1f701-f12a-5250-cdd1-1bb06c871360"><span>The Schomburg Center serves learners from Pre-K to PhD, with its dynamic educational programs, institutes and fellowships.</span></span></p> ",
          id: 275365,
          image: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/features/Screen%20Shot%202014-10-08%20at%204.34.01%20PM.png",
          title: "Education, Institutes, and Fellowships",
          weight: -9
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/about/locations/schomburg/digital-schomburg"
          }
          },
          body: "<p><span id="docs-internal-guid-01b1f701-f134-392b-b66a-a066654382aa"><span>Digital Schomburg provides access to trusted information, interpretation, and scholarship on the global black experience.</span></span></p> ",
          id: 55392,
          image: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/features/Screen%20Shot%202014-10-08%20at%203.43.39%20PM.png",
          title: "Digital Schomburg",
          weight: -8
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org/support/membership/schomburg-society"
          }
          },
          body: "<p><span id="docs-internal-guid-01b1f701-f13c-e1bf-837d-b228d2bdd136"><span>Help sustain the Schomburg’s collections, programs, and services by becoming a member.</span></span></p> ",
          id: 65883,
          image: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/features/Cover%20of%20Gen%20Brochure.png",
          title: "Support the Schomburg",
          weight: -6
          },
          {
          _links: {
          self: {
          href: "http://www.nypl.org//spacerental/event-spaces/schomburg"
          }
          },
          body: "<p><span id="docs-internal-guid-01b1f701-f136-82b2-38b4-6237004045c3"><span>Located in the heart of Harlem,</span><span> </span><span>the Schomburg Center is available for private events.</span></span></p> <p> </p> ",
          id: 65881,
          image: "http://cdn-prod.www.aws.nypl.org/sites/default/files/lobby_0.jpg",
          title: "Special Events and Space Rentals",
          weight: -5
          }
        ],
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
        ],
        
      }
    }
  }
};

module.exports = response;
