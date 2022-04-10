import { Map } from "./map.js"
import { Player } from "./player.js"

export class World {
    // Objet de joueur
    #player;
    // L'espace de jeu défini
    #map;

    // Céation d'un nouveau contexte de jeu
    constructor(map, player) {
        this.#map = map;
        this.#player = player;
        // Actualiser les objets affichés dans l'espace de jeu
        this.refresh();
    }

    // Actualisation des objets de l'espace
    refresh() {
        // Enregistrement des mouvements et diamonds collectés dans locale storage
        localStorage.setItem("gems", this.#player.gems);
        localStorage.setItem("moves", this.#player.moves)
        // Affichage des nouvelles statistiques
        document.querySelector("#gems").innerHTML = `${localStorage.getItem("gems")} / ${this.#map.totalGems}`;
        document.querySelector("#moves").innerHTML = this.#player.moves;
        document.querySelector("#level").innerHTML = `Niveau : ${localStorage.getItem("leniveau")}`
        // Afficher l'espace de jeu
        this.#map.affichierEspaceJeu();
    }
}