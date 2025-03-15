using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Repositories;
using DbTask = ProgressTracker.Models.Task;

[ApiController]
[Route("api/tasks/")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;

    public TasksController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    [HttpPost]
    [Route("add")]
    public async Task<IActionResult> AddTask([FromBody] DbTask task)
    {
        try
        {
            await _taskRepository.AddTask(task);
            return Ok(); // Return 200 OK if successful
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while adding the task."); // Return 500 on error
        }
    }
}