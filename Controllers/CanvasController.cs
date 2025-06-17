using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Repositories;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ProgressTracker.Models.CanvasModels;
using DbTask = ProgressTracker.Models.Task;
using ProgressTracker.Models;

[ApiController]
[Route("api/[controller]")]
public class CanvasController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public CanvasController(ITaskRepository taskRepository, IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _taskRepository = taskRepository;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpGet("sync")]
    public async Task<IActionResult> SyncCanvas()
    {
        // If there is a large task in the system firstly delete it as I currently only have 1 enrolment which I am creating a Large Task for
        var existingLargeTask = await _taskRepository.GetLargeTask();
        if (existingLargeTask != null)
        {
            await _taskRepository.DeleteTask(existingLargeTask.Id);
        }

        var httpClient = _httpClientFactory.CreateClient();
        httpClient.BaseAddress = new Uri("https://canvas.qub.ac.uk/");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configuration["canvas-api-access-token"]);

        //Gets all my previous courses
        var allCourses = await httpClient.GetFromJsonAsync<List<Course>>("/api/v1/users/self/courses");
        //Gets my current enrolments
        var enrolments = await httpClient.GetFromJsonAsync<List<Enrolment>>("/api/v1/users/self/enrollments");

        var currentCourses = new List<Course>();
        currentCourses.AddRange(allCourses.Where(c => enrolments.Any(e => e.course_id == c.id)));

        if (currentCourses.Any())
        {
            foreach (var course in currentCourses)
            {
                var assignments = await httpClient.GetFromJsonAsync<List<Assignment>>($"/api/v1/courses/{course.id}/assignments");
                var modules = await httpClient.GetFromJsonAsync<List<Module>>($"/api/v1/courses/{course.id}/modules?include[]=items");

                var objectives = new List<Objective>();
                if (assignments != null && assignments.Count > 0)
                {
                    foreach (var assignment in assignments)
                    {
                        objectives.Add(new Objective
                        {
                            Name = assignment.name,
                            Hours = assignment.due_at.HasValue ? (int)(assignment.due_at - DateTime.Now).Value.TotalHours : 5,
                            IsComplete = assignment.has_submitted_submissions
                        });
                    }

                    await _taskRepository.AddTask(new DbTask
                    {
                        Name = course.name,
                        DueDate = assignments.Where(a => a.due_at.HasValue).Min(a => a.due_at.Value),
                        Objectives = objectives,
                        TaskType = "LARGE"
                    });
                }
            }
        }

        return Ok(new { message = "Successfully Synced" });
    }
}