var cloned = _.clone(
    a: array|object,
    [b]: array|object,
    [deep=false]: bool,
    [transform]: fn(a[ i ]: *, i: int, b: array|object),
    [defaults]: array|object
);