using hr_information_system_server.Data;
using hr_information_system_server.Functions;
using hr_information_system_server.Interfaces;
using hr_information_system_server.Models;
using Microsoft.AspNetCore.Mvc;

namespace hr_information_system_server.Controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController : ControllerBase
    {
        private readonly HRInformationSystemContext _context;
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeController(HRInformationSystemContext context, IEmployeeRepository employeeRepository)
        {
            _context = context;
            _employeeRepository = employeeRepository;
        }

        // GET: api/employee/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            List<Employee> employees = await _employeeRepository.GetAllEmployees(); 

            return employees;
        }

        // GET: api/employee/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            Employee? employee = await _employeeRepository.GetEmployee(id);
            if (employee == null) return NotFound(new { isSuccess = false, message = $"Employee with id {id} does not exist"});

            return Ok(employee);
        }

        // POST: api/employee
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(EmployeeDTO employeeDTO)
        {
            PasswordGenerator passwordGenerator = new();
            Employee employee = new()
            {
                Id = 0,
                FirstName = employeeDTO.firstName,
                LastName = employeeDTO.lastName,
                Email = employeeDTO.email,
                PhoneNumber = employeeDTO.phoneNumber,
                Position = employeeDTO.position,
                DateOfHire = employeeDTO.dateOfHire,
                Salary = employeeDTO.salary,
                Password = passwordGenerator.Run(),
                IsHRAdmin = employeeDTO.isHRAdmin,
            };

            EmployeeResponse response = await _employeeRepository.CreateEmployee(employee);
            if (!response.IsSuccess) return StatusCode(500, new { response.Message });

            response.Message = $"Password: {employee.Password}";
            return StatusCode(201, response);
        }

        // PUT: api/employee/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, EmployeeDTO employeeDTO)
        {
            if (id != employeeDTO.id)
            {
                return BadRequest(new EmployeeResponse() { IsSuccess = false, Message = "Id from route does not match id in request body" });
            }

            Employee employee = new()
            {
                Id = employeeDTO.id,
                FirstName = employeeDTO.firstName,
                LastName = employeeDTO.lastName,
                Email = employeeDTO.email,
                PhoneNumber = employeeDTO.phoneNumber,
                Position = employeeDTO.position,
                DateOfHire = employeeDTO.dateOfHire,
                Salary = employeeDTO.salary,
                Password = employeeDTO.password,
                IsHRAdmin = employeeDTO.isHRAdmin,
            };

            EmployeeResponse response = await _employeeRepository.UpdateEmployee(employee);
            if (!response.IsSuccess) return StatusCode(500, response);

            return Ok(response);
        }

        // DELETE: api/employee/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            EmployeeResponse response = await _employeeRepository.DeleteEmployee(id);
            if (!response.IsSuccess) return StatusCode(500, response);

            return Ok(response);
        }
    }
}
