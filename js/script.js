
//array contenente le immagini
let array_cibo = ['assets/05_apple_pie.png','assets/07_bread.png','assets/09_baguette.png','assets/11_bun.png','assets/13_bacon.png','assets/15_burger.png','assets/18_burrito.png','assets/20_bagel.png','assets/22_cheesecake.png','assets/24_cheesepuff.png','assets/26_chocolate.png','assets/28_cookies.png','assets/30_chocolatecake.png','assets/32_curry.png','assets/34_donut.png','assets/36_dumplings.png','assets/38_friedegg.png','assets/40_eggsalad.png','assets/42_eggtart.png','assets/44_frenchfries.png','assets/46_fruitcake.png','assets/48_garlicbread.png','assets/50_giantgummybear.png','assets/52_gingerbreadman.png','assets/54_hotdog.png','assets/57_icecream.png','assets/59_jelly.png','assets/61_jam.png','assets/63_lemonpie.png','assets/65_loafbread.png','assets/67_macncheese.png','assets/69_meatball.png','assets/71_nacho.png','assets/73_omlet.png','assets/75_pudding.png','assets/77_potatochips.png','assets/79_pancakes.png','assets/81_pizza.png','assets/83_popcorn.png','assets/85_roastedchicken.png','assets/87_ramen.png','assets/88_salmon.png','assets/90_strawberrycake.png','assets/92_sandwich.png','assets/94_spaghetti.png','assets/95_steak.png','assets/97_sushi.png','assets/99_taco.png','assets/101_waffle.png','assets/06_apple_pie_dish.png']
//per ora mi carico solo queste in libreria

//mi seleziono la tabella
let tabella = document.querySelector('table')

//mi creo una variabile per gestire le animazioni delle caselle
let azione_terminata = true

//mi creo una variabile ultima casella cosi' da gestire due caselle uguali
let ultima_casella 

let n_righe = 4 
let n_colonne = 4
let difficolta = 10

//variabile minuti
let min = 0

//variabile secondi
let sec = 0

//variabile ore
let ore = 0

//variabile che raccoglie tutti gli span
let orologio = document.querySelectorAll('body p span')

//variabile intervallo orologio
let intervallo_orologio

//variabile numero caselle
let numero_caselle = n_righe * n_colonne

//variabile contatore delle coppie corrette
let contatore_coppie_corrette = 0

//la lista contentente le immagini mischiate
let lista_immagini_mischiata = shuffle(crea_lista_immagini_uguali(n_righe, n_colonne, difficolta))

//mi devo creare una lista immagini in base ai parametri che io ottengo
//ovvero le righe e le colonne della tabella cosi' che quando vado a creare
//l'elemento immagine, ce ne siano sempre 2 uguali
function crea_lista_immagini_uguali(righe, colonne, difficolta){
    const numero_immagini = (righe * colonne)/2
    let contatore = 0
    let risultato = []
    let lista_risultato = []
    let liste_risultato = []
    let lista_cibo_in_base_alla_difficolta = array_cibo.slice(0,difficolta)
    console.log(lista_cibo_in_base_alla_difficolta, difficolta)
    while (contatore < numero_immagini){
        const rand_img = segli_immagine_randomica(lista_cibo_in_base_alla_difficolta)
        if (lista_cibo_in_base_alla_difficolta.length > lista_risultato.length){
            if (!lista_risultato.includes(rand_img)){
                lista_risultato.push(rand_img)
            }else{
                contatore--
            }
        }else{
            liste_risultato.push(lista_risultato) 
            lista_risultato = []
            contatore--
        }
        contatore++
    }
    liste_risultato.push(lista_risultato)

    for (const iterator of liste_risultato) {
        risultato = risultato.concat(iterator)
    } 
    risultato = risultato.concat(risultato)
    return risultato
}

//mi serve una funzione che mi mescoli gli elementi della lista
//altrimenti il gioco sarebbe troppo semplice siccome le caselle
//avrebbero tutte lo stesso pattern
function shuffle(lista_da_mischiare){
    let copia_lista_da_mischiare = [...lista_da_mischiare]
    let lista_risultato = []
    while (copia_lista_da_mischiare.length > 0){
        const indice_casuale = Math.floor(Math.random()*copia_lista_da_mischiare.length)
        lista_risultato.push(copia_lista_da_mischiare[indice_casuale])
        copia_lista_da_mischiare.splice(indice_casuale, 1)
    }
    return lista_risultato
}

//mi creo una funzione che modifica l'opacita' di un elemento
function modifica_opacita(elemento){
    if (elemento.style.opacity == 1 || elemento.style.opacity == ''){
        elemento.style.opacity = 0
    }else{
        elemento.style.opacity = 1
    }
}

//probabilmente usero' una tabella per creare il memory quindi mi faccio una funzione che mi crea le caselle
function crea_caselle(){
    const elemento_div = document.createElement('div')
    const elemento_casella = document.createElement('td')
    const elemento_immagine = document.createElement('img')
    elemento_immagine.src = segli_immagine_randomica_con_remove(lista_immagini_mischiata)
    elemento_div.addEventListener('click', () => {
        if (azione_terminata){
            modifica_opacita(elemento_div)
            if(ultima_casella == undefined){
                ultima_casella = [elemento_div,elemento_immagine]
            }else if(ultima_casella[1].src == elemento_immagine.src && ultima_casella[0] !== elemento_div){
                ultima_casella[1].style = 'animation: tilt-n-move-shaking 1s ease-in 0.4s ;'
                elemento_immagine.style = 'animation: tilt-n-move-shaking 1s ease-in 0.4s ;'
                azione_terminata = false
                setTimeout(() =>{
                    elemento_div.remove()
                    ultima_casella[0].remove()
                    ultima_casella = undefined
                    contatore_coppie_corrette++
                    hai_vinto()
                    azione_terminata = true
                } , 1000)
            }else{
                azione_terminata = false
                setTimeout(() =>{
                    modifica_opacita(elemento_div)
                    modifica_opacita(ultima_casella[0])
                    ultima_casella = undefined
                    azione_terminata = true
                } , 1000) 
            }
        }

    })
    elemento_casella.appendChild(elemento_immagine)
    elemento_casella.appendChild(elemento_div)
    return elemento_casella
}

//siccome avro' bisogno di immagini random mi creo una funzione che data una lista mi ritorna un'immagine
//so che non la riutilizzero' ma per pratica la faccio riutilizzabile
function segli_immagine_randomica(lista_immagini){
    const indice_casuale = Math.floor(Math.random()*lista_immagini.length)
    return lista_immagini[indice_casuale]
}

//siccome per non far ripetere le caselle mi serve rimuovere l'elemento che sto prendendo,
//mi creo la stessa funzione ma che rimuove anche l'elemento dalla lista,
//cosi' che utilizzo tutti gli elementi generati con crea_lista
function segli_immagine_randomica_con_remove(lista_immagini){
    const indice_casuale = Math.floor(Math.random()*lista_immagini.length)
    const elemento_da_ritornare = lista_immagini[indice_casuale]
    lista_immagini.splice(indice_casuale,1)
    return elemento_da_ritornare
}

//siccome voglio rendere la tabella dinamica e avere 2 input, cosi' che il giocatore
//possa scegliere la dimensione della propria tabella, allora mi creo una funzione che
//in base all input di righe e colonne mi crea tale tabella
function crea_tabella(righe, colonne){
    reset_orologio()
    if ((righe*colonne)%2 == 0 && righe > 0 && righe <= 10 && colonne > 0 && colonne <= 20 & difficolta%2 == 0){
        for (let index = 0; index < righe; index++) {
            const elemento_riga = document.createElement('tr')
            for (let index = 0; index < colonne; index++) {
                const elemento_colonna = crea_caselle()
                elemento_riga.appendChild(elemento_colonna)
            }
            tabella.appendChild(elemento_riga)
        }
    }
    else{
        alert('numero dispari')
    }
    intervallo_orologio = setInterval(logica_orologio,1000)
}

//mi creo la funzione da associare al bottone e agli input
function prendi_input(input_righe, input_colonne, input_difficolta){
    const regexnumb = /^[0-9]*$/
    if (regexnumb.test(+input_righe) && regexnumb.test(+input_colonne) && regexnumb.test(+input_difficolta) && input_righe != '' && input_colonne != '' && input_difficolta != ''){
        n_righe = input_righe
        n_colonne = input_colonne
        difficolta = input_difficolta
    }else{
        alert('non hai selezionato un numero corretto')
    }
}

//una volta ottenuti gli input devo cancellare e costuire nuovamente la tabella
function genera_tabella_con_input(){
    contatore_coppie_corrette = 0
    prendi_input(document.querySelectorAll('body input')[0].value, document.querySelectorAll('body input')[1].value, document.querySelectorAll('body input')[2].value)
    numero_caselle = n_righe * n_colonne
    lista_immagini_mischiata = shuffle(crea_lista_immagini_uguali(n_righe, n_colonne, difficolta))
    clear_tabella()
    crea_tabella(n_righe, n_colonne)
}

//una funzione che rimuove la tabella e la ricrea vuota
function clear_tabella(){
    tabella.remove()
    const elemento_tabella = document.createElement('table')
    document.querySelector('body').insertBefore(elemento_tabella, document.querySelector('body p'))
    tabella = document.querySelector('table')
}

//associo la funzione al bottone
document.querySelector('body button').addEventListener('click',() => genera_tabella_con_input())

//mi creo una funzione che stabilisce se ho vinto o meno
function hai_vinto(){
    if (contatore_coppie_corrette == numero_caselle/2){
        alert('hai_vinto')
        clearInterval(intervallo_orologio)
    }
}

//funzione che aziona l'orologio
function logica_orologio(){
    if (sec < 59){
        sec++
        if (sec < 10){
            orologio[2].innerHTML = '0'+sec
        }else{
            orologio[2].innerHTML = sec
        }
    }else if(sec == 59){
        sec = 0
        orologio[2].innerHTML = '0'+sec
        min++
        if (min < 10){
            orologio[1].innerHTML = '0'+min
        }else{
            orologio[1].innerHTML = min
        }
    }else if(min == 59){
        min = 0
        orologio[1].innerHTML = '0'+min
        ore++
        if (ore < 10){
            orologio[0].innerHTML = '0'+ore
        }else{
            orologio[0].innerHTML = ore
        }
    }
}

//funzione che resetta l'orologio
function reset_orologio(){
    clearInterval(intervallo_orologio)
    sec = 0
    min = 0
    ore = 0
    orologio[2].innerHTML = '0'+sec
    orologio[1].innerHTML = '0'+min
    orologio[0].innerHTML = '0'+ore
}

crea_tabella(n_righe, n_colonne)


