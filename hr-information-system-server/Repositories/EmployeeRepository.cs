using hr_information_system_server.Data;
using hr_information_system_server.Interfaces;
using hr_information_system_server.Models;
using Microsoft.EntityFrameworkCore;

namespace hr_information_system_server.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly HRInformationSystemContext _context;

        // Constructor injection to get the DbContext
        public EmployeeRepository(HRInformationSystemContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context)); // Ensure the context is not null
        }


        public async Task<EmployeeResponse> CreateEmployee(Employee employee)
        {
            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == employee.Email);
            if (existingEmployee != null) return new EmployeeResponse() { IsSuccess = false, Message = "Employee with that email already exists" };

            _context.Employees.Add(employee);
            var result = await _context.SaveChangesAsync();
            if (result == 0) return new EmployeeResponse() { IsSuccess = false, Message = "Error saving employee"};
            return new EmployeeResponse() { IsSuccess = true, Message = "Successfully saved employee" };
        }

        public async Task<EmployeeResponse> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return new EmployeeResponse() { IsSuccess = false, Message = $"Employee with id {id} does not exist"};

            try
            {
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();

                return new EmployeeResponse() { IsSuccess = true, Message = $"Successfully deleted employee" };
            } catch (Exception e)
            {
                return new EmployeeResponse() { IsSuccess = false, Message= e.Message };
            }
        }

        public async Task<Employee?> GetEmployee(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        public async Task<List<Employee>?> GetAllEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        public async Task<EmployeeResponse> UpdateEmployee(Employee employee)
        {
            bool employeeExists = _context.Employees.Any(e => e.Id == employee.Id);
            if (!employeeExists) return new EmployeeResponse() { IsSuccess = false, Message = $"Employee with id {employee.Id} does not exist" };

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                int result = await _context.SaveChangesAsync();
                return new EmployeeResponse() { IsSuccess = true, Message = "Successfully updated employee" };
            }
            catch (DbUpdateConcurrencyException e)
            {
                return new EmployeeResponse() { IsSuccess = false, Message= e.Message };
            }
        }

        public async Task<Employee?> GetEmployeeByEmailAndPassword(LoginDTO loginDTO)
        {
            return await _context.Employees.FirstOrDefaultAsync(e => e.Email == loginDTO.username && e.Password == loginDTO.password);
        }
    }
}
