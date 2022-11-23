using BlazorAdminPanel.Models;
using System;
using System.Text;

namespace BlazorAdminPanel.Services
{
    public class APIResponse
    {
        public bool Success { get; set; }
        public string? Error { get; set; }
        public string? Response { get; set; }
    }

    public class APIService : IAPIService
    {
        //private readonly ILogger _logger;
        private readonly HttpClient _httpClient;
        private readonly IRuntimeConfigService _runtimeConfigService;

        public APIService(HttpClient httpClient, IRuntimeConfigService runtimeConfigService)
        {
            _httpClient = httpClient;
            _runtimeConfigService = runtimeConfigService;
        }

        public async Task CreateAdminUser(string username, string password, string firstName, string lastName)
        {
            var payload = new
            {
                username = username,
                password = password,
                fullname = new { firstname = firstName, lastname = lastName },
                address = new
                {
                    addressLine1 = "addressLine1",
                    postcode = "A12 3BC",
                    city = "Sheffield",
                    country = "UK"
                }

            };

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri("api/admin/createAdminUser", UriKind.Relative),
                Method = HttpMethod.Post,
            };
            request.Headers.Add("X-API-Key", $"{(await _runtimeConfigService.GetRuntimeConfiguration()).APIKey}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload, options: new System.Text.Json.JsonSerializerOptions() { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                APIResponse? errorResponse = null;
                try
                {
                    errorResponse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(errorResult);
                }
                catch
                {

                }

                throw new Exception($"HttpRequest failed with the status code {response.StatusCode} and the error message: {(errorResponse is null ? "N/A" : errorResponse.Error ?? "N/A")}");
            }
        }

        public async Task<string> CreateCourse(CourseProcessed course)
        {
            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri("api/admin/courses", UriKind.Relative),
                Method = HttpMethod.Post,
            };
            request.Headers.Add("X-API-Key", $"{(await _runtimeConfigService.GetRuntimeConfiguration()).APIKey}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(course, options: new System.Text.Json.JsonSerializerOptions() { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                APIResponse? errorResponse = null;
                try
                {
                    errorResponse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(errorResult);
                }
                catch
                {

                }

                throw new Exception($"HttpRequest failed with the status code {response.StatusCode} and the error message: {(errorResponse is null ? "N/A" : errorResponse.Error ?? "N/A")}");
            }

            var stringResponse = await response.Content.ReadAsStringAsync();

            APIResponse? apiResonse = null;
            try
            {
                apiResonse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(stringResponse);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to deserialise incoming response", ex);
            }

            if (apiResonse is null)
            {
                throw new Exception($"Failed to deserialise incoming response / null");
            }


            return apiResonse.Response ?? throw new Exception("ID not returned from HTTPS response");
        }

        public async Task<string> CreateModule(ModuleProcessed module)
        {
            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri("api/admin/modules", UriKind.Relative),
                Method = HttpMethod.Post,
            };
            request.Headers.Add("X-API-Key", $"{(await _runtimeConfigService.GetRuntimeConfiguration()).APIKey}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(module, options: new System.Text.Json.JsonSerializerOptions() { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                APIResponse? errorResponse = null;
                try
                {
                    errorResponse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(errorResult);
                }
                catch
                {

                }

                throw new Exception($"HttpRequest failed with the status code {response.StatusCode} and the error message: {(errorResponse is null ? "N/A" : errorResponse.Error ?? "N/A")}");
            }

            var stringResponse = await response.Content.ReadAsStringAsync();

            APIResponse? apiResonse = null;
            try
            {
                apiResonse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(stringResponse);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to deserialise incoming response", ex);
            }

            if (apiResonse is null)
            {
                throw new Exception($"Failed to deserialise incoming response / null");
            }


            return apiResonse.Response ?? throw new Exception("ID not returned from HTTPS response");
        }

        public async Task<string> CreateUser(UserDetails userDetails)
        {

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri("api/admin/users", UriKind.Relative),
                Method = HttpMethod.Post,
            };
            request.Headers.Add("X-API-Key", $"{(await _runtimeConfigService.GetRuntimeConfiguration()).APIKey}");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(userDetails, options: new System.Text.Json.JsonSerializerOptions() { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                APIResponse? errorResponse = null;
                try
                {
                    errorResponse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(errorResult);
                }
                catch
                {

                }

                throw new Exception($"HttpRequest failed with the status code {response.StatusCode} and the error message: {(errorResponse is null ? "N/A" : errorResponse.Error ?? "N/A")}");
            }

            var stringResponse = await response.Content.ReadAsStringAsync();

            APIResponse? apiResonse = null;
            try
            {
                apiResonse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(stringResponse);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to deserialise incoming response", ex);
            }

            if (apiResonse is null)
            {
                throw new Exception($"Failed to deserialise incoming response / null");
            }


            return apiResonse.Response ?? throw new Exception("ID not returned from HTTPS response");
        }
    }
}
