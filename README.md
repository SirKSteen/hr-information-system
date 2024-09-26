# HR Information System
### Project Overview
A streamlined HR Information System designed to manage employee data and generate reports. It features a vibrant, responsive UI built using React with TypeScript for both desktop and mobile devices. The backend server is powered by ASP.NET Web API Core, utilizing Entity Framework Core to interact with a Microsoft SQL Server database.

### Key Features:
* Create, view, edit, and delete employee records.
* Role-based access: Employees can only view data, while HR Administrators have full access.
* User authentication with username and password management.
* Automatic password generation for newly created employees, displayed via toast notifications.
* Multiple employee deletion functionality.
### Two types of PDF reports:
* A pie chart showing the total number of employees.
* A table displaying employees hired within the last 30 days.
  
HR Administrators can manage all employee data and generate reports, while standard employees are restricted to viewing records only. Users cannot delete their own account and can update their passwords.


## Setup Instructions
### Backend (ASP.NET Web API)
Clone the repository:
```
git clone https://github.com/SirKSteen/hr-information-system.git
```

Navigate to the backend project directory:
```
cd hr-information-system-server
```

Install dependencies:
```
dotnet restore
```

Run database migrations:
```
dotnet ef database update
```

Make a copy of the .env.template file and rename it to .env

Run the backend server:
```
dotnet run
```

### Frontend (React + TypeScript)
Navigate to the frontend project directory:
```
cd hr-information-system
```

Install dependencies:
```
npm install
```
Start the development server:
```
npm run start
```
