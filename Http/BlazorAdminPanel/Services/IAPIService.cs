namespace BlazorAdminPanel.Services
{
    public interface IAPIService
    {
        Task CreateAdminUser(string username, string password, string firstName, string lastName);
        Task<string> CreateUser(Models.UserDetails userDetails);
        Task<string> CreateModule(Models.ModuleProcessed module);
        Task<string> CreateCourse(Models.CourseProcessed course);
    }
}
