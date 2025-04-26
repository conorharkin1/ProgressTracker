namespace ProgressTracker.Models;

public class LargeTask : Task {

    // Room to add unique attributes in future.
    
    public LargeTask() {}
    
    public LargeTask(string name, DateTime dueDate) :base(name, dueDate)
    {
        Objectives = new Objective[6];
    }
}