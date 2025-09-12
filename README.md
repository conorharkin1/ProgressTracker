# Welcome to Progess Tracker
A web application I created to organise my university work all in one place in order to keep track of deadlines for all of my assignments across all of my modules easily. Progress Tracker can 'sync' with Canvas and will automatically create Tasks and Objectives based on current module enrolments and active assignments <br> <br>
## Skills improved
![My Skills](https://skillicons.dev/icons?i=dotnet,cpp,js,html,css)

![image](https://github.com/user-attachments/assets/6d982c0e-d280-472e-8a26-a626aa20130e)

![image](https://github.com/user-attachments/assets/dcdbd3d2-fe6d-4a81-ad2a-d9f8e525a3e3)

## Usage requirements
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (required to build and run the app)
- **Any Editor/IDE**
- **Postgresql**

## Setting up the database and running the application
1. Clone the repo and open it in your desired editor.
2. Create a blank postgresql database.
3. Update the connection string in appsettings.json to connect to your local instance of postgres and the database.
4. I use VSCode so in the terminal simply run **dotnet ef database update** to instantiate your database.
5. Once the migrations have been applied run **dotnet restore** follow any instructions and then **dotnet run** The application should start on http://localhost:5296

## Acquiring your Canvas API key (OPTIONAL)
1. Log into Canvas account
2. Navigate to Account > Settings
3. Scroll to 'Approved Integrations' and click 'New Access Token' and that's it!
4. Clicking the profile icon in Progress Tracker will allow you to input this key and from there you can sync the application with your Modules and Assignments.
