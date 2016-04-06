var xhr = XHR.request({
    url: "string",
    [type="GET"]: "string",
    [data]: "string"|{object},
    [complete, error, progress, abort]: fn(response: "string"|{object}, xhr),
    [header="application/json;charset=UTF-8"]: "string"
});