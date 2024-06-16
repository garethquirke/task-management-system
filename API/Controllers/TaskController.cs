using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase
{
    private ILogService _logService;
    private TaskContext _taskContext;


    public TaskController(ILogService logService, TaskContext taskContext)
    {
        _logService = logService;
        _taskContext = taskContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _taskContext.Tasks.ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(int id)
    {
        var task = await _taskContext.Tasks.FirstOrDefaultAsync(x => x.Id == id);
        if (task == null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(Task task)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var logEvent = GetLogEvent(HttpCode.PUT, "/task", task);

        if (task.Priority == Priority.High)
        {
            _logService.LogHighPriority(logEvent);
        }

        _taskContext.Tasks.Add(task);
        await _taskContext.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _taskContext.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        _taskContext.Tasks.Remove(task);
        await _taskContext.SaveChangesAsync();

        return Ok();
    }


    // https://learn.microsoft.com/en-us/aspnet/core/data/ef-mvc/crud?view=aspnetcore-8.0#alternative-httppost-edit-code-create-and-attach
    [HttpPut("tasks/{id}")]
    public async Task<IActionResult> UpdateTask(int id, Task updatedTask)
    {
        if (id != updatedTask.Id || !ModelState.IsValid)
        {
            return BadRequest();
        }

        _taskContext.Entry(updatedTask).State = EntityState.Modified;

        try
        {
            if (updatedTask.Priority == Priority.High)
            {
                var logEvent = GetLogEvent(HttpCode.PUT, "/task", updatedTask);
                _logService.LogHighPriority(logEvent);
            }
            await _taskContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message, e);
        }

        return Ok();
    }

    private LogEvent GetLogEvent(HttpCode code, string endpoint, Task task)
    {
        return new LogEvent()
        {
            Code = code,
            EndPoint = endpoint,
            Priority = task.Priority
        };
    }

}