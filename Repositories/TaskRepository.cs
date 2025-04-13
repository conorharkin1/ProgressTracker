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

        public async Task<DbTask> AddTask(DbTask task)
        {
            if (task == null)
            {
                throw new ArgumentNullException(nameof(task), "Task cannot be null.");
            }

            try 
            {
                _dbContext.Tasks.Add(task);
                await _dbContext.SaveChangesAsync();
                return task;
            } 
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving the task.", ex);
            }
        }

        public async Task<bool> DeleteTask(int id)
        {
            var task = await _dbContext.Tasks.FindAsync(id);
            if (task == null)
            {
                return false;
            }

            _dbContext.Tasks.Remove(task);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<DbTask>> GetAllTasks()
        {
            throw new NotImplementedException();
        }

        public async Task<DbTask> GetLargeTask()
        {
            var largeTask = await _dbContext.Tasks.Where(t => t.TaskType == "LARGE").Include(t => t.Objectives).FirstOrDefaultAsync();
            if (largeTask == null )
            {
                return new LargeTask();
            }
            return largeTask;
        }

        public async Task<List<DbTask>> GetMediumTasks()
        {
            var mediumTasks = await _dbContext.Tasks.Where(t => t.TaskType == "MEDIUM").Include(mt => mt.Objectives).ToListAsync();
            return mediumTasks;
        }

        public async Task<List<DbTask>> GetSmallTasks()
        {
            var smallTasks = await _dbContext.Tasks.Where(t => t.TaskType == "SMALL").Include(st => st.Objectives).ToListAsync();
            return smallTasks;
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
            var taskToUpdate = await _dbContext.Tasks.FindAsync(task.Id);
            if (taskToUpdate == null)
            {
                return false;
            }

            taskToUpdate.Id = task.Id;
            taskToUpdate.Name = task.Name;
            taskToUpdate.DueDate = task.DueDate;
            taskToUpdate.Objectives = task.Objectives;
            taskToUpdate.TaskType = task.TaskType;

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }

    public class TaskNotFoundException : Exception
    {
        public TaskNotFoundException(int id)
            : base($"Task with ID {id} not found.") { }
    }
}

