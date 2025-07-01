using ProgressTracker.Models;
using DbTask = ProgressTracker.Models.Task;
using Objective = ProgressTracker.Models.Objective;
namespace ProgressTracker.Repositories
{
    public interface ITaskRepository
    {
        Task<DbTask> AddTask(DbTask task, string userId);
        Task<DbTask> GetTaskById(int id);
        Task<IEnumerable<DbTask>> GetAllTasks();
        Task<DbTask> UpdateTask(DbTask task);
        Task<bool> UpdateObjective(Objective objective);
        Task<bool> DeleteTask(int id);
        Task<List<DbTask>> GetSmallTasks(string userId);
        Task<List<DbTask>> GetMediumTasks(string userId);
        Task<DbTask> GetLargeTask(string userId);
    }
}