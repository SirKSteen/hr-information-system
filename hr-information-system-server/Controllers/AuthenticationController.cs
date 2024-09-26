using hr_information_system_server.Data;
using hr_information_system_server.Functions;
using hr_information_system_server.Interfaces;
using hr_information_system_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace hr_information_system_server.Controllers
{
    [ApiController]
    [Route("api/authenticate")]
    public class AuthenticationController : ControllerBase
    {
        private readonly HRInformationSystemContext _context;
        private readonly IEmployeeRepository _employeeRepository;

        public AuthenticationController(HRInformationSystemContext context, IEmployeeRepository employeeRepository)
        {
            _context = context;
            _employeeRepository = employeeRepository;
        }

        // POST: api/authenticate
        [HttpPost]
        public async Task<ActionResult> Authenticate(LoginDTO loginDTO)
        {
            if (loginDTO == null) return BadRequest("No User Credentials to authenticate");
            Employee user = await _employeeRepository.GetEmployeeByEmailAndPassword(loginDTO);
            if (user == null) return BadRequest("Invalid Credentials");

            string accessToken = GetToken(user);
            LoginResponseDTO loginResponseDTO = new()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsHRAdmin = user.IsHRAdmin,
                AccessToken = accessToken,
            };

            return Ok(loginResponseDTO);
        }

        public string GetToken(Employee employee)
        {
            string subject = Environment.GetEnvironmentVariable("JWT_SUBJECT");
            string jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            var expireMinutes = Environment.GetEnvironmentVariable("JWT_EXPIREMINUTES");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("UserId", employee.Id.ToString()),
                new Claim("DisplayName", $"{employee.FirstName} {employee.LastName}"),
                new Claim("UserName", $"{employee.FirstName} {employee.LastName}"),
                new Claim("Email", employee.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(expireMinutes)),
                signingCredentials: signIn
            );

            string accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            return accessToken;
        }

    }
}
