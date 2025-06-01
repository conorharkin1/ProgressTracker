namespace ProgressTracker.Models.CanvasModels
{
    public class Assignment
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? description { get; set; }
        public DateTime? due_at { get; set; }
        public int course_id { get; set; }
        public string? html_url { get; set; }
        public bool has_submitted_submissions { get; set; }
    }
}