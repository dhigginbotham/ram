var RAM = require('..');
var expect = require('expect.js');

describe('ram node embedded object cache tests', function () {

  var ram = new RAM();

  var firstObject = {
    ts: Date.now(),
    data: 'store'
  };

  it('should have defaults set', function (done) {

    expect(ram._cache.length).to.eql(0);
    expect(ram.limit).to.eql(2000);

    return done();

  });

  it('should be able to add an object to the cache', function (done) {

    ram.add(firstObject, function (data) {

      expect(ram._cache.length).to.eql(1);
      expect(data._id).to.eql(0);

      return done();

    });

  });

  it('should be able to get our cache object', function (done) {

    ram.get(firstObject, function (data) {

      expect(ram._cache.length).to.eql(1);
      expect(data._id).to.eql(0);

      return done();

    });

  });

  it('should be able to get the cache length', function (done) {

    var ln = ram.len();
    expect(ln).to.eql(ram._cache.length);

    return done();

  });

  it('should be able to delete a cache item', function (done) {

    ram.del(firstObject, function (err) {

      expect(ram._cache.length).to.eql(0);

      return done();

    });

  });

  it('should add 100 items to cache', function (done) {

    for (var i=0;i<100;++i) {

      ram.add({item: i}, function (data) {
        expect(data.item).to.eql(i);
      });

      if (ram.len() == 100) {
        return done();
      };

    };

  });

});