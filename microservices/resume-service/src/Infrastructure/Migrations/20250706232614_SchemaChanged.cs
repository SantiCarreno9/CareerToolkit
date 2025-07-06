using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SchemaChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "resume-service");

            migrationBuilder.RenameTable(
                name: "resumes",
                schema: "public",
                newName: "resumes",
                newSchema: "resume-service");

            migrationBuilder.RenameTable(
                name: "profile_entries",
                schema: "public",
                newName: "profile_entries",
                newSchema: "resume-service");

            migrationBuilder.RenameTable(
                name: "cover_letters",
                schema: "public",
                newName: "cover_letters",
                newSchema: "resume-service");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.RenameTable(
                name: "resumes",
                schema: "resume-service",
                newName: "resumes",
                newSchema: "public");

            migrationBuilder.RenameTable(
                name: "profile_entries",
                schema: "resume-service",
                newName: "profile_entries",
                newSchema: "public");

            migrationBuilder.RenameTable(
                name: "cover_letters",
                schema: "resume-service",
                newName: "cover_letters",
                newSchema: "public");
        }
    }
}
