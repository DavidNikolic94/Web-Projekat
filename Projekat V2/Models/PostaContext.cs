using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class PostaContext : DbContext
    {
        public DbSet<Vozilo> Vozila { get; set; }

        public DbSet<Paket> Paketi { get; set; }

        public DbSet<Posta> Poste { get; set; }

        public DbSet<Postar> Postari { get; set; }  

        public PostaContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vozilo>()
                .HasOne(p => p.Postar)
                .WithOne(p => p.Vozilo)
                .HasForeignKey<Postar>(p => p.VoziloFK);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

    }
}