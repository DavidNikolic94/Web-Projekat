using Microsoft.EntityFrameworkCore.Migrations;

namespace Projekat_V2.Migrations
{
    public partial class V4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CenaPosiljke",
                table: "Paket",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CenaPosiljke",
                table: "Paket");
        }
    }
}
