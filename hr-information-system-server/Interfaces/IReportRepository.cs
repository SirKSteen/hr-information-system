using hr_information_system_server.Models;

namespace hr_information_system_server.Interfaces
{
    public interface IReportRepository
    {
        Task<bool> SaveReport(byte[] data, string title, DateTime created);
        Task<Report> GetReport(Guid id);
        Task<List<Report>> GetAllReports();
    }
}
