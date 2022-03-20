using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Vozilo")]
    public class Vozilo
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(9)]
        public string Tablice { get; set; }

        [Range(0, 1500)]
        [Required]
        public float Tr_kapacitet { get; set; }

        [Range(0, 1500)]
        [Required]
        public float Max_kapacitet { get; set; }

        //[JsonIgnore]
        public Postar Postar { get; set; }

        //[JsonIgnore]
        public List<Paket> Paketi { get; set; }
    }
}