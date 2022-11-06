namespace BlazorAdminPanel.Services
{
    public interface IAPIService
    {
        Task CreateAdminUser(string username, string password, string firstName, string lastName);
    }
}
