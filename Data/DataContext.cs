using Microsoft.EntityFrameworkCore;
using ProgressTracker.Models;
using Task = ProgressTracker.Models.Task;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;


namespace ProgressTracker.Data;

    public class DataContext : IdentityDbContext<ApplicationUser>, IDataProtectionKeyContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<Objective> Objectives { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<SmallTask> SmallTasks { get; set; }
        public DbSet<MediumTask> MediumTasks { get; set; }
        public DbSet<LargeTask> LargeTasks { get; set; }
        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1 Task has many Objectives
            modelBuilder.Entity<Task>()
                .HasMany(t => t.Objectives)
                .WithOne(o => o.Task)
                .HasForeignKey(o => o.TaskId);

            modelBuilder.Entity<Task>()
            .HasDiscriminator<string>("TaskType")
            .HasValue<SmallTask>("SMALL")
            .HasValue<MediumTask>("MEDIUM")
            .HasValue<LargeTask>("LARGE");
        }
    }
