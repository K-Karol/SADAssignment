module.exports = {
    "id" : "/Fullname",
    "type" : "object",
    "properties" : {
        "firstname" : {"type" : "string"},
        "middlenames" : {"type" : "string"},
        "lastname" : {"type" : "string"}
    },
    "required" : ["firstname", "lastname"],
    "additionalProperties": false
};