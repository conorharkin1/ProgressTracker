
using Microsoft.AspNetCore.Identity;
using ProgressTracker.Data;

namespace ProgressTracker.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserEncryptionService _encryptionService;
        private IHttpContextAccessor _httpContextAccessor;

        public UserRepository(UserManager<ApplicationUser> userManager, IUserEncryptionService encryptionService, IHttpContextAccessor httpContextAccessor )
        {
            _userManager = userManager;
            _encryptionService = encryptionService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string?> GetCanvasApiKey()
        {
            var claimsPrincipal = _httpContextAccessor.HttpContext?.User;
            if (claimsPrincipal != null)
            {
                var user = await _userManager.GetUserAsync(claimsPrincipal);
                if (user?.CanvasApiKey != null)
                {
                    try
                    {
                        return _encryptionService.Decrypt(user.CanvasApiKey);
                    }
                    catch
                    {
                        return null;
                    }
                }
                return null;
            }
            return null;
        }

        public async Task UpdateCanvasApiKey(string canvasApiKey)
        {
            var claimsPrincipal = _httpContextAccessor.HttpContext?.User;
            if (claimsPrincipal != null)
            {
                var user = await _userManager.GetUserAsync(claimsPrincipal);
                if (user != null)
                {
                    var encryptedKey = _encryptionService.Encrypt(canvasApiKey);
                    user.CanvasApiKey = encryptedKey;
                    await _userManager.UpdateAsync(user);
                }
            }
        }

    }
}