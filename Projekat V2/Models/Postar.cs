using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Postar")]
    public class Postar
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(15)]
        [Required]
        public string Telefon { get; set; }

        [MaxLength(50)]
        [Required]
        public string Ime { get; set; }

        [MaxLength(50)]
        [Required]
        public string Prezime { get; set; }

        [ForeignKey("VoziloFK")]
        public int VoziloFK { get; set; }

        [JsonIgnore]
        public Vozilo Vozilo { get; set; }

        [JsonIgnore]
        public Posta Posta { get; set; }
    }
}