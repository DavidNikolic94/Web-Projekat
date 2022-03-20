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
    public class VoziloController : ControllerBase
    {
        public PostaContext Context { get; set; }

        public VoziloController(PostaContext context)
        {
            this.Context = context;
        }

        [Route("DodajVozilo/{tablice}/{maks_kap}")]
        [HttpPost]
        public async Task<ActionResult> DodajVozilo(string tablice, int maks_kap)
        {
            if(tablice.Length > 9)
            {
                return BadRequest("Tablice mora da sadrze 9 karaktera");
            }
            if(maks_kap > 1500)
            {
                return BadRequest("Vrednost ne sme biti preko 1500");
            }

            try
            {
                var vozilo = await Context.Vozila.Where(p => p.Tablice == tablice).FirstOrDefaultAsync();

                if(vozilo != default)
                {
                    return BadRequest("Vozilo sa ovim tablicama vec postoji u bazi");
                }

                Vozilo v = new Vozilo
                {
                    Tablice = tablice,
                    Tr_kapacitet = 0,
                    Max_kapacitet = maks_kap,
                };

                Context.Vozila.Add(v);
                await Context.SaveChangesAsync();
                return Ok("Vozilo je dodato");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("SvaVozilaIzPoste/{grad}")]
        [HttpGet]
        public async Task<ActionResult> SvaVozila(string grad)
        {
            if(grad.Length > 50)
            {
                return BadRequest("Ne postoji grad sa prkeo 20 karaktera");
            }

            try
            {

                var vozila = await Context.Vozila.Where(p => p.Postar.Posta.Grad == grad).ToListAsync();

                if(!vozila.Any())
                {
                    return BadRequest("Ne postoje vozila u ovoj posti");
                }

                return Ok(vozila);
                
            }catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PronadjiVozilo/{tablice}")]
        [HttpGet]
        public async Task<ActionResult> PronadjiVozilo(string tablice)
        {
            if(tablice.Length > 9)
            {
                return BadRequest("Tablice duze od 9 karaktera ne postoje u bazi");
            }

            try
            {
                var vozilo = await Context.Vozila
                    .Include(p => p.Postar)
                    .Include(p => p.Paketi)
                    .Where(p => p.Tablice == tablice).FirstOrDefaultAsync();

                if(vozilo == null)
                {
                    return BadRequest($"Vozilo sa tablicama: {tablice} ne postoji");
                }
                if(vozilo.Postar == null)
                {
                    return BadRequest("Vozilo postoji u bazi ali nema vozaca");
                }

                return Ok(vozilo);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("VozilaBezVozaca")]
        [HttpGet]
        public async Task<ActionResult> VozilaBezVozaca()
        {
            try
            {
                var vozila = await Context.Vozila.Where(p => p.Postar == null).FirstOrDefaultAsync();

                if(vozila == default)
                {
                    return BadRequest("Sva vozila imaju svoje vozace");
                }

                return Ok(vozila);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("IzbrisiVozilo/{tablice}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiVozilo(string tablice)
        {
            if(tablice.Length > 9)
            {
                return BadRequest("Tablice duze od 9 karaktera ne postoje u bazi");
            }

            try
            {
                var vozilo = await Context.Vozila.Where(p => p.Tablice == tablice).FirstOrDefaultAsync();
                var paketi = await Context.Paketi.Where(p => p.Vozilo.Tablice == tablice).ToListAsync();

                if(vozilo == default)
                {
                    return BadRequest("Ovo vozilo ne postoji u bazi");
                }

                Context.Paketi.RemoveRange(paketi);
                Context.Vozila.Remove(vozilo);
                await Context.SaveChangesAsync();
                return Ok("Vozilo je izbrisano");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("MasaPaketa/{tablice}")]
        [HttpGet]
        public async Task<ActionResult> MasaPaketa(string tablice)
        {
            if(tablice.Length > 9)
            {
                return BadRequest("Tablice duze od 9 karaktera ne postoje u bazi");
            }

            try
            {
                var vozilo = await Context.Vozila.Where(p => p.Tablice == tablice).FirstOrDefaultAsync();

                if(vozilo == default)
                {
                    return BadRequest("Ne postoji ovo vozilo u bazi");
                }

                var paketi = await Context.Paketi.Where(p => p.Vozilo == vozilo).ToListAsync();

                float masa = 0;
                foreach(Paket p in paketi)
                {
                    masa+=p.Masa;
                }
                return Ok(masa);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}