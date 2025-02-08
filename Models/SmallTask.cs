namespace ProgressTracker.Models;

public class SmallTask : Task {    

    // Room to add unique attributes in future.
    
    public SmallTask() {}
    
    public SmallTask(int id ,string name, int totalTime) :base(id, name, totalTime)
    {
        Objectives = new Objective[3];
    }
}