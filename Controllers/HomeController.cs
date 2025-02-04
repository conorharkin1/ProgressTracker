using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Models.ViewModels;
using ProgressTracker.Models;

namespace ProgressTracker.Controllers;

public class HomeController : Controller
{
    public HomeController()
    {

    }

    public IActionResult Tracker()
    {
        // var model = new TasksViewModel 
        // {
        //     SmallTasks = _taskRepository.GetSmallTasks(),
        //     MediumTasks = _taskRepository.GetMediumTasks(),
        //     LargeTask = _taskRepository.GetLargeTasks(),
        // };
        // return View(model);

        var model = new TasksViewModel
        {
            SmallTasks = new List<SmallTask>
            {
                new SmallTask(1, "Small Task 1", 30),
                new SmallTask(2, "Small Task 2", 45),
            },
            MediumTasks = new List<MediumTask>
            {
                new MediumTask(1, "Medium Task 1", 300)
            },
            

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
