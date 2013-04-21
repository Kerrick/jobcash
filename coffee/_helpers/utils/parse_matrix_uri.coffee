# Parses a segment of a Matrix URI into an array of objects.
# @param   {String}  uri   The string to be parsed
# @return  {Array}         An array of objects with keys and values
# @method
# @example                 Using utils.parseMatrixURI
#          utils.parseMatrixURI('one=two;three=four&five=six;seven=eight');
#          //=> [{one: 'two', three: 'four'}, {five: 'six', seven: 'eight'}]
utils.parseMatrixURI = (uri) ->
  matrices = []
  parts = uri.split '&'

  for part in parts
    pairs = part.split ';'
    params = {}

    for pair in pairs
      split = pair.split '='
      value = split[1]
      value = +value unless isNaN value
      params[split[0]] = value

    matrices.push params

  matrices

