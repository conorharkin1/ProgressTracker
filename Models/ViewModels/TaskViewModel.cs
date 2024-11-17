namespace ProgressTracker.Models.ViewModels;

public class TaskViewModel {
    public string? Name {get; set;}
    public int? Hours { get; set; }  
    public List<Objective>? Objectives {get; set;}

}