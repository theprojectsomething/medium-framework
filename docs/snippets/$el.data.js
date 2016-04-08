// gets a previously set value
var value = $el.data( key );

// sets data and returns $el
/***
	@[key]: this can be a string or an object of {key: value} pairs
	@[value]: if `key` is a string, `value` is required
*/
$el.data( key , [value] );