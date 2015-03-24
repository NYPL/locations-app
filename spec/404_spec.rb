require File.expand_path '../spec_helper.rb', __FILE__

describe "tid path" do
  context "with a good tid" do
    it "should redirect" do
      get '/tid/36/about'
      expect(last_response.status).to eq 301
    end

    context "with nothing after the tid" do
      context "with no trainling slash" do
        it "should return a redirect" do
          get '/tid/36'
          expect(last_response.status).to eq 301
        end
      end

      context "with trailing slash" do
        it "should return a redirect" do
          get '/tid/36/'
          expect(last_response.status).to eq 301
        end
      end
    end

  end

  context "with a bad tid" do
    it "should return a 404" do
      get '/tid/99999/about'
      expect(last_response.status).to eq 404
    end

    context "with nothing after the tid" do
      it "should return a 404" do
        get '/tid/99999'
        expect(last_response.status).to eq 404
      end
    end
  end
end


