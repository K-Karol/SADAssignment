module.exports = {
    "id" : "/Course",
    "type" : "object",
    "properties" : {
        "name" : {"type" : "string"},
        "yearOfEntry" : {"type" : "string"},
        "courseLeader" : {"type" : "string"},
        "modules" : {
            "type" : "array",
            "items" : {
                    "type" : "string"
                }
        },
        "students" : {
            "type" : "array",
            "items" : {
                    "type" : "string"
                }
        }
    },
    "required" : ["name", "yearOfEntry", "courseLeader"],
    "additionalProperties": false
};