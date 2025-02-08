namespace ProgressTracker.Models;

public class LargeTask : Task {

    // Room to add unique attributes in future.
    
    public LargeTask() {}
    
    public LargeTask(int id ,string name, int totalTime) :base(id, name, totalTime)
    {
        Objectives = new Objective[10];
    }
}