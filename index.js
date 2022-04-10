import { Map } from "./js/map.js";
import { Player } from "./js/player.js";
import { World } from "./js/world.js";


// Charger les niveau par défaut s'il n'existe pas sur le local storage
if (localStorage.getItem("ordre_niveau") === null) {
    localStorage.clear();
    // ordre par défaut des niveau 1 ==> 2 ==> 3
    localStorage.setItem("ordre_niveau", 123);
    // charger chaque fichier
    await Promise.all([
            fetch('../levels/niv1.txt').then(x => x.text()),
            fetch('../levels/niv2.txt').then(x => x.text()),
            fetch('../levels/niv3.txt').then(x => x.text())
        ]).then(([niv1, niv2, niv3]) => {
            localStorage.setItem(`level1`, niv1);
            localStorage.setItem(`level2`, niv2);
            localStorage.setItem(`level3`, niv3);
            localStorage.setItem("espace", localStorage.getItem(`level${localStorage.getItem("ordre_niveau")[0]}`));
        });
    window.location = "";
}

// définier le niveau courant de jeu
if (localStorage.getItem("leniveau") > localStorage.getItem("ordre_niveau").length) {
    localStorage.setItem("leniveau", 1);
}

// Mouvement de joueur
window.addEventListener('keydown', async function (e) {
    var keys = ["z", "q", "s", "d"];
    if (keys.includes(e.key)) {
        if (localStorage.getItem("mort") != 1) {
            player.move(e.key); // déplacer l'utilisateur vers la direction choisi
            if (player.mort == 0) {
                // Vérifier les différentes régles de jeu
                map.verifierEtatRocher();
                player.verifierDangerJoueur();
                map.verifierTotalGems();
                // Afficher tous les objets de jeu
                map.affichierEspaceJeu();
            } else { // si le joueur est mort
                var position = player.getPlayerpos();
                var idMurder = `${Math.floor(position % 34)}-${Math.floor(position / 34) - 1}`;
                document.getElementById(idMurder).style.backgroundImage = "url('../images/space.gif')";
                var idPlayer = `${Math.floor(position % 34)}-${Math.floor(position / 34)}`;
                document.getElementById(idPlayer).style.backgroundImage = "url('../images/rock_blood.gif')";
                await new Promise(res => setTimeout(res, 1000));
                // Afficher la page jeu perdu et recommencer le niveau
                document.getElementById('redo').style.display = "flex";
                map.recommencer();
            }
        }
    }
    world.refresh();
}, false);

// création des instances pour démarer la partie
var player = new Player();
var map = new Map(player);
var world = new World(map, player);
// afficher les objets sur l'ecran
world.refresh();

// afficher reprendre partie si deja existe
if(localStorage.getItem("leniveau") == 1 && player.moves == 0){
  document.getElementById('reprendre').style.display = "none";
}

// définir un niveau par défaut s'il n'existe pas
window.addEventListener('load', function () {
    if (this.localStorage.getItem("ordre_niveau") === null) {
        this.localStorage.setItem("ordre_niveau", 123);
    } listLevels();
});

// en cas de changement de l'ordre afficher la nouvelle liste
window.addEventListener('storage', function (e) { if (e.key === "ordre_niveau") listLevels(); });
// Evenement de téléchargement d'un fichier de niveau
document.querySelector("#file").addEventListener('change', function (e) {
    if (document.querySelector("#file").value != "") {
        const reader = new FileReader()
        reader.addEventListener('load', function (event) {
            if (verifierFichierEntree(event.target.result) == true) {
                for (var i = 1; i <= localStorage.length; i++) {
                    if (localStorage.getItem(`level${i}`) === null) {
                        localStorage.setItem(`level${i}`, event.target.result);
                        localStorage.setItem("ordre_niveau", `${localStorage.getItem("ordre_niveau")}${i}`)
                        listLevels(); break;
                    }
                }
            }
        }); reader.readAsText(e.target.files[0])
    }
});

// afficher la liste des niveau
function listLevels() {
    var oldOrder = localStorage.getItem("ordre_niveau");
    document.querySelector('#list').innerHTML = "";
    for (var i = 1; i <= oldOrder.length; i++) {
        const level = document.createElement('div');
        level.setAttribute('class', 'lvl');
        document.querySelector('#list').appendChild(level);
        level.id = `level${oldOrder[i - 1]}`;
        let str = `<table width='100%'><tr><td>Niveau : ${i}</td></tr>`
        str += `<tr><td><a id="delete${oldOrder[i - 1]}" class='del'>supprimer</a></td>`;

        if (i != 1) {
            str += `<td><a id="up${oldOrder[i - 1]}" class='up'>&uarr; ascendre</a></td>`;
        }
        if (i != oldOrder.length) {
            str += `<td><a id="down${oldOrder[i - 1]}" class='down'>&darr; descendre</a></td>`;
        }

        str += `</tr></table><div id="espacejeu${oldOrder[i - 1]}" class='preview'></div>`;
        level.innerHTML = str;
    }
    creerEspaceJeu();
    affichierEspaceJeu();
    supprimerNiveau();
    deplacerNiveauHaut();
    deplacerNiveauBas();
}

// Créer un espace d'affichage pour l'organisation
function creerEspaceJeu() {
    var oldOrder = localStorage.getItem("ordre_niveau");
    const nb_lignes = 16;
    const nb_colonnes = 32;
    for (var j = 1; j <= oldOrder.length; j++) {
        document.querySelector(`#espacejeu${oldOrder[j - 1]}`).innerHTML = "";
        for (var i = 0; i < nb_lignes; i++) {
            const lElement = document.createElement('div');
            lElement.id = `level-${oldOrder[j - 1]}-line-${i}`;
            document.querySelector(`#espacejeu${oldOrder[j - 1]}`).appendChild(lElement);
            for (let k = 0; k < nb_colonnes; k++) {
                const elemnt = document.createElement('div');
                elemnt.setAttribute('class', 'vigobj');
                elemnt.id = `${oldOrder[j - 1]}-${i}-${k}`;
                document.getElementById(`level-${oldOrder[j - 1]}-line-${i}`).appendChild(elemnt);
            }
        }
    }
}

// Afficher chaque espace de jeu dans l'organisation des niveaux
function affichierEspaceJeu() {
    var oldOrder = localStorage.getItem("ordre_niveau");
    for (var i = 1; i <= oldOrder.length; i++) {
        var map = localStorage.getItem(`level${oldOrder[i - 1]}`);
        for (var j = 0; j < 16; j++) {
            document.querySelector(`#level-${oldOrder[i - 1]}-line-${j}`).style.cssText =
                `display: flex; border: none; width: 320px; height: 100%;`;
            for (var k = 0; k < 32; k++) {
                var elemnt = document.getElementById(`${oldOrder[i - 1]}-${j}-${k}`);
                switch (map[j * 34 + k]) {
                    case "M": elemnt.style.cssText = `background-image: url('../images/wall.gif');`; break;
                    case "D": elemnt.style.cssText = `background-image: url('../images/gem.gif');`; break;
                    case "T": elemnt.style.cssText = `background-image: url('../images/dirt.gif');`; break;
                    case "R": elemnt.style.cssText = `background-image: url('../images/rock.gif');`; break;
                    case "P": elemnt.style.cssText = `background-image: url('../images/miner.gif');`; break;
                    case "V": elemnt.style.cssText = `background-image: url('../images/space.gif');`; break;
                }
            }
        }
    }
}

// Supprimer un niveau de la liste
function supprimerNiveau() {
    var elements = document.querySelectorAll(".del");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function (event) {
            modifierOrdreNiveaux(getLevelOrder(this.id[6]), "");
            listLevels();
        });
    }
}

// modifier l'ordre
function modifierOrdreNiveaux(index, chr) {
    var str = localStorage.getItem(`ordre_niveau`);
    if (index > str.length - 1) {
        return str;
    }
    localStorage.setItem(`ordre_niveau`, str.substring(0, index) + chr + str.substring(index + 1));
}

// Récupérer l'ordre des niveaux
function getLevelOrder(level) {
    var order = localStorage.getItem("ordre_niveau")
    for (var i = 0; i < order.length; i++) {
        if (order[i] == level) {
            return i;
        }
    }
    return null;
}

// Verifier les caracteres dans le fichier à télécharger
function verifierFichierEntree(map) {
    let arr = ['M', 'T', 'R', 'P', 'V', 'D', '\r', '\n'];
    for (var i = 0; i < map.length; i++) {
        if (! arr.includes(map[i])) {
            alert(`carcatère non accepté: ${map[i]}`);
            return false;
        }
    } alert("Vous avez ajouté un nouveau niveau");
    return true;
}

// Déplacer un niveau ver le haut
function deplacerNiveauHaut() {
    var elements = document.querySelectorAll(".up");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function (event) {
            var order = localStorage.getItem("ordre_niveau");
            var mapIndex = getLevelOrder(this.id[2]);
            var mapValue = this.id[2];
            let newOrder = remplacerChaine(order, mapIndex - 1, mapValue);
            newOrder = remplacerChaine(newOrder, mapIndex, order[mapIndex - 1])
            localStorage.setItem("ordre_niveau", newOrder)
            listLevels();
        });
    }
}

// déplacer un niveau vers le bas
function deplacerNiveauBas() {
    var elements = document.querySelectorAll(".down");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function (event) {
            var order = localStorage.getItem("ordre_niveau");
            var mapIndex = getLevelOrder(this.id[4]);
            var mapValue = this.id[4];
            let newOrder = remplacerChaine(order, mapIndex + 1, mapValue);
            newOrder = remplacerChaine(newOrder, mapIndex, order[mapIndex + 1])
            localStorage.setItem("ordre_niveau", newOrder)
            listLevels();
        });
    }
}

// Remplacer une partie de chaine de carateres
function remplacerChaine(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

// Action Menu principal et liens de navigation
// Créer une nouvelle partie
document.querySelector('#newgame').addEventListener('click', () => {
    document.getElementById('mainmenu').style.display = "none";
    document.getElementById('bdcontainer').style.display = "flex";
    localStorage.setItem("moves", 0);
    localStorage.setItem("gems", 0);
    localStorage.setItem("espace", 0);
    localStorage.setItem("leniveau", 1);
    localStorage.setItem("espace", localStorage.getItem(`level${localStorage.getItem("ordre_niveau")[0]}`));
    document.getElementById('reprendre').style.display = "block";
    player = new Player();
    map = new Map(player);
    world = new World(map, player);
    map.recommencer();
    world.refresh();
});

// Pause le jeu (afficher la page d'accueil)
document.getElementById("pause").addEventListener('click', function () {
    document.getElementById('mainmenu').style.display = "block";
    document.getElementById('bdcontainer').style.display = "none";
});

// Dépause le jeu
document.querySelector("#reprendre").addEventListener('click', () => {
    document.getElementById('mainmenu').style.display = "none";
    document.getElementById('bdcontainer').style.display = "flex";
});

// recommencer le niveau
document.getElementById("recommencer").addEventListener('click', function () {
    map.recommencer();
    world.refresh();
});

// afficher le niveau suivant
["gonext", "goredo"].map((e) => {
    document.getElementById(e).addEventListener('click', () => {
        document.querySelector('#nextlevel').style.display = "none";
        document.querySelector('#redo').style.display = "none";
    });
})

// afficher l'accueil après jeu terminé
document.querySelector('#gopause').addEventListener('click', () => {
    document.querySelector('#over').style.display = "none";
    document.getElementById('bdcontainer').style.display = "none";
    document.getElementById('mainmenu').style.display = "block";
});

// organisation des niveaux
document.querySelector('#organiser').addEventListener('click', () => {
    document.getElementById('mainmenu').style.display = "none";
    document.getElementById('organiseur').style.display = "block";
});

// Retour a l'accueil
document.querySelector('#gohome').addEventListener('click', () => {
    document.getElementById('mainmenu').style.display = "block";
    document.getElementById('organiseur').style.display = "none";
});