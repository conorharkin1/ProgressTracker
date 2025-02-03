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
            SmallTasks = new SmallTask[]
            {
                new SmallTask(1, "Small Task 1", 30),
                new SmallTask(2, "Small Task 2", 45),
                new SmallTask(3, "Small Task 3", 60),
                new SmallTask(4, "Small Task 4", 120)
            },
            MediumTasks = new MediumTask[]
            {
                new MediumTask(1, "test1", 200),
                new MediumTask(2, "Test2", 200)
            },
            LargeTask = new LargeTask(1, "temp", 600)
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
