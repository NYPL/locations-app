require 'sinatra/base'
require 'lionactor'

class Locinator < Sinatra::Base
  

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

  get '/' do
    File.read(File.join('public', 'index.html'))
  end
  

  # start the server if ruby file executed directly
  run! if app_file == $0

end
