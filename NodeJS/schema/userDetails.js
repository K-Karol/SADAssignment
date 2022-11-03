module.exports = {
    "id" : "/UserRegistrationDetails",
    "type" : "object",
    "properties" : {
        "username" : {"type" : "string"},
        "password" : {"type" : "string"},
        "fullname" : {"type" : "/Fullname", "$ref" : "/Fullname"},
        "address" : {"type" : "/Address", "$ref" : "/Address"}
    },
    "required" : ["username", "fullname", "address"],
    "additionalProperties": false
};