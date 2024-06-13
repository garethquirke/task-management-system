public interface ILogService : IDisposable {
    void LogHighPriority(LogEvent logEvent);
}

public class LogService : ILogService {

    public LogService() {}

    public void Dispose()
    {
        throw new NotImplementedException();
    }

    public void LogHighPriority(LogEvent logEvent)
    {
        throw new NotImplementedException();
    }
}