using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdditionalContactInfoNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Dictionary<string, string>>(
                name: "additional_contact_info",
                schema: "Identity",
                table: "users",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(Dictionary<string, string>),
                oldType: "jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Dictionary<string, string>>(
                name: "additional_contact_info",
                schema: "Identity",
                table: "users",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(Dictionary<string, string>),
                oldType: "jsonb",
                oldNullable: true);
        }
    }
}
