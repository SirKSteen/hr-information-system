using hr_information_system_server.Data;
using hr_information_system_server.Functions;
using hr_information_system_server.Interfaces;
using hr_information_system_server.Models;
using Microsoft.AspNetCore.Mvc;

namespace hr_information_system_server.Controllers
{
    [ApiController]
    [Route("api/report")]
    public class ReportController : ControllerBase
    {
        private readonly HRInformationSystemContext _context;
        private IReportRepository _reportRepository;
        private IEmployeeRepository _employeeRepository;

        public ReportController(HRInformationSystemContext context, IReportRepository reportRepository, IEmployeeRepository employeeRepository)
        {
            _context = context;
            _reportRepository = reportRepository;
            _employeeRepository = employeeRepository;
        }

        // GET: api/report/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Report>>> GetReports()
        {
            List<Report> reports = await _reportRepository.GetAllReports();
            List<ReportDTO> reportDTOs = [];
            foreach (Report report in reports)
            {
                ReportDTO reportDTO = new()
                {
                    Id = report.Id,
                    Title = report.Title,
                    Created = report.Created,
                };
                reportDTOs.Add(reportDTO);
            }
            return Ok(reportDTOs.OrderByDescending(e => e.Created));
        }

        // GET: api/report/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReport(string id)
        {
            Guid guid = new Guid(id);
            Report? report = await _reportRepository.GetReport(guid);
            if (report == null) return NotFound($"Report with id {id} does not exist");

            return File(report.Bytes, "application/pdf", $"{report.Title}.pdf");
        }

        // GET: api/report/EmployeesHiredWithinLast30Days
        [HttpGet("EmployeesHiredWithinLast30Days")]
        public async Task<ActionResult<Report>> GenerateEmployeesHiredWithinLast30Days()
        {
            DateTime currentDate = DateTime.Now;
            List<Employee> totalEmployees = await _employeeRepository.GetAllEmployees();
            List<Employee> employeesHiredWithinLast30Days = totalEmployees.Where(e => (currentDate - e.DateOfHire).TotalDays <= 30).ToList();

            ReportGenerator reportGenerator = new()
            {
                EmployeesHiredWithinLast30Days = employeesHiredWithinLast30Days,
                TotalEmployees = totalEmployees.Count,
                Employees = totalEmployees
            };
            // Generate the PDF
            byte[] pdf = reportGenerator.EmployeesHiredWithinLast30DaysPDF();

            // Save Report
            string title = $"EmployeesHiredWithinLast30Days_{currentDate.ToShortDateString()}_{currentDate.ToShortTimeString()}";
            string cleanTitle = CleanString.Run(title);
            var result = _reportRepository.SaveReport(pdf, cleanTitle, currentDate);

            var contentDisposition = $"attachment; filename=\"{cleanTitle}.pdf\"";

            Response.Headers.Add("Content-Disposition", contentDisposition);

            return File(pdf, "application/pdf");
        }

        // GET: api/report/TotalEmployees
        [HttpGet("TotalEmployees")]
        public async Task<ActionResult<Report>> TotalEmployees()
        {
            DateTime currentDate = DateTime.Now;
            List<Employee> totalEmployees = await _employeeRepository.GetAllEmployees();
            List<Employee> employeesHiredWithinLast30Days = totalEmployees.Where(e => (currentDate - e.DateOfHire).TotalDays <= 30).ToList();

            ReportGenerator reportGenerator = new()
            {
                EmployeesHiredWithinLast30Days = employeesHiredWithinLast30Days,
                TotalEmployees = totalEmployees.Count,
                Employees = totalEmployees
            };
            // Generate the PDF
            byte[] pdf = reportGenerator.TotalEmployeesPDF();

            // Save Report
            string title = $"TotalEmployees_{currentDate.ToShortDateString()}_{currentDate.ToShortTimeString()}";
            string cleanTitle = CleanString.Run(title);
            var result = _reportRepository.SaveReport(pdf, cleanTitle, currentDate);

            var contentDisposition = $"attachment; filename=\"{cleanTitle}.pdf\"";

            Response.Headers.Add("Content-Disposition", contentDisposition);

            return File(pdf, "application/pdf");
        }
    }
}