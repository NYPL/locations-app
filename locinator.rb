require 'sinatra/base'
require 'sinatra-index'

class Locinator < Sinatra::Base
  register Sinatra::Index
  use_static_index 'index.html'
  # ... app code here ...

  # start the server if ruby file executed directly
  run! if app_file == $0

end
