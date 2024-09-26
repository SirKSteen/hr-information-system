using System.ComponentModel.DataAnnotations;

namespace hr_information_system_server.Models
{
    public class Report
    {
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public DateTime Created { get; set; }
        public byte[] Bytes { get; set; }
    }
}
