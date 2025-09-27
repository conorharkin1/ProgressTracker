namespace ProgressTracker.Repositories
{
    public interface ICanvasRepository
    {
        public Task Sync(string userId);
        
    }
}
