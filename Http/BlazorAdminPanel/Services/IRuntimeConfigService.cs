using System.ComponentModel;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace BlazorAdminPanel.Services
{

    [System.AttributeUsage(System.AttributeTargets.Property, Inherited = false, AllowMultiple = true)]
    public class LocalStorageAttribute : Attribute
    {
    }

    public class RuntimeConfiguration : INotifyPropertyChanged
    {
        public RuntimeConfiguration(string apiKey = "")
        {
            _apiKey = apiKey;
        }


        private string _apiKey = string.Empty;
        [LocalStorage]
        public string APIKey
        {
            get => _apiKey;
            set => SetProperty(ref _apiKey, value);
        }

        public bool IsDirty { get; private set; }
        private List<string> _dirtyFields = new List<string>();
        public List<string> DirtyFields => _dirtyFields;

        public void ClearDirty()
        {
            IsDirty = false;
            _dirtyFields.Clear();
        }

        protected bool SetProperty<T>(ref T backingStore, T value,
             [CallerMemberName] string propertyName = "",
             Action? onChanged = null)
        {
            if (EqualityComparer<T>.Default.Equals(backingStore, value))
                return false;

            backingStore = value;
            onChanged?.Invoke();
            OnPropertyChanged(propertyName);
            IsDirty = true;
            _dirtyFields.Add(propertyName);
            return true;
        }

        #region INotifyPropertyChanged
        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string propertyName = "")
        {
            var changed = PropertyChanged;
            if (changed is null)
                return;

            changed.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        #endregion

    }

    public interface IRuntimeConfigService
    {
        Task<RuntimeConfiguration> GetRuntimeConfiguration();
        Task SaveRuntimeConfiguration();
    }
}
