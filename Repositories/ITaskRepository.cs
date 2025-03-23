using DbTask = ProgressTracker.Models.Task;
namespace ProgressTracker.Repositories
{
    public interface ITaskRepository
    {
        Task<DbTask> AddTask(DbTask task);
        Task<DbTask> GetTaskById(int id);
        Task<IEnumerable<DbTask>> GetAllTasks();
        Task<bool> UpdateTask(DbTask task);
        Task<bool> DeleteTask(int id);
        Task<IEnumerable<DbTask>> GetSmallTasks();
        Task<IEnumerable<DbTask>> GetMediumTasks();
        Task<IEnumerable<DbTask>> GetLargeTasks();
    }
}