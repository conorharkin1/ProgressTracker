using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProgressTracker.Models;

namespace ProgressTracker.Controllers;

public class HomeController : Controller
{
    public HomeController()
    {

    }

    public IActionResult Tracker()
    {
        // Fetch all Small, Medium, Large tasks and pass them to the view.
        return View();
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
