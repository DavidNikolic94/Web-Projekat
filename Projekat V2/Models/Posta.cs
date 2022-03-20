using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Posta")]
    public class Posta
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Grad { get; set; }

        [Required]
        [Range(0, 10000)]
        public float Tr_kapacitet { get; set; }

        [Required]
        [Range(0,10000)]
        public float Maks_kapacitet { get; set; }

        [Required]
        public int Postanski_broj { get; set; }

        public List<Paket> Paketi { get; set; }

        public List<Postar> Postari { get; set; }
    }
}