namespace BlazorAdminPanel.Models
{
    public class UserImportResult
    {
        public string UserName { get; set; }
        public bool SuccessfullyImported { get; set; }
        public string Error { get; set; }
        public string Id { get; set; }
    }
}
