using hr_information_system_server.Data;
using hr_information_system_server.Interfaces;
using hr_information_system_server.Models;
using Microsoft.EntityFrameworkCore;

namespace hr_information_system_server.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly HRInformationSystemContext _context;

        // Constructor injection to get the DbContext
        public ReportRepository(HRInformationSystemContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context)); // Ensure the context is not null
        }

        public async Task<bool> SaveReport(byte[] data, string title, DateTime created)
        {
            Report report = new()
            {
                Id = Guid.NewGuid(),
                Title = title,
                Created = created,
                Bytes = data
            };

            _context.Reports.Add(report);
            var result = await _context.SaveChangesAsync();
            if (result == 0) return false;
            return true;
        }
        public async Task<Report> GetReport(Guid id)
        {
            return await _context.Reports.FindAsync(id);
        }

        public async Task<List<Report>> GetAllReports()
        {
            return await _context.Reports.ToListAsync();
        }

    }
}
