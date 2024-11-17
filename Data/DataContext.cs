using Microsoft.EntityFrameworkCore;
using ProgressTracker.Models;
using Task = ProgressTracker.Models.Task;

namespace ProgressTracker.Data;

    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<Objective>? Objectives { get; set; }
        public DbSet<Task>? Tasks { get; set; }
        public DbSet<SmallTask>? SmallTasks { get; set; }
        public DbSet<MediumTask>? MediumTasks { get; set; }
        public DbSet<LargeTask>? LargeTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Task>()
            .HasDiscriminator<string>("TaskType")
            .HasValue<SmallTask>("SmallTask")
            .HasValue<MediumTask>("MediumTask")
            .HasValue<LargeTask>("LargeTask");
        }
    }
