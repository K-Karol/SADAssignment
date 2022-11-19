using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BlazorAdminPanel.Models
{
    public class ModuleProcessed
    {
        //[System.Text.Json.Serialization.JsonIgnore]
        //[DataMember(Name ="identifier")]
        //public string Identifier { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public string ObjectId { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("name")]
        public string Name { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("year")]
        public string Year { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("semester")]
        public string Semester { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("students")]
        public string[] Students { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("cohorts")]
        public Models.Cohort[] Cohorts { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("moduleLeader")]
        public string ModuleLeader { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("instructors")]
        public string[] Instructors { get; set; }

    }
}
