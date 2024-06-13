using System.ComponentModel.DataAnnotations;

public sealed class Task {

    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = new("");
    public string Description { get; set; } = new("");
    public Priority Priority { get; set; }
    public DateTime DueDate {get; set;}
    public Status Status{ get; set; }
}
