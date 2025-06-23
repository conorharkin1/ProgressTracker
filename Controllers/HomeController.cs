using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Models.ViewModels;
using ProgressTracker.Models;
using ProgressTracker.Repositories;
using DbTask = ProgressTracker.Models.Task;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ProgressTracker.Controllers;
[Authorize]
public class HomeController : Controller
{
    private readonly ITaskRepository _taskRepository;
    public HomeController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IActionResult> Tracker()
    {
        var model = new TasksViewModel 
        {
            SmallTasks = await _taskRepository.GetSmallTasks(),
            MediumTasks = await _taskRepository.GetMediumTasks(),
            LargeTask = await _taskRepository.GetLargeTask(),
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
