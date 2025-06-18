using ProgressTracker.Models;
using DbTask = ProgressTracker.Models.Task;
using Objective = ProgressTracker.Models.Objective;
namespace ProgressTracker.Repositories
{
    public interface ITaskRepository
    {
        Task<DbTask> AddTask(DbTask task);
        Task<DbTask> GetTaskById(int id);
        Task<IEnumerable<DbTask>> GetAllTasks();
        Task<bool> UpdateTask(DbTask task);
        Task<bool> UpdateObjective(Objective objective);
        Task<bool> DeleteTask(int id);
        Task<List<DbTask>> GetSmallTasks();
        Task<List<DbTask>> GetMediumTasks();
        Task<DbTask> GetLargeTask();
    }
}