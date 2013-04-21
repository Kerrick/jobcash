task default: 'compile'

desc 'Compile all assets (production)'
multitask compile: ['compile:sass'] do
  puts "Compiled all assets using production settings."
end

namespace :compile do
  desc 'Compile the sass/ directory into CSS for production'
  task :sass do
    check_dirs %w[css sass]
    sh 'sass --update sass:css --style compressed --force', verbose: false
  end

  desc 'Compile coffeescript in the coffee/ directory into JS for production'
  task :coffee do
    require 'coffee_script'
    check_dirs %w[coffee spec]
    files = FileList['coffee/**/*.coffee']
    code = ''
    files.each do |file|
      code << File.read(file)
    end
    File.open 'app.js', 'w' do |file|
      file.write CoffeeScript.compile(code, bare: true)
    end
    puts 'Wrote app.js'
  end
end

namespace :dev do
  desc 'Initialize development -- do this after a git clone!'
  task :init do
    sh 'bundle exec bourbon install --path=vendor'
  end

  desc 'Start the server at http://localhost:8925/'
  task :server do
    puts 'Starting server at http://localhost:8925/ now...'
    sh 'bundle exec rackup -p 8925', verbose: false
  end

  desc 'Watch all assets to compile on changes (development)'
  task :watch do
    WATCHERS = [:sass, :coffee]
    begin
      threads = []
      WATCHERS.each do |name|
        sleep 0.1 # Because if you fork too fast, STDOUT can look cluttered.
        threads << {name: name,
          pid: fork { Rake::Task["dev:watch:#{name.to_s}"].invoke }}
      end
      sleep # Block main the process!
    rescue Interrupt
      puts # Because we don't want the ^C cluttering up our messages.
      threads.each do |thread|
        Process.kill('TERM', thread[:pid])
        puts "[#{thread[:name]}] No longer watching for changes"
      end
    end
  end

  namespace :watch do
    desc 'Watch the only the sass/ directory'
    task :sass do
      check_dirs %w[css sass]
      on_change_of_folder 'sass' do
        sh 'sass --update sass:css --style expanded --line-numbers --line-comments', verbose: false
      end
    end

    desc 'Watch only coffeescript in the coffee/ directory'
    task :coffee do
      on_change_of_folder 'coffee' do
        Rake::Task['compile:coffee'].reenable
        Rake::Task['compile:coffee'].invoke
      end
    end
  end
end

def check_dirs(dir_array)
  require 'fileutils'
  dir_array.each { |dir| FileUtils.mkdir_p dir unless Dir.exists? dir }
end

def on_change_of_folder(folder, &block)
  require 'listen'
  begin
    callback = Proc.new do |modified, added, removed|
      if [modified, added, removed] == [nil, nil, nil]
        puts "[#{folder}] Watching for changes. Press Ctrl-C to stop."
      else
        puts "[#{folder}] Change detected!"
      end
      if block_given?
        yield modified, added, removed
      else
        puts "[#{folder}] ...But doing nothing."
      end
    end
    callback.call nil, nil, nil
    listener = Listen.to folder
    listener.change &callback
    listener.start
  rescue Interrupt
    listener.stop
    puts "\n[#{folder}] No longer watching for changes."
  end
end

