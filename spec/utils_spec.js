/*jshint globalstrict:true */
/*global jasmine:false, spyOn:false, it:false, xit:false, expect:false, runs:false, waits:false, waitsFor:false, beforeEach:false, afterEach:false, describe:false, xdescribe:false, */
/*global utils:false */

'use strict';

describe('The app utilities', function() {
  describe('The Matrix URI utility', function() {
    var matrixString, matrixArray;
    matrixString = 'red=ted;blue=2;orange&apple=pie;starfruit;orange=marmalade';
    matrixArray = [{red: 'ted', blue: 2, orange: undefined}, {apple: 'pie', starfruit: undefined, orange: 'marmalade'}];
  
    it('returns an empty string when called with no arguments', function() {
      expect(utils.buildMatrixURI()).toBe('');
    });

    it('can serialize a single object inta a matrix URI string', function() {
      expect(utils.buildMatrixURI(matrixArray[0])).toBe(matrixString.split('&')[0]);
    });

    it('can serialize multiple objects into a matrix URI string', function() {
      expect(utils.buildMatrixURI.apply(null, matrixArray)).toBe(matrixString);
    });

    it('can deserialize a matrix URI string from an array of objects', function() {
      expect(utils.parseMatrixURI(matrixString)).toEqual(matrixArray);
    });
  });

  describe('The chomp utility', function() {
    it('will chomp off a newline by default', function() {
      expect(utils.chomp('hello')).toBe('hello');
      expect(utils.chomp('hello\n')).toBe('hello');
      expect(utils.chomp('hello\n\n')).toBe('hello\n');
    });

    it('will chomp a given string off the end', function() {
      expect(utils.chomp('hello', 'llo')).toBe('he');
    });

    it('will not chomp off anything if it does not match', function() {
      expect(utils.chomp('hello', 'there')).toBe('hello');
    });
  });
});

