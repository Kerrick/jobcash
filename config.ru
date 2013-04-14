require 'rack-rewrite'

use Rack::Rewrite do
  rewrite /(.*)/, lambda { |match, rack_env|
    File.exists?(match[1][1..-1]) ? match[1] : '/index.html'
  }
end

run Rack::Directory.new('.')

