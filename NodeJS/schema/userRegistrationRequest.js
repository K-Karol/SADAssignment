module.exports = {
    "id" : "/UserRegistrationRequest",
    "type" : "object",
    "properties" : {
        "generatePassword" : {"type" : "boolean"},
        "userDetails" : {"type" : "/UserRegistrationDetails", "$ref" : "/UserRegistrationDetails"}
    },
    "required" : ["generatePassword", "userDetails"],
    "additionalProperties": false
};