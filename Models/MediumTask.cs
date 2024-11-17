namespace ProgressTracker.Models;

public class MediumTask : Task {

    // Room to add unique attributes in future.
    
    public MediumTask() {}
    
    public MediumTask(int id ,string name, int totalTime) :base(id, name, totalTime)
    {
        Objectives = new Objective[4];
    }
}