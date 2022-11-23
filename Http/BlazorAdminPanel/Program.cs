using BlazorAdminPanel;
using BlazorDownloadFile;
using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.AspNetCore.Components.WebAssembly.Http;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

#if DEBUG
    builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("https://localhost/") });
#else
    builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri((new Uri(builder.HostEnvironment.BaseAddress)).GetLeftPart(UriPartial.Authority)) });
#endif

builder.Services.AddScoped<BlazorAdminPanel.Services.IAPIService, BlazorAdminPanel.Services.APIService>();
builder.Services.AddBlazorDownloadFile(lifetime: ServiceLifetime.Scoped);
builder.Services.AddBlazoredLocalStorage();
builder.Services.AddScoped<BlazorAdminPanel.Services.IRuntimeConfigService, BlazorAdminPanel.Services.RuntimeConfigService>();

var app = builder.Build();

await app.RunAsync();
