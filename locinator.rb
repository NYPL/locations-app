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
    # set :root, 'locations/'
    # set :views, 'views'
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
    erb :seo_amenities
  end
  
  get %r{/divisions/(.+/)?(.+)$}, :spider => true do
    api = Lionactor::Client.new
    @div = api.division(params['captures'][1])
    erb :seo_division
  end

  get %r{/(.+)$}, :spider => true do
    api = Lionactor::Client.new
    @location = api.location(params['captures'].first)
    erb :seo_location
  end

  get '/', :spider => true do
    api = Lionactor::Client.new
    @locations = api.locations
    erb :seo_index
  end

  get '/config' do

    tz = DateTime.now().strftime("%z")
    response = {
      "config" => {
        "self" => settings.env_config["url"],
        "tz_offset" => tz,
        "api_root" => settings.env_config["api"],
        "divisions_with_appointments" => settings.divisions_with_appointments,
        "featured_amenities" => settings.featured_amenities,
        "research_order" => settings.research_order,
        "fundraising" => settings.fundraising,
        "closed_img" => settings.env_config["closed_img"]
      }
    }
    jsonp response
  end

  get %r{/widget/.*} do
    erb :widget
  end
    

  get %r{/.*$} do
    erb :index
  end
  

  # start the server if ruby file executed directly
  run! if app_file == $0

end
