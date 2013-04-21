var App, utils,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

utils = function() {
  return true;
};

utils.buildMatrixURI = function() {
  var key, object, objects, str, value, _i, _len;

  objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (objects.length === 0) {
    return '';
  }
  str = '';
  for (_i = 0, _len = objects.length; _i < _len; _i++) {
    object = objects[_i];
    for (key in object) {
      if (!__hasProp.call(object, key)) continue;
      value = object[key];
      if (typeof value === 'string' || typeof value === 'number') {
        str += "" + key + "=" + value + ";";
      } else if (typeof value === 'undefined') {
        str += "" + key + ";";
      }
    }
    str = "" + (utils.chomp(str, ';')) + "&";
  }
  return utils.chomp(str, '&');
};

utils.chomp = function(wholeString, chompString) {
  var negChompLength;

  if (chompString == null) {
    chompString = "\n";
  }
  negChompLength = -1 * chompString.length;
  if (wholeString.slice(negChompLength) !== chompString) {
    return wholeString;
  } else {
    return wholeString.slice(0, negChompLength);
  }
};

utils.parseMatrixURI = function(uri) {
  var matrices, pair, pairs, params, part, parts, split, value, _i, _j, _len, _len1;

  matrices = [];
  parts = uri.split('&');
  for (_i = 0, _len = parts.length; _i < _len; _i++) {
    part = parts[_i];
    pairs = part.split(';');
    params = {};
    for (_j = 0, _len1 = pairs.length; _j < _len1; _j++) {
      pair = pairs[_j];
      split = pair.split('=');
      value = split[1];
      if (!isNaN(value)) {
        value = +value;
      }
      params[split[0]] = value;
    }
    matrices.push(params);
  }
  return matrices;
};

App = Ember.Application.create({
  VERSION: '0.1.0',
  NAME: 'Jobcash',
  LOG_TRANSITIONS: true
});

Ember.Application.initializer({
  name: 'versions',
  initialize: function() {
    Ember.debug("Accounting.VERSION : " + accounting.version);
    Ember.debug("" + App.NAME + ".VERSION : " + App.VERSION);
    return Ember.debug('-------------------------------');
  }
});

App.ComparisonController = Ember.ArrayController.extend({
  itemController: 'job'
});

App.JobController = Ember.ObjectController.extend({
  salary: (function() {
    return accounting.formatMoney(this.get('content.salary'));
  }).property('content.salary')
});

App.Job = Ember.Object.extend();

App.Router = Ember.Router.extend({
  location: 'history'
});

App.Router.map(function() {
  this.route('comparison', {
    path: '/compare/:jobs'
  });
  return this.route('job', {
    path: '/job/:stats'
  });
});

App.JobRoute = Ember.Route.extend({
  model: function(params) {
    return utils.parseMatrixURI(params.stats)[0];
  },
  serialize: function(model) {
    return {
      stats: utils.buildMatrixURI(model)
    };
  }
});

App.ComparisonRoute = Ember.Route.extend({
  model: function(params) {
    var job, _i, _len, _ref, _results;

    _ref = utils.parseMatrixURI(params.jobs);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      job = _ref[_i];
      _results.push(App.Job.create(job));
    }
    return _results;
  },
  serialize: function(model) {
    return {
      jobs: utils.buildMatrixURI.apply(model)
    };
  }
});
