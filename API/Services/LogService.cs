public interface ILogService {
    void LogHighPriority(LogEvent logEvent);
}

public class LogService : ILogService {

    public LogService() {}

    public void LogHighPriority(LogEvent logEvent)
    {
        throw new NotImplementedException();
    }
}