using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Migrations
{
    /// <inheritdoc />
    public partial class taskObjectiveRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Objectives_Tasks_TaskId",
                table: "Objectives");

            migrationBuilder.AlterColumn<int>(
                name: "TaskId",
                table: "Objectives",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Objectives_Tasks_TaskId",
                table: "Objectives",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Objectives_Tasks_TaskId",
                table: "Objectives");

            migrationBuilder.AlterColumn<int>(
                name: "TaskId",
                table: "Objectives",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Objectives_Tasks_TaskId",
                table: "Objectives",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id");
        }
    }
}
