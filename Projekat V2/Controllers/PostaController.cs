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
    public class PostaController : ControllerBase
    {
        public PostaContext Context { get; set; }

        public PostaController(PostaContext context)
        {
            this.Context = context;
        }

        [Route("Dodaj/{grad}/{maks_kap}/{post_broj}")]
        [HttpPost]
        public async Task<ActionResult> Dodaj(string grad, int maks_kap, int post_broj)
        {
            if(grad.Length > 50)
            {
                return BadRequest("Ime grada je predugacko (>50).");
            }
            if(maks_kap > 10000)
            {
                return BadRequest("Prevelika vrednost za maksimalni kapacitet.");
            }

            try
            {
                var posta = await Context.Poste.Where(p => p.Grad == grad).FirstOrDefaultAsync();

                if(posta != default)
                {
                    return BadRequest("Posta u ovom gradu vec postoji"+posta);
                }

                Posta p = new Posta
                {
                    Grad = grad,
                    Tr_kapacitet = 0,
                    Maks_kapacitet = maks_kap,
                    Postanski_broj = post_broj
                };

                Context.Poste.Add(p);
                await Context.SaveChangesAsync();
                return Ok("Posta je uspesno dodata");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("SvePoste")]
        [HttpGet]
        public async Task<ActionResult> SvePoste()
        {
            try
            {
                var poste = await Context.Poste.ToListAsync();

                return Ok
                (
                    poste.Select( p => 
                    new
                    {
                        id = p.ID,
                        pos_br = p.Postanski_broj,
                        grad = p.Grad,
                        tr_kap = p.Tr_kapacitet,
                        max_kp = p.Maks_kapacitet
                    }).ToList()
                );
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Posta/{id}")]
        [HttpGet]
        public async Task<ActionResult> Posta(int id)
        {
            try
            {
                var posta = await Context.Poste.Where(p => p.ID == id).FirstOrDefaultAsync();

                if(posta == default)
                {
                    return BadRequest("Ne postoji posta u ovom gradu");
                }

                return Ok(posta);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route ("SlobodnePoste")]
        [HttpGet]
        public async Task<ActionResult> SlobodnePoste()
        {
            try
            {
                var poste = await Context.Poste.Where(p => p.Tr_kapacitet < p.Maks_kapacitet).ToListAsync();

                if(!poste.Any())
                {
                    return BadRequest("Sve poste su dostigle maksimalni kapacitet ili u bazi nema unetih posta");
                }
                return Ok
                (
                    poste.Select( p => 
                    new
                    {
                        pos_br = p.Postanski_broj,
                        grad = p.Grad,
                        tr_kap = p.Tr_kapacitet,
                        max_kp = p.Maks_kapacitet
                    }).ToList()
                );
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Izbrisi/{grad}")]
        [HttpDelete]
        public async Task<ActionResult> Izbrisi(string grad)
        {
            if(grad.Length > 50)
            {
                return BadRequest($"Posta sa gradom: {grad} ne postoji jer ima vise od 50 karaktera");
            }
            try
            {
                var posta = await Context.Poste
                    .Include(p => p.Paketi)
                    .Include(p => p.Postari)
                    .Where(p => p.Grad == grad).FirstOrDefaultAsync();

                var vozila = await Context.Vozila.Where(p => p.Postar.Posta.Grad == grad).ToListAsync();
                var postari = await Context.Postari.Where(p => p.Posta.Grad == grad).ToListAsync();
                var paketi = await Context.Paketi.Where(p => p.Posta.Grad == grad).ToListAsync();

                if(posta == null)
                {
                    return BadRequest("Posta u ovom gradu ne postoji");
                }

                Context.Paketi.RemoveRange(paketi);
                Context.Postari.RemoveRange(postari);
                Context.Vozila.RemoveRange(vozila);
                Context.Poste.Remove(posta);
                await Context.SaveChangesAsync();
                return Ok("Posta je uklonjena");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DnevniDoprinos/{grad}")]
        [HttpGet]
        public async Task<ActionResult> DnevniDoprinos(string grad)
        {
            if(grad.Length > 50)
            {
                return BadRequest($"Posta sa gradom: {grad} ne postoji jer ima vise od 50 karaktera");
            }

            try
            {
                var posta = await Context.Poste.Where(p => p.Grad == grad).FirstOrDefaultAsync();

                if( posta == default)
                {
                    return BadRequest("Posta ne postoji u bazi");
                }

                var paketi = await Context.Paketi.Where(p => p.Posta == posta).ToListAsync();

                if(!paketi.Any())
                {
                    return BadRequest("U posti nije bilo danas paketa");
                }

                int suma = 0;
                foreach(Paket p in paketi)
                {
                    suma+=p.CenaPosiljke;
                }

                return Ok(suma);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}