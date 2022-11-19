namespace BlazorAdminPanel.Models
{
    public class CourseImport
    {
        public CourseDetails[] Courses { get; set; }
    }
    public class CourseDetails
    {
        public string identifier { get; set; }
        public string name { get; set; }
        public string yearOfEntry { get; set; }
        public string courseLeader { get; set; } //username
        public string[] modules { get; set; } //module.identifier
        public string[] students { get; set; } //username
    }
}
