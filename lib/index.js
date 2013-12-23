var ms = require('ms');
var _ = require('lodash');

// ram is an embedded object store, 
// with an easy to remember api
var ram = function (opts) {

  this.limit = 2000;
  this.expired = '1d';
  this.stale = '23h';

  if (opts) _.merge(this, opts);

  var self = this;

  this._cache = [];
  
  this.get = function (query, modifier, fn) {
    if ((typeof fn == 'undefined') 
    && (typeof modifier != 'undefined') 
    && (_.isFunction(modifier))) {
        var fn = modifier,
            modifier = {};
    };
    
    var keys = Object.keys(query);
    var index = this.collectionIndex(keys[0], query[keys[0]]);

    return (fn) ? fn(this._cache[index]) : this._cache[index];
  };
  
  this.add = function (query, modifier, fn) {
    
    if (this.len() == this.limit) {
      this._cache.splice(this.len()-1,1);
    };

    if ((typeof fn == 'undefined') 
    && (typeof modifier != 'undefined') 
    && (_.isFunction(modifier))) {
        var fn = modifier,
            modifier = {};
    };
    this._constructObjectTree(query, function (collection) {
      self._cache.push(collection);
      return (fn) ? fn(collection) : collection;
    });
  };

  this.del = function (query, modifier, fn) {
    if ((typeof fn == 'undefined') 
    && (typeof modifier != 'undefined') 
    && (_.isFunction(modifier))) {
        var fn = modifier,
            modifier = {};
    };
    
    var keys = Object.keys(query);
    var index = this.collectionIndex(keys[0], query[keys[0]]);

    this._cache.splice(index,1);

    return (fn) ? fn(false) : false;
  };

  this.len = function () {
    return this._cache.length;
  };

  this.reset = function () {
    this._cache = [];
  }

  return this;

};

ram.prototype.watchCacheObjects = function (fn) {

};

ram.prototype.doCacheManagement = function (fn) {

};

ram.prototype._constructObjectTree = function (data, fn) {
  var self = this;
  var defaultCollection = {
    stale: Date.now() + ms(self.stale),
    expires: Date.now() + ms(self.expired),
    _id: self.len(),
    _created: Date.now()
  };

  var collection = _.merge({}, data, defaultCollection);

  return (fn) ? fn(collection) : collection;
};

ram.prototype.collectionIndex = function (key, val) {
  var ln = this.len();
  if (ln) {
    for (var i=0;i<ln;++i) {
      return (this._cache[i][key] == val) ? i : void 0;
    };
  };
};

module.exports = ram;