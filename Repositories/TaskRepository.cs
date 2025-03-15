using ProgressTracker.Data;

namespace ProgressTracker.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly DataContext _dbContext;

        public TaskRepository(DataContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public Task<Models.Task> AddTask(Models.Task task)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteTask(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Models.Task>> GetAllTasks()
        {
            throw new NotImplementedException();
        }

        public Task<Models.Task> GetTaskById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Models.Task> UpdateTask(Models.Task task)
        {
            throw new NotImplementedException();
        }
    }
}

