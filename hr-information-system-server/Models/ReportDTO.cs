using System.ComponentModel.DataAnnotations;

namespace hr_information_system_server.Models
{
    public class ReportDTO
    {
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public DateTime Created { get; set; }
    }
}
