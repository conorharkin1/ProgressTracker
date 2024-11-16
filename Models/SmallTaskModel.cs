namespace ProgressTracker.Models;

public class SmallTaskModel {
    public string Name {get; set;}
    public List<Objective>? Objectives;

    public SmallTaskModel(string name, List<Objective>? objectives = null) {
        Name = name;
        Objectives = objectives;
    }

}