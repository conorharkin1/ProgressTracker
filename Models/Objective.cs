using System.Text.Json.Serialization;

namespace ProgressTracker.Models;

public class Objective {
    public int Id { get; set; }
    public string Name { get; set; }
    public int Hours { get; set; }
    public bool IsComplete { get; set; }
    //FK
    public int TaskId { get; set; }
    [JsonIgnore]
    public Task? Task { get; set; }

    public Objective(string name, int hours = 0, bool isComplete = false)
    {
        Name = name;
        Hours = hours;
        IsComplete = isComplete;
    }
    
    public Objective()
    {
        Name = "";
    }

}