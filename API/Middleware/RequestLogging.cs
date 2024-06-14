// https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-logging/?view=aspnetcore-8.0#ihttplogginginterceptor
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

internal sealed class RequestLogging : IHttpLoggingInterceptor
{
    private readonly ILogger<RequestLogging> _logger;

    public RequestLogging(ILogger<RequestLogging> logger)
    {
        _logger = logger;
    }

    public async Task OnRequestAsync(HttpLoggingInterceptorContext logContext)
    {
        _logger.LogInformation($"Request: {logContext.HttpContext.Request.Method} {logContext.HttpContext.Request.Path}");

        if (logContext.IsAnyEnabled(HttpLoggingFields.RequestBody))
        {
            using var reader = new StreamReader(logContext.HttpContext.Request.Body);
            var body = await reader.ReadToEndAsync();
            _logger.LogInformation($"Request Body: {body}");
            logContext.HttpContext.Request.Body.Position = 0;
        }

        EnrichRequest(logContext);
    }

    public async Task OnResponseAsync(HttpLoggingInterceptorContext logContext)
    {
        _logger.LogInformation($"Response Status Code: {logContext.HttpContext.Response.StatusCode}");

        if (logContext.IsAnyEnabled(HttpLoggingFields.ResponseBody))
        {
            logContext.HttpContext.Response.Body.Seek(0, SeekOrigin.Begin);
            using var reader = new StreamReader(logContext.HttpContext.Response.Body);
            var body = await reader.ReadToEndAsync();
            _logger.LogInformation($"Response Body: {body}");
            logContext.HttpContext.Response.Body.Position = 0;
        }

        EnrichResponse(logContext);
    }

    private void EnrichRequest(HttpLoggingInterceptorContext logContext)
    {
        logContext.AddParameter("RequestEnrichment", "ExtraRequestInfo");
    }

    private void EnrichResponse(HttpLoggingInterceptorContext logContext)
    {
        logContext.AddParameter("ResponseEnrichment", "ExtraResponseInfo");
    }
}