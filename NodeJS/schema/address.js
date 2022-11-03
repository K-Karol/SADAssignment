module.exports = {
    "id" : "/Address",
    "type" : "object",
    "properties" : {
        "addressLine1" : {"type" : "string"},
        "addressLine2" : {"type" : "string"},
        "addressLine3" : {"type" : "string"},
        "addressLine4" : {"type" : "string"},
        "postcode" : {"type" : "string"},
        "city" : {"type" : "string"},
        "country" : {"type" : "string"}
    },
    "required" : ["addressLine1", "postcode", "city", "country"],
    "additionalProperties": false
};
