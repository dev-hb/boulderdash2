export class Player {
    #etatJoueur = null;

    constructor() {
        this.#etatJoueur = {
            "mort": 0,
            "gems" : 0,
            "danger" : 0,
            "moves" : 0
        };
        if (localStorage.getItem("moves") === null) {
            localStorage.setItem("moves", 0);
        } else {
            this.#etatJoueur.moves = localStorage.getItem("moves");
        }
        this.#etatJoueur.moves = localStorage.getItem("moves");
    }

    // Faire bouger le joueur vers la direction  choisi
    async move(key) {
        var map = localStorage.getItem(`espace`);
        var pos = this.getPlayerpos(map);
        switch (key) {
            // Si le joureur appuis sur la touche Z
            case 'Z':
            case 'z':
                if (map[pos - 34] == 'T' || map[pos - 34] == 'V') {
                    this.mettreAJourEspaceJeu(pos - 34, 'P');
                    this.mettreAJourEspaceJeu(pos, 'V');
                    this.#etatJoueur.moves++;
                }else if (map[pos - 34] == 'D') {
                    this.mettreAJourEspaceJeu(pos - 34, 'P');
                    this.mettreAJourEspaceJeu(pos, 'V');
                    this.#etatJoueur.moves++;
                    this.#etatJoueur.gems++;
                } break;
            // Si le joueur appuis sur la touche Q
            case 'Q':
            case 'q':
                if (map[pos - 1] == 'T' || map[pos - 1] == 'V') {
                    this.mettreAJourEspaceJeu(pos - 1, 'P');
                    this.mettreAJourEspaceJeu(pos, 'V');
                    this.#etatJoueur.moves++;
                }else if (map[pos - 1] == 'D') {
                    this.mettreAJourEspaceJeu(pos - 1, 'P');
                    this.mettreAJourEspaceJeu(pos, 'V');
                    this.#etatJoueur.moves++;
                    this.#etatJoueur.gems++;
                }else if (map[pos - 1] == 'R') {
                    if (map[pos - 2] == 'V') {
                        this.mettreAJourEspaceJeu(pos - 2, 'R');
                        this.mettreAJourEspaceJeu(pos - 1, 'P');
                        this.mettreAJourEspaceJeu(pos, 'V');
                        this.#etatJoueur.moves++;
                    }
                } break;
            // Si le joueur appuis sur la touche S
            case 'S':
            case 's':
                if (map[pos + 34] == 'T' || map[pos + 34] == 'V') {
                    if (this.#etatJoueur.danger == 1) {
                        localStorage.setItem('mort', 1);
                        this.mettreAJourEspaceJeu(pos - 34, 'V');
                        this.#etatJoueur.mort = 1;
                    }else {
                        this.mettreAJourEspaceJeu(pos + 34, 'P');
                        this.mettreAJourEspaceJeu(pos, 'V');
                        this.#etatJoueur.moves++;
                    }
                }else if (map[pos + 34] == 'D') {
                    if (this.#etatJoueur.danger == 1) {
                        this.#etatJoueur.mort = 1;
                    }else {
                        this.mettreAJourEspaceJeu(pos + 34, 'P');
                        this.mettreAJourEspaceJeu(pos, 'V');
                        this.#etatJoueur.gems++;
                        this.#etatJoueur.moves++;
                    }
                }else if (this.#etatJoueur.danger == 1) this.#etatJoueur.mort = 1;
                break;
            // Si le joueur appuis sur la touche D
            case 'D':
            case 'd':
                if (map[pos + 1] == 'T' || map[pos + 1] == 'V') {
                    this.#etatJoueur.moves++;
                    this.mettreAJourEspaceJeu(pos + 1, 'P');
                    this.mettreAJourEspaceJeu(pos, 'V');
                }else if (map[pos + 1] == 'D') {
                    this.mettreAJourEspaceJeu(pos + 1, 'P');
                    this.mettreAJourEspaceJeu(pos, 'V');
                    this.#etatJoueur.gems++;
                    this.#etatJoueur.moves++;
                }else if (map[pos + 1] == 'R') {
                    if (map[pos + 2] == 'V') {
                        this.mettreAJourEspaceJeu(pos + 2, 'R');
                        this.mettreAJourEspaceJeu(pos + 1, 'P');
                        this.mettreAJourEspaceJeu(pos, 'V');
                        this.#etatJoueur.moves++;
                    }
                } break;
        }
    }

    // Récupérer la pos de joueur
    getPlayerpos() {
        var map = localStorage.getItem(`espace`)
        for(var i=0;i<map.length;i++) if(map[i] == 'P') return i;
    }

    // Mettre a jour l'espace de jeur
    mettreAJourEspaceJeu(index, chr) {
        var map = localStorage.getItem("espace");
        if (index > map.length - 1) return map;
        localStorage.setItem("espace", map.substring(0, index) + chr + map.substring(index + 1));
    }

    // Permet de vérifier si le joueur est en danger (en dessous d'un rocher)
    async verifierDangerJoueur() {
        var map = localStorage.getItem("espace");
        var pos = this.getPlayerpos();
        if (map[pos] == 'P' && map[pos - 34] == 'R') this.#etatJoueur.danger = 1;
        else this.#etatJoueur.danger = 0;
    }

    
    // Récupérer le nombre des diamonds    
    get gems() { return this.#etatJoueur.gems; }
    // Récupérer si le joueur et mort
    get mort() { return this.#etatJoueur.mort }
    // Récupérer le nombre des mouements
    get moves() { return this.#etatJoueur.moves; }

    // Recommencer le jeu avec les parametres initiales
    recommencer() {
        // Réinitialisation des attributs
        this.#etatJoueur.mort = 0;
        this.#etatJoueur.moves = 0;
        this.#etatJoueur.gems = 0;
        this.#etatJoueur.danger = 0;
        // Enregistrer les parametres dans le locale storage
        localStorage.setItem("mort", 0)
        localStorage.setItem("moves", 0);
        localStorage.setItem("gems", 0)
    }
}