using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Projekat_V2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaketController : ControllerBase
    {
        public PostaContext Context { get; set; }

        public PaketController(PostaContext context)
        {
            this.Context = context;
        }

        [Route("DodajPaket/{masa}/{posiljalac}/{primalac}/{adresaPrijema}/{postanskiBroj}/{lomljivo}/{cenaPosiljke}")]
        [HttpPost]
        public async Task<ActionResult> DodajPaket(float masa, string posiljalac, string primalac,
            string adresaPrijema, int postanskiBroj, bool lomljivo, int cenaPosiljke)
        {
            try
            {
                var posta = await Context.Poste.Where(p => p.Postanski_broj == postanskiBroj).FirstOrDefaultAsync();
                var paket = await Context.Paketi.Where(p => p.Masa == masa && p.Posiljalac == posiljalac && p.Primalac == primalac
                    && p.Odrediste == adresaPrijema && p.Posta.Postanski_broj == postanskiBroj && p.Lomljivo == lomljivo && p.CenaPosiljke == cenaPosiljke).FirstOrDefaultAsync();
                

                if(posta == default)
                {
                    return BadRequest("Posta ne postoji");
                }
                if(paket != default)
                {
                    return BadRequest("Unos vec unetog objekta nije dozvoljena");
                }
            
                Paket p = new Paket
                {
                    Masa = masa,
                    Datum_slanja = DateTime.Now,
                    Posiljalac = posiljalac,
                    Primalac = primalac,
                    Lomljivo = lomljivo,
                    Odrediste = adresaPrijema,
                    CenaPosiljke = cenaPosiljke,
                    Posta = posta
                };
                float kap = posta.Tr_kapacitet + masa;
                if(kap > posta.Maks_kapacitet)
                {
                    return BadRequest("Nema dovoljno mesta u posti za ovaj paket");
                }

                Context.Paketi.Add(p);
                posta.Tr_kapacitet += masa;
                await Context.SaveChangesAsync();
                return Ok("Paket je dodat");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("SviPaketiUGradu/{grad}")]
        [HttpGet]
        public async Task<ActionResult> SviPaketiUGradu(string grad)
        {
            if(grad.Length > 50)
            {
                return BadRequest("Ne postoji posta sa gradom preko 50 karaktera");
            }

            try
            {
                var paketi = await Context.Paketi
                    .Include(p => p.Posta)
                    .Include(p => p.Vozilo)
                    .Where(p => p.Posta.Grad == grad).ToListAsync();

                if(!paketi.Any())
                {
                    return BadRequest("U ovoj posti ne postoje paketi");
                }

                return Ok(paketi);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PristigaoPaket/{posiljalac}/{primalac}/{odrediste}")]
        [HttpPut]
        public async Task<ActionResult> PristigaoPaket(string posiljalac, string primalac, string odrediste)
        {
            if(posiljalac.Length > 50 || primalac.Length > 50 || odrediste.Length > 100)
            {
                return BadRequest("Posiljalac i primalac ne mogu imati vise od 50 karaktera, kao ni odrediste vise od 100");
            }

            try
            {
                var paket = await Context.Paketi
                    .Include(p => p.Vozilo)
                    .Where(p => p.Posiljalac == posiljalac && p.Primalac == primalac &&
                    p.Odrediste == odrediste && p.Primljen == false).FirstOrDefaultAsync();
                
                if(paket == default)
                {
                    return BadRequest("Ne postoji ovakav paket u bazi");
                }
                if(paket.Vozilo == null)
                {
                    return BadRequest("Paket koji nije u vozilu ne mozete biti primljen");
                }

                paket.Vozilo.Tr_kapacitet -= paket.Masa;
                paket.Primljen = true;
                paket.Datum_prijema = DateTime.Now;
                Context.Update(paket);
                await Context.SaveChangesAsync();
                return Ok("Status paketa je promenjen u primljen");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("UbaciPaket/{posiljalac}/{primalac}/{odrediste}/{tablice}")]
        [HttpPut]
        public async Task<ActionResult> UbaciPaket(string posiljalac, string primalac, string odrediste, string tablice)
        {
            if(posiljalac.Length > 50 || primalac.Length > 50 || odrediste.Length > 100)
            {
                return BadRequest("Posiljalac i primalac ne mogu imati vise od 50 karaktera, kao ni odrediste vise od 100");
            }
            if(tablice.Length > 9)
            {
                return BadRequest("Tablice duze od 9 karaktera ne postoje u bazi");
            }

            try
            {
                var vozilo = await Context.Vozila.Where(p => p.Tablice == tablice).FirstOrDefaultAsync();
                var paket = await Context.Paketi.Where(p => p.Posiljalac == posiljalac &&
                    p.Primalac == primalac && p.Odrediste == odrediste && p.Vozilo == null)
                    .Include(p => p.Posta)
                    .FirstOrDefaultAsync();

                if(vozilo == default)
                {
                    return BadRequest("Vozilo ne postoji u bazi");
                }
                if(paket == default)
                {
                    return BadRequest("Paket ne postoji u bazi");
                }
               /* if(vozilo.Postar.Posta.Grad != paket.Posta.Grad)
                {
                    return BadRequest("Nije moguce dodati paket u vozilo jer se vozilo nalazi u drugoj posti");
                }*/

                paket.Posta.Tr_kapacitet -= paket.Masa;
                paket.Vozilo = vozilo;
                vozilo.Tr_kapacitet += paket.Masa;
                await Context.SaveChangesAsync();
                return Ok("Paket je ubacen u vozilo");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiPristiglePakete/{grad}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiPristiglePakete(string grad)
        {
            if(grad.Length > 50)
            {
                return BadRequest("U bazi ne postoji posta koja se nalazi u gradu sa vise od 50 karaktera");
            }

            try
            {
                var paketi = await Context.Paketi
                    .Include(p => p.Vozilo)
                    .Where(p => p.Primljen == true && p.Posta.Grad == grad).ToListAsync();
                var posta = await Context.Poste.Where(p => p.Grad == grad).FirstOrDefaultAsync();
                
                if(!paketi.Any())
                {
                    return BadRequest("Ne postoje primljeni paketi");
                }

                Context.Paketi.RemoveRange(paketi);
                await Context.SaveChangesAsync();
                return Ok("Primljeni paketi su izbrisani iz baze");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}