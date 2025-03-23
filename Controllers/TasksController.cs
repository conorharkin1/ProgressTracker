using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Repositories;
using DbTask = ProgressTracker.Models.Task;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;

    public TasksController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    [HttpPost]
    public async Task<IActionResult> AddTask([FromBody] DbTask task)
    {
        try
        {
            await _taskRepository.AddTask(task);
            return Ok(new { message = "Task saved successfully" });
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

    //[HttpPut("{id}")]  for update
    //[HttpDelete("{id}")]  for delete
}