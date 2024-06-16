using Microsoft.AspNetCore.HttpLogging;

internal sealed class RequestLogging : IHttpLoggingInterceptor
{
    public RequestLogging() {}

    public ValueTask OnRequestAsync(HttpLoggingInterceptorContext logContext)
    {
        Console.WriteLine("FUUK");
        var logInfo = $"Request: {logContext.HttpContext.Request.Method} {logContext.HttpContext.Request.Path}";
        WriteMessageToLogFile(logInfo);

        return ValueTask.CompletedTask;
    }

    public ValueTask OnResponseAsync(HttpLoggingInterceptorContext logContext)
    {
        var logInfo = $"Response Status Code: {logContext.HttpContext.Response.StatusCode}";
        WriteMessageToLogFile(logInfo);

        return ValueTask.CompletedTask;
    }

    private void WriteMessageToLogFile(string message)
    {
        string logFilePath = @".\log.txt";
        string directoryPath = Path.GetDirectoryName(logFilePath);

        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }

        using (StreamWriter writer = File.AppendText(@".\log.txt"))
        {
            writer.WriteLine($"{DateTime.Now} - {message}");
        }
    }
}
