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
    public class PostarController : ControllerBase
    {
        public PostaContext Context { get; set; }

        public PostarController(PostaContext context)
        {
            Context = context;
        }

        [Route("DodajPostara/{ime}/{prezime}/{telefon}/{posta_broj}/{tablice}")]
        [HttpPost]
        public async Task<ActionResult> DodajPostara(string ime, string prezime, string telefon, int posta_broj, string tablice)
        {
            if(ime.Length > 50 || prezime.Length > 50)
            {
                return BadRequest("Ime i prezime ne mogu biti duzi od 50 karaktera");
            }
            if(telefon.Length < 10 || telefon.Length > 15 || telefon.Substring(0,4) == "+3816")
            {
                return BadRequest("Uneti broj nije validan");
            }
            if(tablice.Length > 9)
            {
                return BadRequest("Ne postoje tablice sa vise od 9 karaktera");
            }

            try
            {
                var slobodnaVozila = await Context.Vozila.Where(p => p.Postar == null).ToListAsync();
                var postar = await Context.Postari.Where(p => p.Telefon == telefon).FirstOrDefaultAsync();

                if(postar != default)
                {
                    return BadRequest("Postar sa ovim brojem teleofna u bazi vec postoji");
                }

                if(!slobodnaVozila.Any())
                {
                    return BadRequest("Ne postoji slobodno vozilo za upisivanje novog postara");
                }                    

                var posta = await Context.Poste.Where(p => p.Postanski_broj == posta_broj).FirstOrDefaultAsync();
                var vozilo = slobodnaVozila.Find(p => p.Tablice == tablice);

                if(vozilo == default)
                {
                    return BadRequest("Vozilo ne postoji u bazi");
                }
                if(posta == default)
                {
                    return BadRequest("Posta ne postoji u bazi");
                }

                Postar p = new Postar
                {
                    Telefon = telefon,
                    Ime = ime,
                    Prezime = prezime,
                    VoziloFK = vozilo.ID,
                    Posta = posta,
                    Vozilo = vozilo
                };
                vozilo.Postar = p;
                Context.Postari.Add(p);
                await Context.SaveChangesAsync();
                return Ok("Postar je dodat");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("SviPostariIzPoste/{grad}")]
        [HttpGet]
        public async Task<ActionResult> SviPostariIzPoste(string grad)
        {
            if(grad.Length > 50)
            {
                return BadRequest("U bazi ne postoji grad sa preko 50 karaktera");
            }

            try
            {
                var postari = await Context.Postari
                    .Include(p => p.Posta)
                    .Include(p => p.Vozilo)
                    .Where(p => p.Posta.Grad == grad).ToListAsync();

                if(!postari.Any())
                {
                    return BadRequest("Posta nema postare ili posta ne postoji u bazi");
                }

                return Ok(postari);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiPostara/{telefon}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiPostara(string telefon)
        {
            if(telefon.Length < 10 || telefon.Length > 15 || telefon.Substring(0,4) == "+3816")
            {
                return BadRequest("Uneti broj nije validan");
            }

            try
            {
                var postar = await Context.Postari.Where(p => p.Telefon == telefon).FirstOrDefaultAsync();

                if(postar == default)
                {
                    return BadRequest("Postar ne postoji u bazi");
                }

                Context.Postari.Remove(postar);
                await Context.SaveChangesAsync();
                return Ok("Postar je uklonjen");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}