var xhr = XHR.post({
    url: "string",
    [data]: "string"|{object},
    [complete, error, progress, abort]: fn(response: "string"|{object}, xhr),
    [header="application/json;charset=UTF-8"]: "string"
});