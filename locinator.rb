require 'date'
require 'sinatra/base'
require 'sinatra/jsonp'
require 'lionactor'
require 'erb'

class Locinator < Sinatra::Base
  configure do
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
  end

  helpers Sinatra::Jsonp
  set :protection, :except => :frame_options
  set :haml, :format => :html5
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
    @data = api.amenities(params['captures'].first)
    haml :amenities_one_location
  end

  get %r{/amenities/id/(\d+)$}, :spider => true do
    api = Lionactor::Client.new
    @data = api.amenity(params['captures'].first)
    haml :amenities_one_amenity
  end

  get %r{/amenities$}, :spider => true do
    api = Lionactor::Client.new
    @data = api.amenities
    haml :amenities
  end
  
  get %r{/division/(.+)$}, :spider => true do
    api = Lionactor::Client.new
    @data = api.division(params['captures'].first)
    haml :division
  end

  get %r{/(.+)$}, :spider => true do
    api = Lionactor::Client.new
    @data = api.location(params['captures'].first)
    haml :location
  end

  get '/', :spider => true do
    api = Lionactor::Client.new
    @data = api.locations
    haml :index
  end

  get '/config' do
    tz = DateTime.now().strftime("%z")
    response = {
      "config" => {
        "tz_offset" => tz,
        "api_root" => settings.env_config["api"],
        "divisions_with_appointments" => settings.divisions_with_appointments,
        "featured_amenities" => settings.featured_amenities,
        "research_order" => settings.research_order
      }
    }
    jsonp response
  end
    

  get %r{/.*$} do
    erb :index
  end
  

  # start the server if ruby file executed directly
  run! if app_file == $0

end
