# Welcome to Progess Tracker 
A web application I created to organise my university work all in one place in order to keep track of deadlines for all of my assignments across all of my modules easily. Progress Tracker can 'sync' with Canvas and will automatically create Tasks and Objectives based on current module enrolments and active assignments <br> <br>
## Skills improved
![My Skills](https://skillicons.dev/icons?i=dotnet,cpp,js,html,css)

![image](https://github.com/user-attachments/assets/6d982c0e-d280-472e-8a26-a626aa20130e)

![image](https://github.com/user-attachments/assets/dcdbd3d2-fe6d-4a81-ad2a-d9f8e525a3e3)

## Usage requirements
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (required to build and run the app)
- **Any Editor/IDE**
- **SQL Server:** 2022 or later
- **SQL Server Management Studio (SSMS):**

## Setting up the database
1. In SSMS connect to your database engine.
2. Right click databases -> New Database and give it a name Eg. TrackerDB
3. Follow any further steps. When the database is created. Right click it and select New Query.
4. Copy and paste the creation schema found below. Replace USE [TrackerDB] with your database name. And run the script (F5)

## Running the applictaion
1. Clone the repository
2. Update the database connection string in `appsettings.json` to point to your local SQL Server instance it may look something like: <br>
`"ConnectionStrings": {
  "DefaultConnection" : "Server=CONORSLAPTOP\\SQLEXPRESS; Initial Catalog=TrackerDB; Integrated Security=True; TrustServerCertificate=True"
},`
<br>
3. Open the repository in your IDE and in the terminal run. `dotnet restore` follow any instructions in the terminal if there any and then run `dotnet run`. The application should start on http://localhost:5296
<br>

## Acquiring your Canvas API key (OPTIONAL)
1. Log into Canvas account
2. Navigate to Account > Settings
3. Scroll to 'Approved Integrations' and click 'New Access Token' and that's it!
4. Clicking the profile icon in Progress Tracker will allow you to input this key and from there you can sync the application with your Modules and Assignments.
<br>
<br>
<details>
  <summary>Database creation schema</summary>
  USE [TrackerDB];

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

CREATE TABLE [dbo].[__EFMigrationsHistory] (
    [MigrationId] NVARCHAR(150) NOT NULL,
    [ProductVersion] NVARCHAR(32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId] ASC)
);

CREATE TABLE [dbo].[AspNetRoles] (
    [Id] NVARCHAR(450) NOT NULL,
    [Name] NVARCHAR(256) NULL,
    [NormalizedName] NVARCHAR(256) NULL,
    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[AspNetRoleClaims] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [RoleId] NVARCHAR(450) NOT NULL,
    [ClaimType] NVARCHAR(MAX) NULL,
    [ClaimValue] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[AspNetUsers] (
    [Id] NVARCHAR(450) NOT NULL,
    [UserName] NVARCHAR(256) NULL,
    [NormalizedUserName] NVARCHAR(256) NULL,
    [Email] NVARCHAR(256) NULL,
    [NormalizedEmail] NVARCHAR(256) NULL,
    [EmailConfirmed] BIT NOT NULL,
    [PasswordHash] NVARCHAR(MAX) NULL,
    [SecurityStamp] NVARCHAR(MAX) NULL,
    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
    [PhoneNumber] NVARCHAR(MAX) NULL,
    [PhoneNumberConfirmed] BIT NOT NULL,
    [TwoFactorEnabled] BIT NOT NULL,
    [LockoutEnd] DATETIMEOFFSET NULL,
    [LockoutEnabled] BIT NOT NULL,
    [AccessFailedCount] INT NOT NULL,
    [CanvasApiKey] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [UserId] NVARCHAR(450) NOT NULL,
    [ClaimType] NVARCHAR(MAX) NULL,
    [ClaimValue] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] NVARCHAR(450) NOT NULL,
    [ProviderKey] NVARCHAR(450) NOT NULL,
    [ProviderDisplayName] NVARCHAR(MAX) NULL,
    [UserId] NVARCHAR(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider], [ProviderKey])
);

CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] NVARCHAR(450) NOT NULL,
    [RoleId] NVARCHAR(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId], [RoleId])
);

CREATE TABLE [dbo].[AspNetUserTokens] (
    [UserId] NVARCHAR(450) NOT NULL,
    [LoginProvider] NVARCHAR(450) NOT NULL,
    [Name] NVARCHAR(450) NOT NULL,
    [Value] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED ([UserId], [LoginProvider], [Name])
);

CREATE TABLE [dbo].[Tasks] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Name] NVARCHAR(MAX) NOT NULL CONSTRAINT DF_Tasks_Name DEFAULT (N''),
    [DueDate] DATETIME2 NOT NULL CONSTRAINT DF_Tasks_DueDate DEFAULT ('0001-01-01T00:00:00'),
    [UserId] NVARCHAR(450) NOT NULL CONSTRAINT DF_Tasks_UserId DEFAULT (N''),
    CONSTRAINT [PK_Tasks] PRIMARY KEY CLUSTERED ([Id])
);

CREATE TABLE [dbo].[Objectives] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Name] NVARCHAR(MAX) NOT NULL CONSTRAINT DF_Objectives_Name DEFAULT (N''),
    [Hours] INT NOT NULL,
    [IsComplete] BIT NOT NULL,
    [TaskId] INT NOT NULL CONSTRAINT DF_Objectives_TaskId DEFAULT (0),
    CONSTRAINT [PK_Objectives] PRIMARY KEY CLUSTERED ([Id])
);

-- Foreign Keys
ALTER TABLE [dbo].[AspNetRoleClaims]
ADD CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[AspNetUserClaims]
ADD CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[AspNetUserLogins]
ADD CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[AspNetUserRoles]
ADD CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[AspNetUserRoles]
ADD CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[AspNetUserTokens]
ADD CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[Objectives]
ADD CONSTRAINT [FK_Objectives_Tasks_TaskId]
FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([Id]) ON DELETE CASCADE;

ALTER TABLE [dbo].[Tasks]
ADD CONSTRAINT [FK_Tasks_AspNetUsers_UserId]
FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;

</details>
