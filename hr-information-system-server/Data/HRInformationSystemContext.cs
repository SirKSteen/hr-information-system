using hr_information_system_server.Models;
using Microsoft.EntityFrameworkCore;

namespace hr_information_system_server.Data
{
    public class HRInformationSystemContext : DbContext
    {
        public HRInformationSystemContext(DbContextOptions<HRInformationSystemContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Report> Reports { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Specify precision and scale for Salary
            modelBuilder.Entity<Employee>()
                .Property(e => e.Salary)
                .HasColumnType("decimal(18, 2)");

            base.OnModelCreating(modelBuilder);
        }
    }
}
