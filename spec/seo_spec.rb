require File.expand_path '../spec_helper.rb', __FILE__

describe "Root path" do
  before :each do
    get '/?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "Single location page" do
  before :each do
    get '/schwarzman?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "Division page" do
  before :each do
    get '/divisions/rare-books-division?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "Sub-division page" do
  before :each do
    get '/divisions/rare-books-division/arents-collection?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "All amenities page" do
  before :each do
    get '/amenities?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "All amenities page" do
  before :each do
    get '/amenities/loc/schwarzman?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "Location amenities page" do
  before :each do
    get '/amenities/loc/schwarzman?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "Single amenity page" do
  before :each do
    get '/amenities/id/7964?_escaped_fragment_='
  end
    
  it "should return a good response" do
    expect(last_response.status).to eq 200
  end
end

describe "Non-existent URLs" do
  before :each do
    get '/abc/def/ghi?_escaped_fragment_='
  end

  it "should return a 404" do
    expect(last_response.status).to eq 404
  end
end
