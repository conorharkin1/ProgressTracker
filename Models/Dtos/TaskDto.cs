namespace ProgressTracker.Models.Dtos
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DueDate { get; set; }
        public ICollection<Objective>? Objectives { get; set; }
        public string? TaskType { get; set; }
    }
}