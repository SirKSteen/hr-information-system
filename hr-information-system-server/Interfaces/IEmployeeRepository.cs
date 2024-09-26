using hr_information_system_server.Models;

namespace hr_information_system_server.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<EmployeeResponse> CreateEmployee(Employee employee);
        Task<Employee?> GetEmployee(int id);
        Task<List<Employee>> GetAllEmployees();
        Task<EmployeeResponse> UpdateEmployee(Employee employee);
        Task<EmployeeResponse> DeleteEmployee(int id);
        Task<Employee> GetEmployeeByEmailAndPassword(LoginDTO loginDTO);
    }
}
