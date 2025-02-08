namespace ProgressTracker.Models;

public class Objective {
    public string? Name { get; set; }
    public int Hours { get; set; }
    public bool IsComplete { get; set; }

    public Objective(string name, int hours = 0, bool isComplete = false)
    {
        Name = name;
        Hours = hours;
        IsComplete = isComplete;
    }
    
    public Objective()
    {
        
    }

}