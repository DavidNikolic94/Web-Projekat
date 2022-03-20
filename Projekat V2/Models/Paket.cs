using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Paket")]
    public class Paket
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public String Posiljalac { get; set; }

        [Required]
        [MaxLength(50)]
        public string Primalac { get; set; }

        [Required]
        [Range(0.1, 100)]
        public float Masa { get; set; }

        [Required]
        public DateTime Datum_slanja { get; set; }

        public DateTime Datum_prijema { get; set; }

        public bool Lomljivo { get; set; }

        public bool Primljen { get; set; }

        public int CenaPosiljke { get; set; }

        [Required]
        [MaxLength(100)]
        public string Odrediste { get; set; }

        [JsonIgnore]
        public Posta Posta { get; set; }

        [JsonIgnore]
        public Vozilo Vozilo { get; set; }     
    }
}