App = Ember.Application.create({
  VERSION: '0.1.0',
  NAME: 'Jobcash',
  LOG_TRANSITIONS: true
});

utils = function(){ return true };

/*
 * Parses a segment of a Matrix URI into an array of objects.
 * @param   {String}  uri   The string to be parsed
 * @return  {Array}         An array of objects with keys and values
 * @method
 * @example                 Using utils.parseMatrixURI
 *          utils.parseMatrixURI('one=two;three=four&five=six;seven=eight');
 *          //=> [{one: 'two', three: 'four'}, {five: 'six', seven: 'eight'}]
 */
utils.parseMatrixURI = function(uri) {
  var matrices, parts;
  matrices = [];
  parts = uri.split('&');
  parts.forEach(function(part) {
    var pairs, params;
    pairs = part.split(';');
    params = {};
    pairs.forEach(function(pair) {
      var keyValue;
      keyValue = pair.split('=');
      params[keyValue[0]] = keyValue[1];
    });
    matrices.push(params);
  });
  return matrices;
}

/*
 * Builds a segment of a Matrix URI from an array of objects.
 * @param   {Array}   arr   An array of objects with keys and values
 * @return  {String}        The Matrix URI segment that was built
 * @method
 * @example                 Using utils.parseMatrixURI
 *          utils.parseMatrixURI([{one: 'two', three: 'four'}, {five: 'six', seven: 'eight'}]);
 *          //=> 'one=two;three=four&five=six;seven=eight'
 */
utils.buildMatrixURI = function(arr) {
  str = ''
  arr.forEach(function(obj) {
    for (var key in obj) {
      value = obj[key];
      str += key;
      if (value !== undefined) { str += '=' + value; }
      str += ';';
    }
    str = utils.chomp(str, ';') + '&'
  });
  return utils.chomp(str, '&')
}

/*
 * Chomps something (by default, a newline) off of the end of a string.
 * Inspired by ruby's String#chomp
 * @param   {String}  wholeString     The string to be chomped
 * @param   {String}  [chompString]   What to chomp off of wholeString -- defaults to "\n"
 * @method
 * @example                           Using utils.chomp
 *          utils.chomp("hello")
 *          //=> "hello"
 *          utils.chomp("hello\n")
 *          //=> "hello"
 *          utils.chomp("hello", "llo")
 *          //=> "he"
 *          utils.chomp("hello", "there")
 *          //=> "hello"
 */
utils.chomp = function(wholeString, chompString) {
  if (arguments.length < 2) {
    chompString = "\n"
  }
  if (wholeString.slice(-1 * chompString.length) === chompString) {
    return wholeString.slice(0, -1 * chompString.length);
  } else {
    return wholeString;
  }
}

App.Router = Ember.Router.extend({
  location: 'history',
});

App.Router.map(function() {
  this.route('comparison', { path: '/compare/:jobs' });
});

App.ComparisonRoute = Ember.Route.extend({
  model: function(params) {
    jobs = [];
    utils.parseMatrixURI(params.jobs).forEach(function(job) {
      jobs.push(job); // Actually, push a new Job.
    });
    console.log(jobs);
    return jobs;
  },
  serialize: function(model) {
    return { jobs: utils.buildMatrixURI(model) };
  }
});
