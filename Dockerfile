# BUILD STAGE
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# RESTORE
COPY ProgressTracker.csproj ./
RUN dotnet restore

# BUILD
COPY . ./
RUN dotnet build 'ProgressTracker.csproj' -c Release -o /app/build

# PUBLISH
FROM build AS publish
RUN dotnet publish 'ProgressTracker.csproj' -c Release -o /app/publish

# RUN STAGE
FROM mcr.microsoft.com/dotnet/aspnet:8.0
ENV ASPNETCORE_URLS=http://+:80
WORKDIR /app
EXPOSE 80
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "ProgressTracker.dll"]