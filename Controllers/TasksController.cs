using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Data;
using ProgressTracker.Models;
using ProgressTracker.Models.Dtos;
using ProgressTracker.Repositories;
using DbTask = ProgressTracker.Models.Task;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;
    private readonly UserManager<ApplicationUser> _userManager;

    public TasksController(ITaskRepository taskRepository, UserManager<ApplicationUser> userManager)
    {
        _taskRepository = taskRepository;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> AddTask([FromBody] TaskDto taskDto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var task = MapToEntityForCreation(taskDto, user.Id);

        try
        {
            var createdTask = await _taskRepository.AddTask(task, user.Id);
            return Ok(MapToDto(createdTask));
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while adding the task.");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        try
        {
            var task = await _taskRepository.GetTaskById(id);
            return Ok(task);
        }
        catch (TaskNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while fetching the task.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask([FromBody] TaskDto taskDto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }
        var task = MapToEntityForUpdate(taskDto, user.Id);

        try
        {
            var updatedTask = await _taskRepository.UpdateTask(task);
            return Ok(MapToDto(updatedTask));
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while updating the task.");
        }
    }

    [Route("objective")]
    [HttpPut]
    public async Task<IActionResult> UpdateObjective([FromBody] Objective objective)
    {
        bool updated = await _taskRepository.UpdateObjective(objective);
        if (!updated)
        {
            return NotFound();
        }
        return Ok(new { message = "Objective updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        bool deleted = await _taskRepository.DeleteTask(id);
        if (!deleted)
        {
            return NotFound();
        }
        return Ok(new { message = "Task deleted successfully" });
    }

    private TaskDto MapToDto(DbTask task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Name = task.Name,
            DueDate = task.DueDate,
            TaskType = task.TaskType,
            Objectives = task.Objectives?
                .Select(o => new ObjectiveDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Hours = o.Hours,
                    IsComplete = o.IsComplete
                })
                .ToList()
        };
    }

    private DbTask MapToEntityForUpdate(TaskDto taskDto, string userId)
    {
        return new DbTask
        {
            Id = taskDto.Id,
            Name = taskDto.Name,
            DueDate = taskDto.DueDate,
            TaskType = taskDto.TaskType,
            UserId = userId,
            Objectives = taskDto.Objectives?
                .Select(dto => new Objective
                {
                    Id = dto.Id,
                    Name = dto.Name,
                    Hours = dto.Hours,
                    IsComplete = dto.IsComplete
                })
                .ToList()
        };
    }
    
    private DbTask MapToEntityForCreation(TaskDto taskDto, string userId)
    {
        return new DbTask
        {
            Name = taskDto.Name,
            DueDate = taskDto.DueDate,
            TaskType = taskDto.TaskType,
            UserId = userId,
            Objectives = taskDto.Objectives?
                .Select(dto => new Objective
                {
                    Id = dto.Id,
                    Name = dto.Name,
                    Hours = dto.Hours,
                    IsComplete = dto.IsComplete
                })
                .ToList()
        };
    }
}