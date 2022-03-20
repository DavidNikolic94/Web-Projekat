export class Paket
{
    constructor(id, posiljalac, primalac, masa, datum_slanja, datum_prijema,
        lomljivo, primljen, cena_posiljke, adresa_prijema)
    {
        this.ID = id
        this.masa = masa;
        this.datum_slanja = datum_slanja;
        this.posiljalac = posiljalac;
        this.primalac = primalac;
        this.datum_prijema = datum_prijema;
        this.lomljivo = lomljivo;
        this.primljen = primljen;
        this.adresa_prijema = adresa_prijema;
        this.cena_posiljke = cena_posiljke
        this.container = null;
    }
}