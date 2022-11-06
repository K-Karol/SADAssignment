﻿using System;
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
        private readonly string _apikey;

        public APIService(HttpClient httpClient, string apikey)
        {
            _httpClient = httpClient;
            _apikey = apikey;
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
            request.Headers.Add("Authorization", "App 05d04171-22ec-4d45-ac26-459acf6919d6");
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorResult = await response.Content.ReadAsStringAsync();
                APIResponse? errorResponse = null;
                try
                {
                    errorResponse = System.Text.Json.JsonSerializer.Deserialize<APIResponse>(errorResult);
                } catch
                {

                }

                throw new Exception($"HttpRequest failed with the status code {response.StatusCode}", errorResponse is null ? null : new Exception(errorResponse.Error ?? "N/A"));
            }
        }
    }
}