using BlazorAdminPanel;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

var baseAddress = builder.Configuration.GetValue<string>("BaseUrl");
var apiKey = builder.Configuration.GetValue<string>("ApiKey");

if(string.IsNullOrEmpty(baseAddress) || string.IsNullOrEmpty(apiKey))
{
    baseAddress = "https://localhost/";
    apiKey = "05d04171-22ec-4d45-ac26-459acf6919d6";
}

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(baseAddress) });
builder.Services.AddSingleton<BlazorAdminPanel.Services.IAPIService>(sp => (BlazorAdminPanel.Services.IAPIService)ActivatorUtilities.CreateInstance(sp, typeof(BlazorAdminPanel.Services.APIService), apiKey));

var app = builder.Build();


await app.RunAsync();
