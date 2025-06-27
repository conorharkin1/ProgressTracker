using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Migrations
{
    /// <inheritdoc />
    public partial class AddCanvasApiKeyFieldToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CanvasApiKey",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanvasApiKey",
                table: "AspNetUsers");
        }
    }
}
