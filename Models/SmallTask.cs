namespace ProgressTracker.Models;

public class SmallTask : Task {    

    // Room to add unique attributes in future.
    
    public SmallTask() {}
    
    public SmallTask(string name, DateTime dueDate) :base(name, dueDate)
    {
        Objectives = new Objective[3];
    }
}