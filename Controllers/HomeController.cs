using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Models.ViewModels;
using ProgressTracker.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ProgressTracker.Data;

namespace ProgressTracker.Controllers;
[Authorize]
public class HomeController : Controller
{
    private readonly ITaskRepository _taskRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    public HomeController(ITaskRepository taskRepository, UserManager<ApplicationUser> userManager)
    {
        _taskRepository = taskRepository;
        _userManager = userManager;
    }

    public async Task<IActionResult> Tracker()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }
        var userId = user.Id;

        var model = new TasksViewModel 
        {
            SmallTasks = await _taskRepository.GetSmallTasks(userId),
            MediumTasks = await _taskRepository.GetMediumTasks(userId),
            LargeTask = await _taskRepository.GetLargeTask(userId),
        };
        return View(model);        
    }
    public IActionResult Focus()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
