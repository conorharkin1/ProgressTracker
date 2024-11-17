using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Migrations
{
    /// <inheritdoc />
    public partial class Initial_test_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Discriminator",
                table: "Tasks",
                newName: "TaskType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TaskType",
                table: "Tasks",
                newName: "Discriminator");
        }
    }
}
