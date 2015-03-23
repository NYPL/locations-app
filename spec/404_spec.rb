require File.expand_path '../spec_helper.rb', __FILE__

describe "tid path" do
  context "with a good tid" do
    before :each do
      get '/tid/36/about'
    end

    it "should redirect" do
      expect(last_response.status).to eq 301
    end
  end

  context "with a bad tid" do
    before :each do
      get '/tid/99999/about'
    end

    it "should return a 404" do
      expect(last_response.status).to eq 404
    end
  end
end


