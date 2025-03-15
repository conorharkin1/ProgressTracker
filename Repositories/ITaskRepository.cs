using Task = ProgressTracker.Models.Task;
namespace ProgressTracker.Repositories
{
    public interface ITaskRepository
    {
        Task<Task> UpdateTask(Task task);
        Task<Task> GetTaskById(int id);
        Task<IEnumerable<Task>> GetAllTasks();
        Task<Task> AddTask(Task task);
        Task<bool> DeleteTask(int id);
    }
}