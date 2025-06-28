using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Repositories;
using System.Net.Http.Headers;
using ProgressTracker.Models.CanvasModels;
using DbTask = ProgressTracker.Models.Task;
using ProgressTracker.Models;
using Microsoft.AspNetCore.Identity;
using ProgressTracker.Data;
using System.Net;
using ProgressTracker.Models.Dtos;

[ApiController]
[Route("api/[controller]")]
public class CanvasController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IUserRepository _userRepository;
    private readonly UserManager<ApplicationUser> _userManager;

    public CanvasController(ITaskRepository taskRepository, IHttpClientFactory httpClientFactory, IUserRepository userRepository, UserManager<ApplicationUser> userManager)
    {
        _taskRepository = taskRepository;
        _httpClientFactory = httpClientFactory;
        _userRepository = userRepository;
        _userManager = userManager;
    }

    [HttpPost("setKey")]
    public async Task<IActionResult> SetCanvasApiKey([FromBody] CanvasApiKeyDto dto)
    {
        if (!string.IsNullOrEmpty(dto.CanvasApiKey))
        {
            await _userRepository.UpdateCanvasApiKey(dto.CanvasApiKey);

            return Ok(new { message = "Successfully updated canvas api key" });
        }

        return BadRequest();
    }

    [HttpGet("sync")]
    public async Task<IActionResult> SyncCanvas()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }
        var userId = user.Id;

        // If there is a large task in the system firstly delete it as I currently only have 1 enrolment which I am creating a Large Task for
        var existingLargeTask = await _taskRepository.GetLargeTask(userId);
        if (existingLargeTask != null)
        {
            await _taskRepository.DeleteTask(existingLargeTask.Id);
        }

        var decryptedCanvasApiKey = await _userRepository.GetCanvasApiKey();

        if (string.IsNullOrEmpty(decryptedCanvasApiKey))
        {
            return NotFound("Could not retrieve API key");
        }

        var httpClient = _httpClientFactory.CreateClient();
        httpClient.BaseAddress = new Uri("https://canvas.qub.ac.uk/");
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", decryptedCanvasApiKey);

        try
        {
            // Attempt a call to profile endpoint to check if key works
            var profileResponse = await httpClient.GetAsync("/api/v1/users/self/profile");

            if (!profileResponse.IsSuccessStatusCode)
            {
                if (profileResponse.StatusCode == HttpStatusCode.Unauthorized || profileResponse.StatusCode == HttpStatusCode.Forbidden)
                {
                    return Unauthorized("Canvas API key is invalid or expired.");
                }

                return StatusCode((int)profileResponse.StatusCode, "Invalid API Key provided");
            }

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
                            TaskType = "LARGE",
                            UserId = userId
                        }, userId);
                    }
                }
            }

            return Ok(new { message = "Successfully Synced" });
        }
        catch (HttpRequestException ex)
        {
            // For network errors, timeouts, DNS issues, etc.
            return StatusCode(503, $"Network error while contacting Canvas: {ex.Message}");
        }
        catch (Exception ex)
        {
            // For unexpected bugs or JSON deserialization issues
            return StatusCode(500, $"Unexpected error: {ex.Message}");
        }
    }
}