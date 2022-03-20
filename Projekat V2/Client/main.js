import { Posta } from "./Posta.js"
import { PostaSrbije } from "./postaSrbije.js"

var poste = [];

fetch("https://localhost:5001/Posta/SvePoste").then(p =>{
    if(p.ok)
    { 
        p.json().then(data => {
            data.forEach(posta => {
                const pos = new Posta(posta.id, posta.pos_br, posta.grad, posta.tr_kap, posta.max_kp);
                poste.push(pos);
            });
            let PS = new PostaSrbije(poste);
            PS.crtaj(document.body);
        }).catch(ps => alert(ps));
    }
    else
    {
        p.text().then(data => {
            alert(data);
        });
    }
})

let poste_2 = [];
fetch("https://localhost:5001/Posta/SvePoste").then(p =>{
    if(p.ok)
    { 
        p.json().then(data => {
            data.forEach(posta => {
                const pos = new Posta(posta.id, posta.pos_br, posta.grad, posta.tr_kap, posta.max_kp);
                poste_2.push(pos);
            });
            let PS = new PostaSrbije(poste_2);
            PS.crtaj(document.body);
            PS.izbrisiSideBar();
        }).catch(ps => alert(ps));
    }
    else
    {
        p.text().then(data => {
            alert(data);
        });
    }
})

