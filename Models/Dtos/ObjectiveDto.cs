namespace ProgressTracker.Models.Dtos
{
    public class ObjectiveDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Hours { get; set; }
        public bool IsComplete { get; set; }
    }
}