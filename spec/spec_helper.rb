require 'rack/test'

require File.expand_path '../../locinator.rb', __FILE__

ENV['RACK_ENV'] = 'test'

RSpec.configure do |config| 
  include Rack::Test::Methods
  def app
    Locinator
  end
end
