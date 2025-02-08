namespace ProgressTracker.Models;

public class MediumTask : Task {

    // Room to add unique attributes in future.
    
    public MediumTask() {}
    
    public MediumTask(string name, DateTime dueDate) :base(name, dueDate)
    {
        Objectives = new Objective[6];
    }
}