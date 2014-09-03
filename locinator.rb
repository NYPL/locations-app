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

  get '/', :spider => true do
    wanted = params['_escaped_fragment_']
    api = Lionactor::Client.new
    if wanted =~ /([0-9a-z\-]+)$/
      @data = api.location($1)
      haml :location
    else
      @data = api.locations
      haml :index
    end
  end

  get '/' do
    File.read(File.join('public', 'index.html'))
  end
  

  # start the server if ruby file executed directly
  run! if app_file == $0

end
