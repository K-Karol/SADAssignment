using BlazorAdminPanel;
using BlazorDownloadFile;
using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri((new Uri(builder.HostEnvironment.BaseAddress)).GetLeftPart(UriPartial.Authority)) });
builder.Services.AddSingleton<BlazorAdminPanel.Services.IAPIService, BlazorAdminPanel.Services.APIService>();
builder.Services.AddBlazorDownloadFile(lifetime: ServiceLifetime.Scoped);
builder.Services.AddBlazoredLocalStorage();
builder.Services.AddSingleton<BlazorAdminPanel.Services.IRuntimeConfigService, BlazorAdminPanel.Services.RuntimeConfigService>();
var app = builder.Build();


await app.RunAsync();
