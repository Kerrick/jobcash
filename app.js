/*global Ember:false, accounting:false */

var App, utils;

App = Ember.Application.create({
  VERSION: '0.1.0',
  NAME: 'Jobcash',
  LOG_TRANSITIONS: true
});

Ember.Application.initializer({
  name: 'versions',
  initialize: function() {
    'use strict';

    Ember.debug('Accounting.VERSION : ' + accounting.version);
    Ember.debug(App.NAME + '.VERSION : ' + App.VERSION);
    Ember.debug('-------------------------------');
  }
});

utils = function(){ 'use strict'; return true; };

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
  'use strict';

  var matrices, parts;
  matrices = [];
  parts = uri.split('&');

  parts.forEach(function(part) {
    var pairs, params;
    pairs = part.split(';');
    params = {};
    pairs.forEach(function(pair) {
      var split, value;
      split = pair.split('=');
      value = split[1];
      if (!isNaN(value)) { value = +value; }
      params[split[0]] = value;
    });
    matrices.push(params);
  });

  return matrices;
};

/*
 * Builds a segment of a Matrix URI from an array of objects.
 * @param   {Object}   ...  One or more objects with keys and values
 * @return  {String}        The Matrix URI segment that was built
 * @method
 * @example                 Using utils.parseMatrixURI
 *          utils.parseMatrixURI({one: 'two', three: 'four'}, {five: 'six', seven: 'eight'});
 *          //=> 'one=two;three=four&five=six;seven=eight'
 */
utils.buildMatrixURI = function() {
  'use strict';

  var arr, str;
  if (arguments.length === 0) {
    return '';
  } else if (arguments.length === 1) {
    arr = [arguments[0]];
  } else {
    arr = Array.prototype.slice.call(arguments);
  }
  str = '';

  arr.forEach(function(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value;
        value = obj[key];
        if (typeof value === 'string' || typeof value === 'number') {
          str += key + '=' + value.toString() + ';';
        } else if (typeof value === 'undefined') {
          str += key + ';';
        }
      }
    }
    str = utils.chomp(str, ';') + '&';
  });

  return utils.chomp(str, '&');
};

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
  'use strict';

  var negChLength;
  if (arguments.length < 2) { chompString = "\n"; }
  negChLength = -1 * chompString.length;
  if (wholeString.slice(negChLength) !== chompString) { return wholeString; }

  return wholeString.slice(0, negChLength);
};

App.Router = Ember.Router.extend({
  location: 'history'
});

App.Router.map(function() {
  'use strict';

  this.route('comparison', { path: '/compare/:jobs' });
  this.route('job', { path: '/job/:stats' });
});

App.Job = Ember.Object.extend();

App.JobRoute = Ember.Route.extend({
  model: function(params) {
    'use strict';
    return utils.parseMatrixURI(params.stats)[0];
  },
  serialize: function(model) {
    'use strict';
    return { stats: utils.buildMatrixURI(model) };
  }
});

App.JobController = Ember.ObjectController.extend({
  salary: function() {
    'use strict';
    return accounting.formatMoney(this.get('content.salary'));
  }.property('content.salary')
});

App.ComparisonRoute = Ember.Route.extend({
  model: function(params) {
    'use strict';

    var jobs = [];
    utils.parseMatrixURI(params.jobs).forEach(function(job) {
      jobs.push( App.Job.create(job) );
    });

    return jobs;
  },
  serialize: function(model) {
    'use strict';
    return { jobs: utils.buildMatrixURI.apply(model) };
  }
});

App.ComparisonController = Ember.ArrayController.extend({
  itemController: 'job'
});

