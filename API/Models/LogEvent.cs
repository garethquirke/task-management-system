public class LogEvent {
    public HttpCode Code {get; set;}
    public string EndPoint {get; set;} = new("");
    public Priority Priority {get; set;}
    public Task Task {get; set;}
}