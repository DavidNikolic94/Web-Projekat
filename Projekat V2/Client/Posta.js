import { Paket } from "./Paket.js";

export class Posta
{
    constructor(id, post_broj, grad, tr_kap, max_kap)
    {
        this.ID = id;
        this.grad = grad;
        this.doprinos = 0;
        this.tr_kapacitet = tr_kap;
        this.max_kapacitet = max_kap;
        this.postanski_broj = post_broj;
        this.paketi = [];
        this.container = null;
        this.Postari = [];
    }

    dodajRed(tbody)
    {
        console.log(tbody);

        let r = document.createElement("tr");
        r.className = "TableRowPosta";
        tbody.appendChild(r);

        let td  = document.createElement("td");
        td.className = "TdBodyPosta";
        td.innerHTML = this.grad;
        r.appendChild(td);

        td = document.createElement("td");
        td.className = "TdBodyPosta";
        td.innerHTML = this.postanski_broj;
        r.appendChild(td);

        td = document.createElement("td");
        td.className = "TdBodyPosta";
        td.innerHTML = this.tr_kapacitet;
        r.appendChild(td);

        td = document.createElement("td");
        td.className = "TdBodyPosta";
        td.innerHTML = this.max_kapacitet;
        r.appendChild(td);
    }
}