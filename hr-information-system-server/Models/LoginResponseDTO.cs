using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace hr_information_system_server.Models
{
    public class LoginResponseDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsHRAdmin { get; set; }
        public string AccessToken { get; set; }
    }
}
