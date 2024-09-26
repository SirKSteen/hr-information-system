// Program.cs
using Microsoft.EntityFrameworkCore;
using hr_information_system_server.Data;
using hr_information_system_server.Repositories;
using hr_information_system_server.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Load .env file
DotNetEnv.Env.Load();
var connectionString = Environment.GetEnvironmentVariable("DefaultConnection");
var HR_INFORMATION_SYSTEM_UI_ORIGIN = Environment.GetEnvironmentVariable("HR_INFORMATION_SYSTEM_UI_ORIGIN");

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddDbContext<HRInformationSystemContext>(options =>
    options.UseSqlServer(connectionString));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins(HR_INFORMATION_SYSTEM_UI_ORIGIN)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Disposition")
            .AllowCredentials());
});


builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseRouting();

// Apply migrations and create the database
using (var scope = app.Services.CreateScope())
{
    var dBContext = scope.ServiceProvider.GetRequiredService<HRInformationSystemContext>();
    dBContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Use CORS
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();