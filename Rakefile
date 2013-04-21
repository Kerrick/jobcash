require 'rake/clean'

CLOBBER.include 'app.js', 'css/'

task default: 'compile'

desc 'Compile all assets (production)'
multitask compile: ['compile:sass', 'compile:app.js'] do
  puts "Compiled all assets using production settings."
end

namespace :compile do
  desc 'Compile the sass/ directory into CSS in the css/ directory'
  task :sass do
    check_dirs %w[css sass]
    sh 'sass --update sass:css --style compressed --force', verbose: false
  end

  desc 'Compile the coffee/ and templates/ directories into app.js'
  task 'app.js' do
    require 'coffee_script'
    coffee_files = FileList['coffee/**/*.coffee']
    handlebars_files = FileList['templates/**/*.handlebars']
    appjs = ''

    coffee_files.each do |file|
      appjs << File.read(file)
    end

    appjs = CoffeeScript.compile appjs, bare: true

    handlebars_files.each do |file|
      appjs << "\nEmber.TEMPLATES['#{ File.basename file, '.handlebars' }'] = Ember.Handlebars.compile('\\"
      File.new(file).each_line do |line|
        appjs << line.gsub("\n", "\\\n").gsub("'", "\\'") unless line.chomp.empty?
      end
      appjs << "');\n"
    end

    File.open('app.js', 'w') { |file| puts '  wrote app.js' if file.write appjs }
  end
end

namespace :dev do
  desc 'Initialize development -- do this after a git clone!'
  task :init do
    sh 'bundle exec bourbon install --path=vendor'
    Rake::Task['compile'].reenable
    Rake::Task['compile'].invoke
  end

  desc 'Start the server at http://localhost:8925/'
  task server: ['compile'] do
    puts 'Starting server at http://localhost:8925/ now...'
    sh 'bundle exec rackup -p 8925', verbose: false
  end

  desc 'Watch all assets to compile on changes (development)'
  task :watch do
    WATCHERS = [:sass, :coffee, :templates]
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
    desc 'Watch only the sass/ directory'
    task :sass do
      check_dirs %w[css sass]
      on_change_of_folder 'sass' do
        sh 'sass --update sass:css --style expanded --line-numbers --line-comments', verbose: false
      end
    end

    desc 'Watch only the coffee/ directory'
    task :coffee do
      on_change_of_folder 'coffee' do
        Rake::Task['compile:app.js'].execute
      end
    end

    desc 'Watch only the templates/ directory'
    task :templates do
      on_change_of_folder 'templates' do
        Rake::Task['compile:app.js'].execute
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

