require 'date'
require 'sinatra/base'
require 'sinatra/jsonp'
require 'lionactor'
require 'erb'

class Locinator < Sinatra::Base
  configure do
    set :locinator_env, ENV['LOCINATOR_ENV']
    configs = JSON.parse(File.read('locinator.json'))
    if configs["environments"].has_key?(ENV['LOCINATOR_ENV'])
      set :env_config, configs["environments"][ENV['LOCINATOR_ENV']]
    else
      set :env_config, 
        configs["environments"][configs["environments"]["default"]]
    end
    set :divisions_with_appointments, configs["divisions_with_appointments"]
    set :featured_amenities, configs["featured_amenities"]
    set :research_order, configs["research_order"]
    set :fundraising, configs["fundraising"]
    set :baseurl, '/locations/'

    set :app_cfg, JSON.generate({
      "config" => {
        "self" => settings.env_config["url"],
        "tz_offset" => DateTime.now().strftime("%z"),
        "api_root" => settings.env_config["api"],
        "api_version" => settings.env_config["api_version"],
        "divisions_with_appointments" => settings.divisions_with_appointments,
        "featured_amenities" => settings.featured_amenities,
        "research_order" => settings.research_order,
        "fundraising" => settings.fundraising,
        "closed_img" => settings.env_config["closed_img"]
      }
    })

    set :tids, {
          "36" => "schwarzman",
          "55" => "lpa",
          "64" => "schomburg",
          "65" => "sibl",
          "1" => "115th-street",
          "2" => "125th-street",
          "3" => "58th-street",
          "4" => "67th-street",
          "5" => "96th-street",
          "6" => "aguilar",
          "7" => "allerton",
          "2787" => "battery-park-city",
          "9" => "baychester",
          "10" => "belmont",
          "11" => "bloomingdale",
          "12" => "bronx-library-center",
          "13" => "castle-hill",
          "14" => "cathedral",
          "15" => "chatham-square",
          "16" => "city-island",
          "17" => "clasons-point",
          "18" => "columbus",
          "19" => "countee-cullen",
          "20" => "dongan-hills",
          "21" => "donnell-library-center",
          "22" => "eastchester",
          "23" => "edenwald",
          "24" => "epiphany",
          "25" => "fort-washington",
          "26" => "francis-martin",
          "27" => "george-bruce",
          "871" => "grand-central",
          "28" => "grand-concourse",
          "29" => "great-kills",
          "30" => "hamilton-fish-park",
          "31" => "hamilton-grange",
          "32" => "harlem",
          "33" => "high-bridge",
          "34" => "hudson-park",
          "35" => "huguenot-park",
          "37" => "hunts-point",
          "38" => "inwood",
          "39" => "jefferson-market",
          "40" => "jerome-park",
          "41" => "kingsbridge",
          "42" => "kips-bay",
          "43" => "macombs-bridge",
          "7892" => "mariners-harbor",
          "44" => "melrose",
          "46" => "morningside-heights",
          "632" => "morris-park",
          "48" => "morrisania",
          "49" => "mosholu",
          "50" => "mott-haven",
          "51" => "muhlenberg",
          "495" => "mulberry-street",
          "53" => "new-amsterdam",
          "54" => "new-dorp",
          "56" => "ottendorfer",
          "57" => "parkchester",
          "58" => "pelham-bay",
          "59" => "port-richmond",
          "60" => "richmondtown",
          "61" => "riverdale",
          "62" => "riverside",
          "63" => "roosevelt-island",
          "66" => "sedgwick",
          "67" => "seward-park",
          "68" => "soundview",
          "69" => "south-beach",
          "70" => "spuyten-duyvil",
          "71" => "st-agnes",
          "72" => "st-george-library-center",
          "73" => "stapleton",
          "74" => "throgs-neck",
          "75" => "todt-hill-westerleigh",
          "76" => "tompkins-square",
          "77" => "tottenville",
          "78" => "tremont",
          "79" => "van-cortlandt",
          "80" => "van-nest",
          "81" => "wakefield",
          "82" => "washington-heights",
          "83" => "webster",
          "84" => "west-farms",
          "85" => "west-new-brighton",
          "86" => "westchester-square",
          "87" => "woodlawn-heights",
          "88" => "woodstock",
          "89" => "yorkville",
          "8" => "heiskell"
        }
          
  end

  before do
    headers 'Access-Control-Allow-Origin' => '*',
    'Access-Control-Allow-Methods' => ['GET'],
    'Access-Control-Allow-Headers' => 'Content-Type'
  end

  helpers Sinatra::Jsonp
  set :protection, :except => :frame_options

  # Method cribbed from http://blog.alexmaccaw.com/seo-in-js-web-apps
  helpers do
    set :spider do |enabled|
      condition do
        params.has_key?('_escaped_fragment_')
      end
    end
  end

  get %r{/amenities/loc/(.+)$}, :spider => true do
    api = Lionactor::Client.new
    @loc = api.location(params['captures'].first)
    erb :seo_amenities_one_location
  end

  get %r{/amenities/id/(\d+)$}, :spider => true do
    api = Lionactor::Client.new
    @amenity = api.amenity(params['captures'].first)
    erb :seo_one_amenity
  end

  get %r{/amenities$}, :spider => true do
    api = Lionactor::Client.new
    @amenities = api.amenities.group_by{|a| a.category}
    @baseurl = '/'
    if request.forwarded?
      @baseurl = settings.baseurl
    end
    erb :seo_amenities
  end
  
  get %r{/divisions/(.+/)?(.+)$}, :spider => true do
    api = Lionactor::Client.new
    @div = api.division(params['captures'][1])
    erb :seo_division
  end

  get %r{/tid/(\d+)(/([^/]+))?} do |tid, extra, page|
    slug = settings.tids[tid]
    if ! slug.nil?
      if ! page.nil?
        if ['about', 'community', 'details'].include? page.downcase
          redirect to("http://nypl.org/about/locations/#{slug}"), 301
        end
      
        if page == 'calendar'
          redirect to("http://www.nypl.org/events/calendar?location=#{tid}"), 301
        end
      else
        if request.forwarded?
          redirect to("#{settings.baseurl}/#{slug}"), 301
        else
          redirect to(slug), 301
        end
      end
    end
    @rq = request
    status 404
    erb :index
  end

  get %r{/(.+)$}, :spider => true do
    api = Lionactor::Client.new
    begin
      @location = api.location(params['captures'].first)
      erb :seo_location
    rescue Lionactor::ResponseError => e
      status e.status
      body "Nothing found for \"#{params['captures'].first}\""
    end
  end

  get '/', :spider => true do
    api = Lionactor::Client.new
    @locations = api.locations
    erb :seo_index
  end

  get %r{/widget/.*} do
    @rq = request
    erb :widget
  end
    
  get %r{/.*$} do
    @rq = request
    erb :index
  end  

  # start the server if ruby file executed directly
  run! if app_file == $0

end
