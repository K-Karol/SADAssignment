namespace BlazorAdminPanel.Models
{

    public class Cohort
    {
        public string identifier { get; set; }
        public string[] students { get; set; }
    }

    public class ModuleImport
    {
        public ModuleDetails[] Modules { get; set; }
    }

    public class ModuleDetails
    {
        public string identifier { get; set; }
        public string name { get; set; }
        public string year { get; set; }
        public string semester { get; set; }
        public string[] students { get; set; } //usernames!
        public Cohort[] cohorts { get; set; }
        public string moduleLeader { get; set; } //for now assume ID till I add import of staff members
        public string[] instructors { get; set; }
    }
}
    