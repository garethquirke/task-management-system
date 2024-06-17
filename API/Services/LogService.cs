using System.Text;

public interface ILogService
{
    void LogHighPriority(LogEvent logEvent);
}

public class LogService : ILogService
{

    public LogService() { }

    public void LogHighPriority(LogEvent logEvent)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"HTTP Code: {logEvent.Code.ToString()}");
        sb.AppendLine($"EndPoint: {logEvent.EndPoint}");
        sb.AppendLine($"Priority: {logEvent.Priority}");
        sb.AppendLine($"Task Name: {logEvent.Task.Title}");

        WriteMessageToLogFile(sb.ToString());
    }

    private void WriteMessageToLogFile(string message)
    {
        string logFilePath = @".\HIGH_PRIORITY.txt";
        string directoryPath = Path.GetDirectoryName(logFilePath);

        if (string.IsNullOrEmpty(directoryPath))
        {
            directoryPath = Directory.GetCurrentDirectory();
        }

        using (StreamWriter writer = File.AppendText(logFilePath))
        {
            writer.WriteLine($"{DateTime.Now} - {message}");
            writer.Flush();
        }
    }
}