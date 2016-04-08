// gets a previously set value
var value = $( selector ).data( key );

// sets data and returns $( selector )
/***
	@[key]: this can be a string or {key: value} pairs
	@[value]: this is required if `key` is a string
*/
$( selector ).data( key , [value] );