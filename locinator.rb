require 'sinatra/base'

class Locinator < Sinatra::Base

  # Method cribbed from http://blog.alexmaccaw.com/seo-in-js-web-apps
  helpers do
    set :spider do |enabled|
      condition do
        params.has_key?('_escaped_fragment_')
      end
    end
  end

  get '/', :spider => true do
    "Escaped Fragment"
  end

  get '/' do
    File.read(File.join('public', 'index.html'))
  end
  

  # start the server if ruby file executed directly
  run! if app_file == $0

end
