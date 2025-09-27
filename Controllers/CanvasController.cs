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
    private readonly ICanvasRepository _canvasRepository;

    public CanvasController(ITaskRepository taskRepository, IHttpClientFactory httpClientFactory, IUserRepository userRepository, UserManager<ApplicationUser> userManager, ICanvasRepository canvasRepository)
    {
        _taskRepository = taskRepository;
        _httpClientFactory = httpClientFactory;
        _userRepository = userRepository;
        _userManager = userManager;
        _canvasRepository = canvasRepository;
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

        await _canvasRepository.Sync(userId);

        return Ok(new { message = "Successfully Synced" });
    }
}