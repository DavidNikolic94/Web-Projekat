using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Projekat_V2.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Posta",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Grad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Tr_kapacitet = table.Column<float>(type: "real", nullable: false),
                    Maks_kapacitet = table.Column<float>(type: "real", nullable: false),
                    Postanski_broj = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posta", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Vozilo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tablice = table.Column<string>(type: "nvarchar(9)", maxLength: 9, nullable: false),
                    Tr_kapacitet = table.Column<float>(type: "real", nullable: false),
                    Max_kapacitet = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vozilo", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Paket",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Posiljalac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Primalac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Masa = table.Column<float>(type: "real", nullable: false),
                    Datum_slanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum_prijema = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Lomljivo = table.Column<bool>(type: "bit", nullable: false),
                    Primljen = table.Column<bool>(type: "bit", nullable: false),
                    Odrediste = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PostaID = table.Column<int>(type: "int", nullable: true),
                    VoziloID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paket", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Paket_Posta_PostaID",
                        column: x => x.PostaID,
                        principalTable: "Posta",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Paket_Vozilo_VoziloID",
                        column: x => x.VoziloID,
                        principalTable: "Vozilo",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Postar",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Telefon = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VoziloFK = table.Column<int>(type: "int", nullable: false),
                    PostaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Postar", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Postar_Posta_PostaID",
                        column: x => x.PostaID,
                        principalTable: "Posta",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Postar_Vozilo_VoziloFK",
                        column: x => x.VoziloFK,
                        principalTable: "Vozilo",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Paket_PostaID",
                table: "Paket",
                column: "PostaID");

            migrationBuilder.CreateIndex(
                name: "IX_Paket_VoziloID",
                table: "Paket",
                column: "VoziloID");

            migrationBuilder.CreateIndex(
                name: "IX_Postar_PostaID",
                table: "Postar",
                column: "PostaID");

            migrationBuilder.CreateIndex(
                name: "IX_Postar_VoziloFK",
                table: "Postar",
                column: "VoziloFK",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Paket");

            migrationBuilder.DropTable(
                name: "Postar");

            migrationBuilder.DropTable(
                name: "Posta");

            migrationBuilder.DropTable(
                name: "Vozilo");
        }
    }
}
