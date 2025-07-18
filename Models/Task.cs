using System.Text.Json.Serialization;
using ProgressTracker.Data;

namespace ProgressTracker.Models;

public class Task {
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime DueDate { get; set; }
    public ICollection<Objective>? Objectives { get; set; }
    public string? TaskType { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    public Task()
    {
    }

    public Task(string name, DateTime duedate)
    {
        Name = name;
        DueDate = duedate;
        Objectives = new List<Objective>();
    }
}