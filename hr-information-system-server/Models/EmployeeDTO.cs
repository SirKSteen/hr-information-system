using System.ComponentModel.DataAnnotations;

namespace hr_information_system_server.Models
{
    public class EmployeeDTO
    {
        public int id { get; set; }
        [Required]
        public string firstName { get; set; }
        [Required]
        public string lastName { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string phoneNumber { get; set; }
        [Required]
        public string position { get; set; }
        [Required]
        public DateTime dateOfHire { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal salary { get; set; }
        public bool isHRAdmin { get; set; }
        public string password { get; set; }
    }
}
