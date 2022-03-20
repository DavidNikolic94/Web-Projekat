import { Paket } from "./Paket.js";
import { Posta } from "./Posta.js"
import { Postar } from "./Postar.js";
import { Vozilo } from "./Vozilo.js";

export class PostaSrbije
{
    constructor(listPosti)
    {
        this.listaPosti = listPosti;
        this.container = null;
        this.listaPaketa = [];
        this.listaVozila = [];
        this.listaPostara = [];
        this.listaVozila = [];
        this.grad = null;
    }

    crtaj(host)
    {
        //host.innerHTML = "";

        let divSideBar = document.createElement("div");
        divSideBar.className = "divSideBar"
        host.appendChild(divSideBar);

        this.sideBar(divSideBar);
        
        this.container = document.createElement("div");
        this.container.className = "container"
        host.appendChild(this.container);
        //this.container.innerHTML = "";

        let divTabelaPom = document.createElement("div");
        divTabelaPom.className = "divTabelaPom";
        this.container.appendChild(divTabelaPom);

        let divTabela = document.createElement("div");
        divTabela.className = "divTabelaPosti";
        divTabelaPom.appendChild(divTabela);
        
        this.ispisTabelePosti(divTabela);

        let divPaketi = document.createElement("div");
        this.container.appendChild(divPaketi);

        this.paketiForm(divPaketi);

        let lUnosPaketa = document.createElement("label");
        lUnosPaketa.innerHTML = "Unesite paket:";
        lUnosPaketa.className = "MainLabels";
        this.container.appendChild(lUnosPaketa);

        this.unosPaketaForm(this.container);

        let lUbaciPaket = document.createElement("label");
        lUbaciPaket.innerHTML = "Ubacite paket u vozilo:";
        lUbaciPaket.className = "MainLabels";
        this.container.appendChild(lUbaciPaket);
        
        this.ubaciPaketForm(this.container);

        let lPristigaoPaket = document.createElement("label");
        lPristigaoPaket.innerHTML = "Promena statusa paketa:";
        lPristigaoPaket.className = "MainLabels";
        this.container.appendChild(lPristigaoPaket);

        let divPristigao = document.createElement("div");
        this.container.appendChild(divPristigao);
        
        this.pristigaoPaketForm(divPristigao);

        let lIzbrisiPakete = document.createElement("label");
        lIzbrisiPakete.innerHTML = "Izbrisi sve primljene pakete:";
        lPristigaoPaket.className = "MainLabels";
        this.container.appendChild(lIzbrisiPakete);

        let divIzbrisiPakete = document.createElement("div");
        this.container.appendChild(divIzbrisiPakete);

        this.izbrisiPakete(divIzbrisiPakete);

        let divBtnBezVozaca = document.createElement("div");
        this.container.appendChild(divBtnBezVozaca);
   
        let divBezVozaca = document.createElement("div");
        this.container.appendChild(divBezVozaca);

        let btnVoziloBezVozaca = document.createElement("button");
        btnVoziloBezVozaca.innerHTML = "Vozilo";
        btnVoziloBezVozaca.className = "Mainbuttons";
        btnVoziloBezVozaca.onclick = (ev) => { this.voziloBezVozaca(divBezVozaca)}
        divBtnBezVozaca.appendChild(btnVoziloBezVozaca);

        let divBtnGrafik = document.createElement("div");
        this.container.appendChild(divBtnGrafik);

        let divGrafik = document.createElement("div");
        this.container.appendChild(divGrafik);

        let btnGrafik = document.createElement("button");
        btnGrafik.innerHTML = "Izvestaj";
        btnGrafik.className = "Mainbuttons";
        btnGrafik.onclick = (ev) => { this.grafikDoprinosa(divGrafik) }
        divBtnGrafik.appendChild(btnGrafik);
    }

    voziloBezVozaca(host)
    {
        let vozilo = null;
        fetch("https://localhost:5001/Vozilo/VozilaBezVozaca").then(p => {
            if(p.ok)
            {
                p.json().then(data => {
                    const voz = new Vozilo(data.id, data.tablice, data.max_kapacitet);
                        vozilo = voz;
                    this.crtajVoziloBezVozaca(vozilo, host)
                }).catch(ps => alert(ps))
            }
            else
            {
                p.text().then(data => {
                    alert(data); 
                });
            }
        })
    }

    crtajVoziloBezVozaca(vozilo, host)
    {
        if(vozilo != null)
        {
            host.innerHTML = "";
            let lBezVozaca = document.createElement("label");
            lBezVozaca.innerHTML = vozilo.tablice;
            lBezVozaca.className = "MainLabels";
            host.appendChild(lBezVozaca);
        }
        else
        {
            host.innerHTML = "";
            let lBezVozaca = document.createElement("label");
            lBezVozaca.innerHTML = "Ne postoji slobodno vozilo.";
            lBezVozaca.className = "MainLabels";
            host.appendChild(lBezVozaca);
        }
    }

    grafikDoprinosa(host)
    {
        host.innerHTML = "";
        let divChart = document.createElement("div");
        divChart.className = "divChart";
        host.appendChild(divChart);

        let canvas = document.createElement("canvas");
        canvas.id = "myChart";
        divChart.appendChild(canvas);

        let scriptChart = document.createElement("script");
        divChart.appendChild(scriptChart);

        let myChart = document.getElementById("myChart").getContext("2d");

        let box = document.querySelector(".IspisPaketaBox");
        this.grad = box.value; let doprinos = 0;

        if(box.value != null)
        {
            fetch("https://localhost:5001/Posta/DnevniDoprinos/"+this.grad).then(p => {
                if(p.ok)
                {
                    p.json().then(dop => {
                        doprinos = parseInt(dop);
                        console.log(doprinos);
                        let barChart = new Chart(myChart,
                            {
                                type : "bar",
                                data: {
                                    labels: [this.grad],
                                    datasets:[{
                                        backgroundColor: "lightgrey",
                                        label:"Doprinos",
                                        data: [doprinos],
                                    }]
                                },
                                options:{}
                            }
                        );
                    })
                }
                else
                {
                    p.text().then(data => {
                        alert(data);
                    }).catch(ps => alert(ps));
                }
            })
        }
        else
        {
            alert("GRAD: Polje mora sadrzati samo slova. Polje mora biti popunjeno");
        }
    }

    sideBar(host)
    {
        let divSideBar = document.createElement("div");
        divSideBar.className = "sidebar";
        divSideBar.id = "mySidebar";
        host.appendChild(divSideBar);

        let divMain = document.createElement("div");
        divMain.className = "Main";
        divMain.id = "main";
        host.appendChild(divMain);

        let buttonSideBar = document.createElement("button");
        buttonSideBar.className = "openbtn";
        buttonSideBar.onclick = (ev) => {this.openNav(buttonSideBar)}
        buttonSideBar.innerHTML = '<ion-icon name="menu-outline"></ion-icon>'
        divMain.appendChild(buttonSideBar);

        let a = document.createElement("a");
        a.className = "sideBarAnchor";
        a.innerText = "Dodaj postu";
        a.href = "#";
        a.onclick = (ev) => {this.sideBarUnesiPostu(divDodajPostu)}
        divSideBar.appendChild(a);

        let divDodajPostu = document.createElement("div");
        divSideBar.appendChild(divDodajPostu);

        a = document.createElement("a");
        a.className = "sideBarAnchor";
        a.innerText = "Obrisi postu";
        a.href = "#";
        a.onclick = (ev) => {this.sideBarObrisiPostu(divObrisiPostu)}
        divSideBar.appendChild(a);

        let divObrisiPostu = document.createElement("div");
        divSideBar.appendChild(divObrisiPostu);

        a = document.createElement("a");
        a.className = "sideBarAnchor";
        a.innerText = "Dodaj postara";
        a.href = "#";
        a.onclick = (ev) => {this.sideBarUnesiPostara(divDodajPostara)}
        divSideBar.appendChild(a);

        let divDodajPostara = document.createElement("div");
        divSideBar.appendChild(divDodajPostara);

        a = document.createElement("a");
        a.className = "sideBarAnchor";
        a.innerText = "Obrisi postara";
        a.href = "#";
        a.onclick = (ev) => {this.sideBarObrisiPostara(divObrisiPostara)}
        divSideBar.appendChild(a);

        let divObrisiPostara = document.createElement("div");
        divSideBar.appendChild(divObrisiPostara);

        a = document.createElement("a");
        a.className = "sideBarAnchor";
        a.innerText = "Dodaj vozilo";
        a.href = "#";
        a.onclick = (ev) => {this.sideBarUnesiVozilo(divDodajVozilo)}
        divSideBar.appendChild(a);

        let divDodajVozilo = document.createElement("div");
        divSideBar.appendChild(divDodajVozilo);

        a = document.createElement("a");
        a.className = "sideBarAnchor";
        a.innerText = "Obrisi vozilo";
        a.href = "#";
        a.onclick = (ev) => {this.sideBarObrisiVozilo(divObrisiVozilo)}
        divSideBar.appendChild(a);

        let divObrisiVozilo = document.createElement("div");
        divSideBar.appendChild(divObrisiVozilo);
    }

    openNav(host)
    {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        host.onclick = (ev) => {this.closeNav(host)}
    }

    closeNav(host) {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        host.onclick = (ev) => {this.openNav(host)}
    }

    sideBarUnesiPostu(host)
    {
        host.innerHTML = "";

        let boxGradPosta = document.createElement("input");
        boxGradPosta.setAttribute("type", "text");
        boxGradPosta.className = "boxUnesi";
        boxGradPosta.placeholder = "Grad";
        host.appendChild(boxGradPosta);

        let boxMaxKapacitetPosta = document.createElement("input");
        boxMaxKapacitetPosta.setAttribute("type", "text");
        boxMaxKapacitetPosta.className = "boxUnesi";
        boxMaxKapacitetPosta.placeholder = "Maksimalno opterecenje";
        host.appendChild(boxMaxKapacitetPosta);

        let boxPostanskiBrojPosta = document.createElement("input");
        boxPostanskiBrojPosta.setAttribute("type", "text");
        boxPostanskiBrojPosta.className = "boxUnesi";
        boxPostanskiBrojPosta.placeholder = "Postanski broj";
        host.appendChild(boxPostanskiBrojPosta);

        let btnUnesiPostu = document.createElement("button");
        btnUnesiPostu.innerHTML = "Unesi postu";
        btnUnesiPostu.className = "btnUnesi";
        btnUnesiPostu.onclick = (ev) => {this.unesiPostu(boxGradPosta.value, boxMaxKapacitetPosta.value, boxPostanskiBrojPosta.value)}
        host.appendChild(btnUnesiPostu);
    }

    sideBarObrisiPostu(host)
    {
        host.innerHTML = "";

        let boxGradPosta = document.createElement("input");
        boxGradPosta.setAttribute("type", "text");
        boxGradPosta.className = "boxUnesi";
        boxGradPosta.placeholder = "Grad";
        host.appendChild(boxGradPosta);

        let btnIzbrisiPostu = document.createElement("button");
        btnIzbrisiPostu.innerHTML = "Obrisi postu";
        btnIzbrisiPostu.className = "btnUnesi";
        btnIzbrisiPostu.onclick = (ev) => {this.obrisiPostu(boxGradPosta.value)}
        host.appendChild(btnIzbrisiPostu);
    }

    sideBarUnesiPostara(host)
    {
        host.innerHTML = "";

        let boxImePostar = document.createElement("input");
        boxImePostar.setAttribute("type", "text");
        boxImePostar.className = "boxUnesi";
        boxImePostar.placeholder = "Ime";
        host.appendChild(boxImePostar);

        let boxPrezimePostar = document.createElement("input");
        boxPrezimePostar.setAttribute("type", "text");
        boxPrezimePostar.className = "boxUnesi";
        boxPrezimePostar.placeholder = "Prezime";
        host.appendChild(boxPrezimePostar);

        let boxTelefonPostar = document.createElement("input");
        boxTelefonPostar.setAttribute("type", "text");
        boxTelefonPostar.className = "boxUnesi";
        boxTelefonPostar.placeholder = "Telefon";
        host.appendChild(boxTelefonPostar);

        let boxPostBrojPostar = document.createElement("input");
        boxPostBrojPostar.setAttribute("type", "text");
        boxPostBrojPostar.className = "boxUnesi";
        boxPostBrojPostar.placeholder = "Postanski broj";
        host.appendChild(boxPostBrojPostar);

        let boxTablicePostar = document.createElement("input");
        boxTablicePostar.setAttribute("type", "text");
        boxTablicePostar.className = "boxUnesi";
        boxTablicePostar.placeholder = "Tablice";
        host.appendChild(boxTablicePostar);

        let btnUnesiPostara = document.createElement("button");
        btnUnesiPostara.innerHTML = "Unesi postara";
        btnUnesiPostara.className = "btnUnesi";
        btnUnesiPostara.onclick = (ev) => {this.unesiPostara(boxImePostar.value, boxPrezimePostar.value, boxTelefonPostar.value, boxPostBrojPostar.value, boxTablicePostar.value)}
        host.appendChild(btnUnesiPostara);
    }

    sideBarObrisiPostara(host)
    {
        host.innerHTML = "";

        let boxTelefonPostar = document.createElement("input");
        boxTelefonPostar.setAttribute("type", "text");
        boxTelefonPostar.className = "boxUnesi";
        boxTelefonPostar.placeholder = "Telefon";
        host.appendChild(boxTelefonPostar);

        let btnIzbrisiPostara = document.createElement("button");
        btnIzbrisiPostara.innerHTML = "Obrisi postara";
        btnIzbrisiPostara.className = "btnUnesi";
        btnIzbrisiPostara.onclick = (ev) => {this.obrisiPostara(boxTelefonPostar.value)}
        host.appendChild(btnIzbrisiPostara);
    }

    sideBarUnesiVozilo(host)
    {
        host.innerHTML = "";

        let boxTabliceVozilo = document.createElement("input");
        boxTabliceVozilo.setAttribute("type", "text");
        boxTabliceVozilo.className = "boxUnesi";
        boxTabliceVozilo.placeholder = "Tablice";
        host.appendChild(boxTabliceVozilo);

        let boxMaxKpVozilo = document.createElement("input");
        boxMaxKpVozilo.setAttribute("type", "text");
        boxMaxKpVozilo.className = "boxUnesi";
        boxMaxKpVozilo.placeholder = "Maksimalno opterecenje";
        host.appendChild(boxMaxKpVozilo);

        let btnUnesiVozilo = document.createElement("button");
        btnUnesiVozilo.innerHTML = "Unesi vozilo";
        btnUnesiVozilo.className = "btnUnesi";
        btnUnesiVozilo.onclick = (ev) => {this.unesiVozilo(boxTabliceVozilo.value, boxMaxKpVozilo.value)}
        host.appendChild(btnUnesiVozilo);
    }

    sideBarObrisiVozilo(host)
    {
        host.innerHTML = "";

        let boxTabliceVozilo = document.createElement("input");
        boxTabliceVozilo.setAttribute("type", "text");
        boxTabliceVozilo.className = "boxUnesi";
        boxTabliceVozilo.placeholder = "Tablice";
        host.appendChild(boxTabliceVozilo);

        let btnIzbrisiVozilo = document.createElement("button");
        btnIzbrisiVozilo.innerHTML = "Obrisi vozilo";
        btnIzbrisiVozilo.className = "btnUnesi";
        btnIzbrisiVozilo.onclick = (ev) => {this.obrisiVozilo(boxTabliceVozilo.value)}
        host.appendChild(btnIzbrisiVozilo);
    }

     ispisTabelePosti(host)
    {
        let table = document.createElement("table");
        table.className = "TabelaPosti";
        host.appendChild(table);

        let thead = document.createElement("thead");
        thead.className = "TheadPoste";
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        tbody.className = "TbodyPoste";
        table.appendChild(tbody);

        let td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Grad";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Postanski broj";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Trenutni kapacitet";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Maksimalni kapacitet";
        thead.appendChild(td);

        this.listaPosti.forEach(p => {
            let r = document.createElement("tr");
            r.className = "TableRowPosta";
            tbody.appendChild(r);

            let td  = document.createElement("td");
            td.className = "TdBodyPosta";
            td.innerHTML = p.grad;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "TdBodyPosta";
            td.innerHTML = p.postanski_broj;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "TdBodyPosta";
            td.innerHTML = p.tr_kapacitet;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "TdBodyPosta";
            td.innerHTML = p.max_kapacitet;
            r.appendChild(td);
        })
    }

    paketiForm(host)
    {
        //host.innerHTML = "";

        let ispisPaketaForm = document.createElement("div");
        ispisPaketaForm.className = "IspisPaketaForm";
        host.appendChild(ispisPaketaForm);

        let inputBoxGrad = document.createElement("input");
        inputBoxGrad.setAttribute("type", "text");
        inputBoxGrad.className = "IspisPaketaBox";
        inputBoxGrad.placeholder = "Grad";
        ispisPaketaForm.appendChild(inputBoxGrad);

        let divTabelaPaketa = document.createElement("div");
        divTabelaPaketa.className = "divTabelaPaketa";
        this.container.appendChild(divTabelaPaketa);

        let tablePaketi = document.createElement("table");
        tablePaketi.className = "TabelaPaketa";
        divTabelaPaketa.appendChild(tablePaketi);
        //tablePaketi.style.display = "none";

        let divTabelaVozila = document.createElement("div");
        divTabelaVozila.className = "divTabelaVozila";
        this.container.appendChild(divTabelaVozila);

        let tableVozila = document.createElement("table");
        tableVozila.className = "TabelaVozila";
        divTabelaVozila.appendChild(tableVozila);

        let btnIspisPaketa = document.createElement("button");
        btnIspisPaketa.innerHTML = "Paketi";
        btnIspisPaketa.onclick = (ev) => {
            if(/^[A-Za-z\s]*$/.test(inputBoxGrad.value) && inputBoxGrad.value != null)
            {
                this.preuzmiVozila(tableVozila, inputBoxGrad.value); 
                this.preuzmiPakete(inputBoxGrad.value, tablePaketi)
                this.preuzmiPostare(inputBoxGrad.value)
            }
            else
            {
                alert("PAKETI: Dozvoljena su samo slova i polje mora biti popunjeno");
            }}
        btnIspisPaketa.className = "Mainbuttons";
        ispisPaketaForm.appendChild(btnIspisPaketa);
    }

    unosPaketaForm(host)
    {
        let UnosPaketa = document.createElement("div");
        UnosPaketa.className = "UnosPaketaForm";
        host.appendChild(UnosPaketa);

        let boxPaketMasa = document.createElement("input");
        boxPaketMasa.setAttribute("type", "text");
        boxPaketMasa.className = "BoxPaketUnos";
        boxPaketMasa.placeholder = "Masa";
        UnosPaketa.appendChild(boxPaketMasa);

        let boxPaketPosiljalac = document.createElement("input");
        boxPaketPosiljalac.setAttribute("type", "text");
        boxPaketPosiljalac.className = "BoxPaketUnos";
        boxPaketPosiljalac.placeholder = "Posiljalac";
        UnosPaketa.appendChild(boxPaketPosiljalac);

        let boxPaketPrimalac = document.createElement("input");
        boxPaketPrimalac.setAttribute("type", "text");
        boxPaketPrimalac.className = "BoxPaketUnos";
        boxPaketPrimalac.placeholder = "Primalac";
        UnosPaketa.appendChild(boxPaketPrimalac);

        let boxPaketOdrediste = document.createElement("input");
        boxPaketOdrediste.setAttribute("type", "text");
        boxPaketOdrediste.className = "BoxPaketUnos";
        boxPaketOdrediste.placeholder = "Odrediste";
        UnosPaketa.appendChild(boxPaketOdrediste);

        let boxPaketPostanskiBroj = document.createElement("input");
        boxPaketPostanskiBroj.setAttribute("type", "text");
        boxPaketPostanskiBroj.className = "BoxPaketUnos";
        boxPaketPostanskiBroj.placeholder = "Postanski broj";
        UnosPaketa.appendChild(boxPaketPostanskiBroj);

        let divRadioBox = document.createElement("div");
        divRadioBox.className = "divRadioBox";
        UnosPaketa.appendChild(divRadioBox);

        let lLomljivo = document.createElement("label");
        lLomljivo.innerHTML = "Lomljivo:";
        lLomljivo.className = "LabelPaketUnos";
        divRadioBox.appendChild(lLomljivo);

        let checkboxPaketLomljivo = document.createElement("input");
        checkboxPaketLomljivo.setAttribute("type", "checkbox");
        checkboxPaketLomljivo.className = "RadioPaketUnos";
        divRadioBox.appendChild(checkboxPaketLomljivo);

        let boxPaketCenaPosiljke = document.createElement("input");
        boxPaketCenaPosiljke.setAttribute("type", "text");
        boxPaketCenaPosiljke.placeholder = "Cena posiljke"
        boxPaketCenaPosiljke.className = "BoxPaketUnos";
        UnosPaketa.appendChild(boxPaketCenaPosiljke);

        let btnUnesiPaket = document.createElement("button");
        btnUnesiPaket.className = "Mainbuttons";
        btnUnesiPaket.innerHTML = "Unesi Paket";
        btnUnesiPaket.onclick = (ev) => {
                if(/^[A-Za-z\s]*$/.test(boxPaketPosiljalac.value) && /^[A-Za-z\s]*$/.test(boxPaketPrimalac.value) && boxPaketPosiljalac.value != null && boxPaketPrimalac.value != null)
                {
                    if(/^[0-9]+$/.test(boxPaketMasa.value) && /^[0-9]+$/.test(boxPaketPostanskiBroj.value) && /^[0-9]+$/.test(boxPaketCenaPosiljke.value) &&
                        boxPaketMasa.value != null && boxPaketPostanskiBroj.value != null && boxPaketCenaPosiljke.value != null)
                    {
                        this.unesiPaket(boxPaketMasa.value, boxPaketOdrediste.value, boxPaketCenaPosiljke.value,
                        boxPaketPosiljalac.value, boxPaketPostanskiBroj.value, boxPaketPrimalac.value, checkboxPaketLomljivo.checked)
                    }
                    else
                    {
                        alert("UNESI PAKET: Masa, postanski broj, cena posiljke smeju sadrzati samo cifre. Polja moraju biti popunjena ");
                    }
                }
                else
                {
                    alert("UNESI PAKET: Posiljaoc i primaoc smeju da sadrze samo slova. Polja moraju biti popunjena");
                }
            }
        UnosPaketa.appendChild(btnUnesiPaket);
    }

    ubaciPaketForm(host)
    {
        let ubaciPaketForm = document.createElement("div");
        ubaciPaketForm.className = "ubaciPaketForm";
        host.appendChild(ubaciPaketForm);

        let boxPosiljalacUbaci = document.createElement("input");
        boxPosiljalacUbaci.setAttribute("type", "text");
        boxPosiljalacUbaci.className = "boxUbaciPaket";
        boxPosiljalacUbaci.placeholder = "Posiljalac";
        ubaciPaketForm.appendChild(boxPosiljalacUbaci);

        let boxPrimalacUbaci = document.createElement("input");
        boxPrimalacUbaci.setAttribute("type", "text");
        boxPrimalacUbaci.className = "boxUbaciPaket";
        boxPrimalacUbaci.placeholder = "Primalac";
        ubaciPaketForm.appendChild(boxPrimalacUbaci);

        let boxOdredisteUbaci = document.createElement("input");
        boxOdredisteUbaci.setAttribute("type", "text");
        boxOdredisteUbaci.className = "boxUbaciPaket";
        boxOdredisteUbaci.placeholder = "Odrediste";
        ubaciPaketForm.appendChild(boxOdredisteUbaci);

        let boxTabliceUbaci = document.createElement("input");
        boxTabliceUbaci.setAttribute("type", "text");
        boxTabliceUbaci.className = "boxUbaciPaket";
        boxTabliceUbaci.placeholder = "Tablice";
        ubaciPaketForm.appendChild(boxTabliceUbaci);

        let btnUbaciPaket = document.createElement("button");
        btnUbaciPaket.innerHTML = "Ubaci paket u vozilo";
        btnUbaciPaket.className = "Mainbuttons";
        btnUbaciPaket.onclick = (ev) => {
            if(/^[A-Za-z\s]*$/.test(boxPosiljalacUbaci.value) && /^[A-Za-z\s]*$/.test(boxPrimalacUbaci.value) &&
                boxPosiljalacUbaci.value != null && boxPrimalacUbaci.value != null && boxTabliceUbaci.value != null)
            {
                this.ubaciPaket(boxPosiljalacUbaci.value, boxPrimalacUbaci.value,
                    boxOdredisteUbaci.value, boxTabliceUbaci.value)
            }
            else
            {
                alert("UBACI PAKET U VOZILO: Za posiljaoca i primaoca su dozvoljena samo slova. Sva polja moraju biti popunjena");
            }
        }
        ubaciPaketForm.appendChild(btnUbaciPaket);
    }

    pristigaoPaketForm(host)
    {
        let pristigaoPaketForm = document.createElement("div");
        pristigaoPaketForm.className = "PristigaoPaketForm";
        host.appendChild(pristigaoPaketForm);

        let boxPosiljalacPrimljen = document.createElement("input");
        boxPosiljalacPrimljen.setAttribute("type", "text");
        boxPosiljalacPrimljen.className = "boxPrimljenPaket";
        boxPosiljalacPrimljen.placeholder = "Posiljalac";
        pristigaoPaketForm.appendChild(boxPosiljalacPrimljen);

        let boxPrimalacPrimljen = document.createElement("input");
        boxPrimalacPrimljen.className = "boxPrimljenPaket";
        boxPrimalacPrimljen.setAttribute("type", "text");
        boxPrimalacPrimljen.placeholder = "Primalac";
        pristigaoPaketForm.appendChild(boxPrimalacPrimljen);

        let boxOdredistePrimljen = document.createElement("input");
        boxOdredistePrimljen.setAttribute("type", "text");
        boxOdredistePrimljen.className = "boxPrimljenPaket";
        boxOdredistePrimljen.innerHTML = "Odrediste";
        boxOdredistePrimljen.placeholder = "Odrediste";
        pristigaoPaketForm.appendChild(boxOdredistePrimljen);

        let btnPrihvatiPaket = document.createElement("button");
        btnPrihvatiPaket.className = "Mainbuttons";
        btnPrihvatiPaket.innerHTML = "Primi paket";
        btnPrihvatiPaket.onclick = (ev) => {
            if(/^[A-Za-z\s]*$/.test(boxPosiljalacPrimljen.value) && /^[A-Za-z\s]*$/.test(boxPrimalacPrimljen.value) && 
                boxPosiljalacPrimljen.value != null && boxPrimalacPrimljen.value != null)
            {
                this.prihvatiPaket(boxPosiljalacPrimljen.value,
                boxPrimalacPrimljen.value, boxOdredistePrimljen.value)
            }
            else
            {
                alert("PRIMI PAKET: Za posiljaoca i primaoca su dozvoljena samo slova, polje se mora popuniti");
            }
        }
        pristigaoPaketForm.appendChild(btnPrihvatiPaket);
    }

    preuzmiPostare(grad)
    {
        this.listaPostara = [];
        fetch("https://localhost:5001/Postar/SviPostariIzPoste/"+grad).then(p => {
            if(p.ok)
            {
                p.json().then(data => {
                    data.forEach(postar => {
                        let pos = new Postar(postar.id, postar.telefon, postar.ime, postar.prezime);
                        this.listaPostara.push(pos);
                    });
                }).catch(ps => alert(ps));              
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                }).catch(ps => alert(ps));
            }
        })
    }

    preuzmiPakete(grad, host)
    {
        host.innerHTML = "";       
        this.listaPaketa = [];
        fetch("https://localhost:5001/Paket/SviPaketiUGradu/"+grad).then(p => {
            if(p.ok)
            {
                p.json().then(data => {
                    data.forEach(paket => {
                        const pak = new Paket(paket.id, paket.posiljalac, paket.primalac,
                            paket.masa, paket.datum_slanja, paket.datum_prijema,
                            paket.lomljivo, paket.primljen, paket.cenaPosiljke, paket.odrediste);
                        this.listaPaketa.push(pak);
                    });
                    let teloTabele = document.querySelector(".TabelaPaketa");
                    let roditelj = teloTabele.parentNode;
                    roditelj.removeChild(teloTabele);

                    teloTabele = document.createElement("table");
                    teloTabele.className = "TabelaPaketa";
                    roditelj.appendChild(teloTabele);
                    this.ispisTabelePaketa(teloTabele);
                }).catch(ps => alert(ps));
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
                let teloTabele = document.querySelector(".TabelaPaketa");
                    let roditelj = teloTabele.parentNode;
                    roditelj.removeChild(teloTabele);

                    teloTabele = document.createElement("table");
                    teloTabele.className = "TabelaPaketa";
                    roditelj.appendChild(teloTabele);
                    this.ispisTabelePaketa(teloTabele);
            }
        })
    }

    ispisTabelePaketa(host)
    {
        console.log(this.listaPaketa);
        host.innerHTML = "";

        let thead = document.createElement("thead");
        thead.className = "Thead";
        host.appendChild(thead);

        let tbody = document.createElement("tbody");
        tbody.className = "Tbody";
        host.appendChild(tbody)

        let td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Posiljalac";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Primalac";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Masa";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Odrediste";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Lomljivo";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Primljen";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Cena posiljke";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Datum slanja";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "TdHead";
        td.innerHTML = "Datum prijema";
        thead.appendChild(td);

        this.listaPaketa.forEach(p => {

            let r = document.createElement("tr");
            r.className = "Trow";
            tbody.appendChild(r);

            let td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.posiljalac;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.primalac;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.masa;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.adresa_prijema;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.lomljivo;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.primljen;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.cena_posiljke;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.datum_slanja.slice(0, 10);
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            if(p.datum_prijema.slice(0,10) != "0001-01-01")
            {
                td.innerHTML = p.datum_prijema.slice(0, 10);
            }
            else
            {
                td.innerHTML = "/";
            }
            r.appendChild(td);
        })
    }

    unesiPaket(masa, odrediste, cenaPosiljke, posiljalac, postanskiBroj, primalac, lomljivo)
    {
        let grad = null;
        this.listaPosti.forEach(p => {
            if(p.postanski_broj == postanskiBroj)
            {
                grad = p.grad;
                let a = parseFloat(p.tr_kapacitet);
                a += parseFloat(masa);
                if(a > parseFloat(p.max_kapacitet))
                {
                    alert("Nije moguce dodati paket u posti, posta je puna.");
                    return;
                }
            }
        });

        fetch("https://localhost:5001/Paket/DodajPaket/"+masa+"/"+posiljalac+"/"+primalac+"/"+odrediste+"/"+postanskiBroj+"/"+lomljivo+"/"+cenaPosiljke,
        {
            method:"POST"
        }).then(p => {
            if(p.ok)
            {
                this.updateTabeluPaketa(grad);
                this.updateTabeluPosti();
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }               
        }).catch(ps => alert(ps));
    }

    updateTabeluPaketa(grad)
    {
        let box = document.querySelector(".IspisPaketaBox");
        this.grad = box.value;
        if(grad != null && this.grad != null)
        {
            this.listaPaketa = [];
            let teloTabele = document.querySelector(".TabelaPaketa");
            let roditelj = teloTabele.parentNode;
            roditelj.removeChild(teloTabele);

            teloTabele = document.createElement("table");
            teloTabele.className = "TabelaPaketa";
            roditelj.appendChild(teloTabele);

            this.preuzmiPakete(this.grad, teloTabele);
        }
    }

    ubaciPaket(posiljalac, primalac, odrediste, tablice)
    {
        fetch("https://localhost:5001/Paket/UbaciPaket/"+posiljalac+"/"+primalac+"/"+odrediste+"/"+tablice,
        {
            method : "PUT"
        }).then(p => {
            if(p.ok)
            {
                this.updateTabeluVozila();
                this.updateTabeluPosti();
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }
        }).catch(ps => alert(ps));
    }

    preuzmiVozila(host, grad)
    {
        host.innerHTML = "";
        this.listaVozila = [];
        fetch("https://localhost:5001/Vozilo/SvaVozilaIzPoste/"+grad).then(p => {
            if(p.ok)
            {
                p.json().then(data => {
                    data.forEach(vozilo => {
                        const voz = new Vozilo(vozilo.id, vozilo.tablice, vozilo.max_kapacitet);
                        voz.unesiOpterecenje(vozilo.tr_kapacitet);
                        this.listaVozila.push(voz);
                    });
                    this.grad = grad;
                    this.tabelaVozila(host);
                }).catch(ps => alert(ps));
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }
        }).catch(ps => alert(ps));
    }

    tabelaVozila(host)
    {
        //host.innerHTML = "";

        let thead = document.createElement("thead");
        thead.className = "Thead";
        host.appendChild(thead);

        let tbody = document.createElement("tbody");
        tbody.className = "Tbody";
        host.appendChild(tbody);

        let td = document.createElement("td");
        td.className = "Tdata";
        td.innerHTML = "Tablice";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "Tdata";
        td.innerHTML = "Trenutni opterecenje";
        thead.appendChild(td);

        td = document.createElement("td");
        td.className = "Tdata";
        td.innerHTML = "Maksimalo opterecenje";
        thead.appendChild(td);

        this.listaVozila.forEach(p => {
            let r = document.createElement("tr");
            r.className = "Trow";
            tbody.appendChild(r);

            let td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.tablice;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.tr_opterecenje;
            r.appendChild(td);

            td = document.createElement("td");
            td.className = "Tdata";
            td.innerHTML = p.max_opterecenje;
            r.appendChild(td);
        })
    }

    prihvatiPaket(posiljalac, primalac, odrediste)
    {
        fetch("https://localhost:5001/Paket/PristigaoPaket/"+posiljalac+"/"+primalac+"/"+odrediste,
        {
            method : "PUT"
        }).then(p => {
            if(p.ok)
            {
                this.listaPaketa.forEach(paket => {
                    if(paket.posiljalac == posiljalac && paket.primalac == primalac &&
                        paket.odrediste == odrediste && paket.primljen == false)
                    {
                        paket.primljen = true;
                        console.log("Primljen");
                    }
                })
                this.updateTabeluVozila();
                this.updateTabeluPaketa(this.grad);
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }
        }).catch(ps => alert(ps));
    }

    izbrisiPakete(host)
    {
        let izbrisiPaketeForm = document.createElement("div");
        izbrisiPaketeForm.className = "izbrisiPaketForm";
        host.appendChild(izbrisiPaketeForm);

        let boxIzbrisiPakete = document.createElement("input");
        boxIzbrisiPakete.className = "boxIzbrisiPakete";
        boxIzbrisiPakete.setAttribute("type", "text");
        boxIzbrisiPakete.placeholder = "Grad";
        izbrisiPaketeForm.appendChild(boxIzbrisiPakete);

        let btnIzbrisi = document.createElement("button");
        btnIzbrisi.className = "Mainbuttons";
        btnIzbrisi.onclick = (ev) => {
            if(/^[A-Za-z\s]*$/.test(boxIzbrisiPakete.value) && boxIzbrisiPakete.value != null)
            {
                fetch("https://localhost:5001/Paket/IzbrisiPristiglePakete/"+boxIzbrisiPakete.value,
                {
                    method: "DELETE"
                }).then(p => {
                    if(!p.ok)
                    {
                        p.text().then(data => {
                            alert(data);
                        });
                    }
                    else
                    {
                        this.updateTabeluPaketa(boxIzbrisiPakete.value);
                        this.updateTabeluPosti();
                        this.updateTabeluVozila();
                    }
                }).catch(ps => alert(ps));
            }
            else
            {
                alert("IZBRISI PAKETE: Polje grad se mora popuniti, velika i mala slova su jedini podrzani karakteri");
            }
        }
        btnIzbrisi.innerHTML = "Izbrisi pakete";
        izbrisiPaketeForm.appendChild(btnIzbrisi);
    }
    //Unesi ostale entitete
    unesiPostu(grad, max_kp, post_broj)
    {
        fetch("https://localhost:5001/Posta/Dodaj/"+grad+"/"+max_kp+"/"+post_broj,
        {
            method:"POST"
        }).then(p => {
            if(p.ok)
            {
                this.updateTabeluPosti();
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }          
        }).catch(ps => alert(ps));
    }

    updateTabeluPosti()
    {
        let teloTabele = document.querySelector(".divTabelaPosti");
        let roditelj = teloTabele.parentNode;
        roditelj.removeChild(teloTabele);

        teloTabele = document.createElement("div");
        teloTabele.className = "divTabelaPosti";
        roditelj.appendChild(teloTabele);

        this.listaPosti = [];
        fetch("https://localhost:5001/Posta/SvePoste").then(m => {
            m.json().then(data => {
               data.forEach(posta => {
                   let pos = new Posta(posta.id, posta.pos_br, posta.grad, posta.tr_kap, posta.max_kp);
                   this.listaPosti.push(pos);
               });
               let divTabela = document.querySelector(".divTabelaPosti");
               console.log(this.listaPosti);
               this.ispisTabelePosti(divTabela);
            }).catch(ps => alert(ps));
        })
    }

    unesiPostara(ime, prezime, telefon, post_broj, tablice)
    {
        fetch("https://localhost:5001/Postar/DodajPostara/"+ime+"/"+prezime+"/"+telefon+"/"+post_broj+"/"+tablice,
        {
            method : "POST"
        }).then(p => {
            if(p.ok)
            {
                alert("Postar je dodat");
                this.updateTabeluVozila();
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }          
        }).catch(ps => alert(ps));
    }

    unesiVozilo(tablice, max_kap)
    {
        fetch("https://localhost:5001/Vozilo/DodajVozilo/"+tablice+"/"+max_kap,
        {
            method : "POST"
        }).then(p => {
            if(p.ok)
            {
                p.text().then(voz => {
                    let vozilo = new Vozilo(voz.ID, voz.tablice, voz.maxkap);
                    this.listaVozila.push(vozilo);
                    alert("Vozilo je dodato");
                });
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }          
        }).catch(ps => alert(ps));
    }

    updateTabeluVozila()
    {
        let box = document.querySelector(".IspisPaketaBox");
        this.grad = box.value;
        if(this.grad != null)
        {
            let teloTabele = document.querySelector(".TabelaVozila");
            let roditelj = teloTabele.parentNode;
            roditelj.removeChild(teloTabele);

            teloTabele = document.createElement("table");
            teloTabele.className = "TabelaVozila";
            roditelj.appendChild(teloTabele);

            this.preuzmiVozila(teloTabele, this.grad);
        }
    }

    //Brisanje ostalih entiteta
    obrisiPostu(grad)
    {
        let posta = null;
        this.listaPosti.forEach(p => {
            if(p.grad == grad)
            {
                posta = p;
            }
        });

        if(posta != null)
        {
            fetch("https://localhost:5001/Posta/Izbrisi/"+grad,
            {
                method : "DELETE"
            }).then(p => {
                if(!p.ok)
                {
                    p.text().then(data => {
                    alert(data);
                    });
                }
                else
                {
                    this.updateTabeluPosti();
                    this.updateTabeluPaketa(grad);
                    this.updateTabeluVozila();
                }
            }).catch(ps => alert(ps));
        }
        else
        {
            alert("Posta ne postoji");
        }
    }

    obrisiPostara(telefon)
    {
        fetch("https://localhost:5001/Postar/IzbrisiPostara/"+telefon,
        {
            method : "DELETE"
        }).then( p=> {
            if(p.ok)
            {
                let postar = null;
                this.listaPostara.forEach(m => {
                    if(m.telefon == telefon)
                    {
                        postar = m;
                    }
                    console.log(m);
                });
                if(postar == null)
                {
                    alert("Postar ne postoji");
                }
                else
                {
                    let index = this.listaPostara.indexOf(postar);
                    this.listaPostara.splice(index, 1);
                    this.updateTabeluVozila();
                }
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }
        }).catch(ps => alert(ps));
    }

    obrisiVozilo(tablice)
    {
        fetch("https://localhost:5001/Vozilo/IzbrisiVozilo/"+tablice,
        {
            method : "DELETE"
        }).then(p => {
            if(p.ok)
            {
                let vozilo = null;
                this.listaVozila.forEach(p => {
                    if(p.tablice == tablice)
                    {
                        vozilo = p;
                    }
                });
                let index = this.listaVozila.indexOf(vozilo);
                this.listaVozila.splice(index, 1);
                this.updateTabeluVozila();
                this.updateTabeluPaketa(this.grad);
            }
            else
            {
                p.text().then(data => {
                    alert(data);
                });
            }
        }).catch(ps => alert(ps));
    }

    izbrisiSideBar()
    {
        let div = document.querySelector(".divSideBar");
        let parent = div.parentNode;
        parent.removeChild(div);
    }
}    