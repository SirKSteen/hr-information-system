// Program.cs
using Microsoft.EntityFrameworkCore;
using hr_information_system_server.Data;
using hr_information_system_server.Repositories;
using hr_information_system_server.Interfaces;
using Microsoft.OpenApi.Models;
using hr_information_system_server.Models;

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
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HR Information System API", Version = "v1" });
});

var app = builder.Build();

app.UseRouting();

// Apply migrations and create the database
using (var scope = app.Services.CreateScope())
{
    var dBContext = scope.ServiceProvider.GetRequiredService<HRInformationSystemContext>();
    dBContext.Database.Migrate();
    // Seed initial data
    SeedData(dBContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HR Information System API v1");
    });
}

app.UseHttpsRedirection();
// Use CORS
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();


// Seed data method
void SeedData(HRInformationSystemContext context)
{
    // Check if the database is already seeded with an admin
    if (!context.Employees.Any())
    {
        context.Employees.AddRange(
            new Employee
            {
                Id = 0,
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@hr.com",
                PhoneNumber = "8765412013",
                Position = "Admin",
                DateOfHire = DateTime.Now.AddDays(-10),
                Salary = 1000000,
                IsHRAdmin = true,
                Password = "123"
            }
        );

        context.SaveChanges(); // Save the seeded data to the database
    }
}