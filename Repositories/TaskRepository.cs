using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using ProgressTracker.Data;
using ProgressTracker.Models;
using DbTask = ProgressTracker.Models.Task;

namespace ProgressTracker.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly DataContext _dbContext;

        public TaskRepository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddTask(DbTask task)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteTask(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<DbTask>> GetAllTasks()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<DbTask>> GetLargeTasks()
        {
            var largeTasks = await _dbContext.Tasks.Where(t => t.TaskType == "Large").ToListAsync();
            return largeTasks;
        }

        public Task<IEnumerable<DbTask>> GetMediumTasks()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<DbTask>> GetSmallTasks()
        {
            throw new NotImplementedException();
        }

        public async Task<DbTask> GetTaskById(int id)
        {
            var task = await _dbContext.Tasks.FindAsync(id);
            if (task == null)
            {
                throw new TaskNotFoundException(id);
            }

            return task;
        }

        public async Task<bool> UpdateTask(DbTask task)
        {
            throw new NotImplementedException();
        }
    }

    public class TaskNotFoundException : Exception
    {
        public TaskNotFoundException(int id)
            : base($"Task with ID {id} not found.") { }
    }
}

