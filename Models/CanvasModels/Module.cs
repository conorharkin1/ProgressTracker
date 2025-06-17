namespace ProgressTracker.Models.CanvasModels
{
    public class Module
    {
        public int id { get; set; }
        public string name { get; set; }
        List<ModuleItem>? items { get; set; }
    }

    public class ModuleItem
    {
        public int id { get; set; }
        public int module_id { get; set; }
        public int position { get; set; }
        public string title { get; set; }
        public Module_Item_Type type { get; set; }
        public string html_url { get; set; }

    }

    public enum Module_Item_Type
    {
        File,
        Discussion,
        Assignment,
        Quiz
    }
}