namespace ProgressTracker.Models.ViewModels
{
    public class TasksViewModel {
        public SmallTask[] SmallTasks { get; set; }
        public MediumTask[] MediumTasks { get; set; }
        public LargeTask LargeTask { get; set; }
    }
}