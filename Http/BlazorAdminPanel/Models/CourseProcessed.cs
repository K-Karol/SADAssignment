using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BlazorAdminPanel.Models
{
    public class CourseProcessed
    {
        [System.Text.Json.Serialization.JsonIgnore]
        public string ObjectId { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("name")]
        public string Name { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("yearOfEntry")]
        public string YearOfEntry { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("courseLeader")]
        public string CourseLeader { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public ModuleProcessed[] ModulesProcessed { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("modules")]
        public string[] Modules => ModulesProcessed.Select((mp) => mp.ObjectId).ToArray();
        [System.Text.Json.Serialization.JsonPropertyName("students")]
        public string[] Students { get; set; }
    }
}
