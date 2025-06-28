using Microsoft.AspNetCore.DataProtection;

namespace ProgressTracker.Repositories
{
    public class UserEncryptionService : IUserEncryptionService
    {
        private readonly IDataProtector _protector;

        public UserEncryptionService(IDataProtectionProvider provider)
        {
            _protector = provider.CreateProtector("CanvasApiKeyProtector");
        }
        public string Encrypt(string plaintext)
        {
            return _protector.Protect(plaintext);
        }

        public string Decrypt(string encrypted)
        {
            return _protector.Unprotect(encrypted);
        }
    }
}