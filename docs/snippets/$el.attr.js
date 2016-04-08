// gets a previously set attribute
var attr = $( selector ).attr( name );

// sets an attribute or list of atributes and returns $( selector )
/***
	@[name]: this can be a string or {name: value} pairs
	@[value]: this is required if `name` is a string
*/
$( selector ).attr( name , [value] );