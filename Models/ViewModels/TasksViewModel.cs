namespace ProgressTracker.Models.ViewModels
{
    public class TasksViewModel {
        public List<SmallTask> SmallTasks { get; set; } = new List<SmallTask>();
        public List<MediumTask> MediumTasks { get; set; } = new List<MediumTask>();
        public LargeTask LargeTask { get; set; } = new LargeTask();
    }
}