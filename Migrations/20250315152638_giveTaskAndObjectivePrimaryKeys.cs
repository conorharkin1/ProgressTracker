using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressTracker.Migrations
{
    /// <inheritdoc />
    public partial class giveTaskAndObjectivePrimaryKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalTime",
                table: "Tasks");

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "Tasks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TaskId",
                table: "Objectives",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Objectives_TaskId",
                table: "Objectives",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Objectives_Tasks_TaskId",
                table: "Objectives",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Objectives_Tasks_TaskId",
                table: "Objectives");

            migrationBuilder.DropIndex(
                name: "IX_Objectives_TaskId",
                table: "Objectives");

            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "Objectives");

            migrationBuilder.AddColumn<int>(
                name: "TotalTime",
                table: "Tasks",
                type: "int",
                nullable: true);
        }
    }
}
