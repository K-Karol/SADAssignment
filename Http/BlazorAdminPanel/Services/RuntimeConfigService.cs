namespace BlazorAdminPanel.Services
{
    public class RuntimeConfigService : IRuntimeConfigService
    {
        private RuntimeConfiguration? _runtimeConfiguration = null;
        private Blazored.LocalStorage.ILocalStorageService _localStorageService;

        public RuntimeConfigService(Blazored.LocalStorage.ILocalStorageService localStorageService)
        {
            _localStorageService = localStorageService;
            
            // I could make this process dynamic and do it automatically but there is no point for just 1 config value

        }

        public async Task<RuntimeConfiguration> GetRuntimeConfiguration()
        {
            if(_runtimeConfiguration is null)
            {
                bool isKeyAvailable = await _localStorageService.ContainKeyAsync(nameof(RuntimeConfiguration.APIKey));
                if (isKeyAvailable)
                {
                    _runtimeConfiguration = new RuntimeConfiguration(await _localStorageService.GetItemAsStringAsync(nameof(RuntimeConfiguration.APIKey)));
                }
                else
                {
                    _runtimeConfiguration = new RuntimeConfiguration();
                }
                
            }

            return _runtimeConfiguration;

        }

        public async Task SaveRuntimeConfiguration()
        {
            if(_runtimeConfiguration is null)
            {
                throw new Exception("Runtime configuration was not yet fetched");
            }

            if (_runtimeConfiguration!.IsDirty)
            {
                foreach(var prop in _runtimeConfiguration.DirtyFields)
                {
                    var pi = typeof(RuntimeConfiguration).GetProperty(prop);
                    if (pi is null) throw new Exception($"Failed to get property {prop}");
                    object? value = pi.GetValue(_runtimeConfiguration);
                    await _localStorageService.SetItemAsStringAsync(pi.Name, value is null ? "" : (string)value);
                }
                _runtimeConfiguration.ClearDirty();
            }
        }
    }
}
