using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddDbContext<TaskContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("TaskContext")));

builder.Services.AddHttpLoggingInterceptor<RequestLogging>();
builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = HttpLoggingFields.All;
    options.CombineLogs = true;
});
builder.Services.AddHttpLoggingInterceptor<RequestLogging>();
builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowSpecificOrigin",
           builder => builder.WithOrigins("http://localhost:5173")
                             .AllowAnyHeader()
                             .AllowAnyMethod());
   });

var app = builder.Build();

// Seed the database with initial data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<TaskContext>();
    context.Database.EnsureCreated();

    // Seed initial data
    if (!context.Tasks.Any())
    {
        var tasks = new Task[]
        {
            new() { DueDate = DateTime.Now.AddHours(6), Title = "Collect Data Breach", Description = "Obtain info about the data breach", Priority = Priority.High, Status = Status.InProgress },
            new() { DueDate = DateTime.Now.AddDays(6), Title = "Secure ports", Priority = Priority.Medium, Status = Status.Pending },
            new() { DueDate = DateTime.Now.AddHours(6), Title = "Remove filtered iussues", Priority = Priority.High, Status = Status.InProgress },
            new() { DueDate = DateTime.Now.AddHours(6), Title = "Task #999", Description = "Obtain info about the data breach", Priority = Priority.High, Status = Status.InProgress },
            new() { DueDate = DateTime.Now.AddDays(4), Title = "Renew licenses", Priority = Priority.Medium, Status = Status.Pending },
            new() { DueDate = DateTime.Now.AddDays(14), Title = "Comb backlog", Description = "Check backlog", Priority = Priority.Low, Status = Status.InProgress },
            new() { DueDate = DateTime.Now.AddDays(2), Title = "Run system scan", Description = "Obtain info about the data breach", Priority = Priority.High, Status = Status.InProgress },
            new() { DueDate = DateTime.Now.AddDays(2), Title = "Document Procedure", Priority = Priority.Medium, Status = Status.Pending },
            new() { DueDate = DateTime.Now.AddDays(3), Title = "Load test", Description = "Verify system under heavy user activity", Priority = Priority.Medium, Status = Status.Archived },
            new() { DueDate = DateTime.Now.AddDays(6), Title = "Review security policy", Description = "Check signed documents", Priority = Priority.High, Status = Status.InProgress },
            new() { DueDate = DateTime.Now.AddDays(6), Title = "Secure ports", Priority = Priority.Medium, Status = Status.Pending },
            new() { DueDate = DateTime.Now.AddHours(12), Title = "Investigate Data Breach", Priority = Priority.High, Status = Status.InProgress },
        };

        context.Tasks.AddRange(tasks);
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowSpecificOrigin");
}

app.UseRouting();
app.MapControllers();
app.UseHttpsRedirection();
app.UseHttpLogging();

/*
TODO: Use auth on app and add data annotation [Authorize] on routes you want to protect
app.UseAuthentication();
app.UseAuthorization();
*/
app.Run();