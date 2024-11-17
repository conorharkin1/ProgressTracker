namespace ProgressTracker.Models.ViewModels;

public class SmallTaskModel {
    public string Name {get; set;}
    public int Hours { get; set; }  
    public Objective[]? Objectives {get; set;}

    public SmallTaskModel(string name, int hours, Objective[]? objectives) {
        Name = name;
        Hours = hours;
        Objectives = objectives;
    }

}