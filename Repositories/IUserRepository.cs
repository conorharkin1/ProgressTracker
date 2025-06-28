namespace ProgressTracker.Repositories
{
    public interface IUserRepository
    {
        public Task UpdateCanvasApiKey(string canvasApiKey);
        public Task<string?> GetCanvasApiKey();
    }
}
