var xhr = XHR.get({
    url: string,
    [data]: string|object,
    [complete, error, progress, abort]: fn(response: "string"|{object}, xhr),
});