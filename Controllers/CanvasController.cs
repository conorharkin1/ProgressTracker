using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Repositories;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ProgressTracker.Models.CanvasModels;

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
        var httpClient = _httpClientFactory.CreateClient();
        httpClient.BaseAddress = new Uri("https://canvas.qub.ac.uk/");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configuration["canvas-api-access-token"]);

        //Gets all my previous courses
        var allCourses = await httpClient.GetFromJsonAsync<List<Course>>("/api/v1/users/self/courses");

        //Gets my current enrolments
        var enrolments = await httpClient.GetFromJsonAsync<List<Enrolment>>("/api/v1/users/self/enrollments");

        var currentCourses = new List<Course>();
        foreach (var enrolment in enrolments)
        {
            var tempCourse = allCourses.FirstOrDefault(c => c.id == enrolment.course_id);
            if (tempCourse != null)
            {
                currentCourses.Add(tempCourse);
            }
        }

        List<Assignment> allAssignments = new List<Assignment>();
        List<Module> allModules = new List<Module>();

        if (currentCourses.Any())
        {
            foreach (var course in currentCourses)
            {
                var assignments = await httpClient.GetFromJsonAsync<List<Assignment>>($"/api/v1/courses/{course.id}/assignments");
                var modules = await httpClient.GetFromJsonAsync<List<Module>>($"/api/v1/courses/{course.id}/modules?include[]=items");
                allAssignments.AddRange(assignments);
                allModules.AddRange(modules);
            }
        }

        return Ok(new { message = "Successfully Synced" });
    }
}