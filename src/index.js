// chargement des librairies 
import Niveau1 from "/src/js/Niveau1.js";
import Niveau2 from "/src/js/Niveau2.js";
import Niveau3 from "/src/js/Niveau3.js"; 
import Selection from "/src/js/Selection.js"; 
import Menu from "/src/js/Menu.js"; 


var config = {
  type: Phaser.AUTO,
  width: 1000, // largeur en pixels
  height: 800, // hauteur en pixels
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
    scene: [Menu, Selection, Niveau1, Niveau2, Niveau3]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("Menu"); // lancement de la scene selection
