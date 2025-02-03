namespace ProgressTracker.Models;

public class Task {
    public int Id { get; set; }
    public string? Name { get; set; }
    public int? TotalTime { get; set; }
    protected Objective[]? Objectives { get; set; }

    public Task() {}

    public Task(int id, string name, int totalTime)
    {
        Id = id;
        Name = name;
        TotalTime = totalTime;
        Objectives = [];
    }
}