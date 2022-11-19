namespace BlazorAdminPanel.Models
{
    public class UserImport
    {
        public UserDetails[] Users { get; set; }
    }

    public class UserDetails
    {
        public string username { get; set; }
        public string password { get; set; }
        public Fullname fullname { get; set; }
        public Address address { get; set; }
        public string[] roles { get; set; }
    }

    public class Fullname
    {
        public string firstname { get; set; }
        public string? middlenames { get; set; }
        public string lastname { get; set; }
    }

    public class Address
    {
        public string addressLine1 { get; set; }
        public string? addressLine2 { get; set; }
        public string? addressLine3 { get; set; }
        public string? addressLine4 { get; set; }
        public string postcode { get; set; }
        public string city { get; set; }
        public string country { get; set; }
    }
}
