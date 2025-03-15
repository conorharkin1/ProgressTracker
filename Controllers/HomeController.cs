using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Models.ViewModels;
using ProgressTracker.Models;
using ProgressTracker.Repositories;

namespace ProgressTracker.Controllers;

public class HomeController : Controller
{
    private readonly ITaskRepository _taskrepository;
    public HomeController(ITaskRepository taskRepository)
    {
        _taskrepository = taskRepository;
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
                new SmallTask("Small Task", DateTime.MaxValue)
                {
                    Objectives =
                    [
                        new Objective("Objective 1", 5, false),
                        new Objective("Objective 2", 3, true),
                        new Objective("Objective 3", 2, false)
                    ]
                },
                new SmallTask("Small Task", DateTime.MaxValue)
                {
                    Objectives =
                    [
                        new Objective("OBJ1")
                    ]   
                }
            },
            MediumTasks = new List<MediumTask>
            {
                new MediumTask("Medium Task", DateTime.MaxValue)
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
