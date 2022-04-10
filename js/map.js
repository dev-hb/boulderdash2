export class Map {
    #level;
    #player
    #totalGems

    constructor(player) {
        this.creerEspaceJeu();
        this.#player = player;
        if (localStorage.getItem("leniveau") === null ||
            localStorage.getItem("leniveau") > 
            localStorage.getItem("ordre_niveau").length)
            localStorage.setItem("leniveau", 1);
        this.#totalGems = this.nombreGemsDansMap();
        this.#level = localStorage.getItem("leniveau");
        this.affichierEspaceJeu();
    }

    // getter pour le total des diamonds
    get totalGems() { return this.#totalGems; }

    // création des différentes objets HTML
    creerEspaceJeu() {
        const nb_lignes = 16;
        const nb_colonnes = 32;
        var x = 0;
        var y = 0;
        document.querySelector("#espacejeu").innerHTML = "";
        for (let i = 0; i < nb_lignes; i++) {
            const objline = document.createElement('div');
            objline.id = 'line-' + i;
            document.querySelector('#espacejeu').appendChild(objline);
            for (var j = 0; j < nb_colonnes; j++) {
                const objspace = document.createElement('div');
                objspace.id = x + '-' + y;
                x++;
                document.getElementById(`line-${y}`).appendChild(objspace);
                if (document.getElementById(`line-${y}`).children.length == nb_colonnes) {
                    y++; x = 0;
                }
            }
        }
    }

    // permet d'afficher la totalité des objet de l'espace
    affichierEspaceJeu() {
        var map = localStorage.getItem("espace");
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 32; j++) {
                var objspace = document.getElementById(`${j}-${i}`);
                switch (map[i * 34 + j]) //CHARGEMENT DES TEXTURES
                {
                    case "M": objspace.style.cssText = "background-image: url('../images/wall.gif');"; break;
                    case "D": objspace.style.cssText = "background-image: url('../images/gem.gif');"; break;
                    case "T": objspace.style.cssText = "background-image: url('../images/dirt.gif');"; break;
                    case "R": objspace.style.cssText = "background-image: url('../images/rock.gif');"; break;
                    case "P": objspace.style.cssText = "background-image: url('../images/miner.gif');"; break;
                    case "V": objspace.style.cssText = "background-image: url('../images/space.gif');";break;
                }
            }
        }
    }

    // faire décendre les rochers dans le vide
    verifierEtatRocher() {
        var map = localStorage.getItem("espace");
        for (var i = 0; i < 32; i++) {
            var position_rocker = i;
            while (Math.floor(position_rocker / 34) < 16) {
                var map = localStorage.getItem("espace");
                if (map[position_rocker] == 'R' && map[position_rocker + 34] == 'V') {
                    this.#player.mettreAJourEspaceJeu(position_rocker, 'V');
                    this.#player.mettreAJourEspaceJeu(position_rocker + 34, 'R');
                } position_rocker++;
            }
        }
    }

    // Verifier si le joueur atteint tous les diamonds de l'espace
    verifierTotalGems() {
        if (this.#player.gems == this.#totalGems) {
            var niveau_pres = parseInt(localStorage.getItem("leniveau"));
            var niveau_suiv = localStorage.getItem("ordre_niveau")[this.#level];
            // Si le joueur termine la partie vérifier si c'est la dernière puis afficher game over
            if (this.#level == localStorage.getItem("ordre_niveau").length) {
                localStorage.setItem("moves", 0);
                localStorage.setItem("gems", 0);
                localStorage.setItem("espace", 0);
                localStorage.setItem("leniveau", 1);
                localStorage.setItem("espace", localStorage.getItem(`level${localStorage.getItem("ordre_niveau")[0]}`));
                // show game over
                document.getElementById('over').style.display = "flex";
            } else { // sinon afficher la page pour le niveau suivant
                document.getElementById('finishlevel').innerHTML = localStorage.getItem("leniveau");
                localStorage.setItem("leniveau", ++niveau_pres);
                this.#level++;
                localStorage.setItem("espace", localStorage.getItem(`level${niveau_suiv}`))
                this.#player.recommencer();
                this.#totalGems = this.nombreGemsDansMap();
                this.affichierEspaceJeu();
                document.getElementById('nextlevel').style.display = "flex";
            }
        }
    }

    // compter le nombre des diamonds dans l'espace
    nombreGemsDansMap() {
        if(localStorage.getItem("espace") == null) return 0;
        return localStorage.getItem("espace").split('').filter((e) => { return e == 'D'; }).length;
    }

    // Réinitialiser les attributs de niveau actuel
    recommencer() {
        var ordre = localStorage.getItem(`ordre_niveau`)[this.#level - 1];
        this.creerEspaceJeu();
        localStorage.setItem("espace", localStorage.getItem(`level${ordre}`))
        this.#totalGems = this.nombreGemsDansMap();
        this.#player.recommencer();
        document.querySelector("#gems").innerHTML = `${localStorage.getItem("gems")} / ${this.nombreGemsDansMap()}`;
        document.querySelector("#moves").innerHTML = this.#player.moves;
        this.affichierEspaceJeu();
    }
}
