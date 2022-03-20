export class Vozilo
{
    constructor(id, tablice, max_opt)
    {
        this.ID = id;
        this.tablice = tablice;
        this.tr_opterecenje = 0;
        this.max_opterecenje = max_opt;
    }

    unesiOpterecenje(opt)
    {
        this.tr_opterecenje = opt;
    }
}