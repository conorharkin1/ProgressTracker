namespace ProgressTracker.Models.ViewModels
{
    public class TasksViewModel {
        public List<SmallTask>? SmallTasks { get; set; }
        public List<MediumTask>? MediumTasks { get; set; }
        public LargeTask? LargeTask { get; set; }
    }
}