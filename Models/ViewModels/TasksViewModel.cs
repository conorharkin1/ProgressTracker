namespace ProgressTracker.Models.ViewModels
{
    public class TasksViewModel {
        public IEnumerable<Task> SmallTasks { get; set; } = new List<Task>();
        public IEnumerable<Task> MediumTasks { get; set; } = new List<Task>();
        public Task LargeTask { get; set; } = new Task();
    }
}