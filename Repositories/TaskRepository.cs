using Microsoft.AspNetCore.Identity;
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

        public async Task<DbTask> AddTask(DbTask task, string userId)
        {
            if (task == null)
            {
                throw new ArgumentNullException(nameof(task), "Task cannot be null.");
            }

            try
            {
                task.UserId = userId;
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

        public async Task<DbTask> GetLargeTask(string userId)
        {
            var largeTask = await _dbContext.Tasks.Where(t => t.TaskType == "LARGE" && t.UserId == userId).Include(t => t.Objectives).FirstOrDefaultAsync();
            if (largeTask == null)
            {
                return new LargeTask();
            }
            return largeTask;
        }

        public async Task<List<DbTask>> GetMediumTasks(string userId)
        {
            var mediumTasks = await _dbContext.Tasks.Where(t => t.TaskType == "MEDIUM" && t.UserId == userId).Include(mt => mt.Objectives).ToListAsync();
            return mediumTasks;
        }

        public async Task<List<DbTask>> GetSmallTasks(string userId)
        {
            var smallTasks = await _dbContext.Tasks.Where(t => t.TaskType == "SMALL" && t.UserId == userId).Include(st => st.Objectives).ToListAsync();
            return smallTasks;
        }

        public async Task<DbTask> GetTaskById(int id)
        {
            var task = await _dbContext.Tasks.FindAsync(id);

            if (task == null)
            {
                throw new TaskNotFoundException(id);
            }

            task.Objectives = await _dbContext.Objectives.Where(o => o.TaskId == id).ToListAsync();

            return task;
        }

        public async Task<DbTask> UpdateTask(DbTask task)
        {
            var taskToUpdate = await _dbContext.Tasks.Include(t => t.Objectives).Where(t => t.Id == task.Id).FirstOrDefaultAsync();
            if (taskToUpdate == null)
            {
                throw new ArgumentNullException(nameof(task), "Task cannot be null.");
            }

            if (taskToUpdate.Objectives?.Count > 0)
            {
                _dbContext.Objectives.RemoveRange(taskToUpdate.Objectives);
            }

            taskToUpdate.Name = task.Name;
            taskToUpdate.DueDate = task.DueDate;
            taskToUpdate.Objectives = task.Objectives;

            if (task.Objectives != null)
            {
                taskToUpdate.Objectives = task.Objectives
                    .Select(o => new Objective
                    {
                        Name = o.Name,
                        Hours = o.Hours,
                        IsComplete = o.IsComplete,
                        TaskId = taskToUpdate.Id
                    })
                    .ToList();
            }

            try
            {
                await _dbContext.SaveChangesAsync();
                return taskToUpdate;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving the task.", ex);
            }
        }

        public async Task<bool> UpdateObjective(Objective objective)
        {
            var dbObjective = await _dbContext.Objectives.Where(o => o.Id == objective.Id).FirstOrDefaultAsync();
            if (dbObjective == null)
            {
                return false;
            }

            dbObjective.IsComplete = objective.IsComplete;

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

