namespace ProgressTracker.Models;

public class Task {
    public string? Name { get; set; }
    public DateTime? DueDate { get; set; }
    public Objective[]? Objectives { get; set; }

    public Task() {}

    public Task(string name, DateTime duedate)
    {
        Name = name;
        DueDate = duedate;
        Objectives = [];
    }
}