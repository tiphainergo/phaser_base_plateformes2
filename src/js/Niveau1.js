
var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var groupe_haies;
var gameOver = false;
var groupe_personnages;
var nouveau_personnage;
var chronoText;
var monTimer;
var chrono = 0;
var secondes = 0;
var minutes =0;
var acceleration = 250;
var vitessebase = 160;
var nombrePersonnagesRamasses = 0;
var nombrePersonnagesText;
var musique_de_fond;


export default class Niveau1 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {super({key: "Niveau1", //  ici on précise le nom de la classe en tant qu'identifiant
    physics: {
      default: 'arcade',
      arcade: { 
        gravity: { y: 0 }
      }
    }});
    }
    
    preload() {
      // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
    
      this.load.spritesheet("img_perso3", "src/assets/dude2.png", {
        frameWidth: 32,
        frameHeight: 48
      });
    
      this.load.image("Phaser_GradinBas", "src/assets/GradinBas.png");
      this.load.image("Phaser_GradinHaut", "src/assets/GradinHaut.png");
      this.load.image("Phaser_Terrain", "src/assets/Piste_track.png");
      this.load.image("img_haie", "src/assets/Haie.png");
      this.load.image("img_personnage0", "src/assets/Personnage0.png");
      this.load.image("img_personnage1", "src/assets/Personnage1.png");
      this.load.image("img_personnage2", "src/assets/Personnage2.png");
      this.load.image("img_personnage3", "src/assets/Personnage3.png");
      this.load.image("img_personnage4", "src/assets/Personnage4.png");
      this.load.image("img_personnage5", "src/assets/Personnage5.png");
      this.load.image("img_personnage6", "src/assets/Personnage6.png");
      this.load.image("img_personnage7", "src/assets/Personnage7.png");
      this.load.image("img_personnage8", "src/assets/Personnage8.png");
      this.load.image("img_personnage9", "src/assets/Personnage9.png");
      this.load.image("img_personnage10", "src/assets/Personnage10.png");
      this.load.image("img_personnage11", "src/assets/Personnage11.png");
      this.load.image("img_personnage12", "src/assets/Personnage12.png");
      this.load.image("img_personnage13", "src/assets/Personnage13.png");
      this.load.image("img_porte1", "src/assets/door1.png");
      this.load.tilemapTiledJSON("carte2", "src/assets/Maplulu.tmj");
      this.load.audio('son', 'src/assets/sonlulu.mp3');
    }
    /***********************************************************************/
    /** FONCTION CREATE 
    /***********************************************************************/
    
    /* La fonction create est appelée lors du lancement de la scene
     * si on relance la scene, elle sera appelée a nouveau
     * on y trouve toutes les instructions permettant de créer la scene
     * placement des peronnages, des sprites, des platesformes, création des animations
     * ainsi que toutes les instructions permettant de planifier des evenements
     */
     create() {
      /*************************************
       *  CREATION DU MONDE + PLATEFORMES  *
       *************************************/
    
      // Création de la carte

      const carteDuNiveau = this.add.tilemap("carte2");
    
      // Création du jeu de tuiles
      const ts1 = carteDuNiveau.addTilesetImage("Terrain", "Phaser_Terrain");
      const ts2 = carteDuNiveau.addTilesetImage("GradinBas", "Phaser_GradinBas");
      const ts3 = carteDuNiveau.addTilesetImage("GradinHaut", "Phaser_GradinHaut");
    
    
    // Création du calque Fond
  const Fond = carteDuNiveau.createLayer(
    "Fond",
    [ts1, ts2, ts3]
  );

  groupe_haies = this.physics.add.staticGroup();
  // extraction des poitns depuis le calque Haies, stockage dans tab_points
  const tab_points1 = carteDuNiveau.getObjectLayer("Haies");

  // on fait une boucle foreach, qui parcours chaque élements du tableau tab_points  
  tab_points1.objects.forEach(point => {
    if (point.name == "haie") {
      groupe_haies.create(point.x, point.y, "img_haie");
    }
  });
  
      /********************************************
       *  CREATION DES PERSONNAGES A RAMASSER  *
       ******************************************/
      groupe_personnages = this.physics.add.group();
    
      const tab_points2 = carteDuNiveau.getObjectLayer("Personnages");
      var i = 0;
      // on fait une boucle foreach, qui parcours chaque élements du tableau tab_points  

      tab_points2.objects.forEach(point => {
        if (point.name == "Personnage") {
          var nouveau_personnage = this.physics.add.sprite(point.x, point.y, "img_personnage" + i);
          i++;
          groupe_personnages.add(nouveau_personnage);
        }
      });
    
    
    
      /****************************
       *  CREATION DU PERSONNAGE  *
       ****************************/
    
      // On créée un nouveeau personnage : player
      player = this.physics.add.sprite(100, 416, "img_perso3");
    
      //  propriétées physiqyes de l'objet player :
      player.setBounce(0); // on donne un petit coefficient de rebond
      player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
      player.setSize(32, 46);
      player.setDepth(10);
    
    
    
    
      /***************************
       *  CREATION DES ANIMATIONS *
       ****************************/
      // dans cette partie, on crée les animations, à partir des spritesheet
      // chaque animation est une succession de frame à vitesse de défilement défini
      // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    
      this.anims.create({
        key: "anim_marcher",
        frames: this.anims.generateFrameNumbers("img_perso3", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
    
      this.anims.create({
        key: "anim_face",
        frames: [{ key: "image_perso3", frame: 4 }],
        frameRate: 20,
      });
    
      player.setVelocityX(160);
      player.anims.play("anim_marcher", true);
    

    
      // creation de l'animation "anim_deplacer_en_haut" qui sera jouée sur le player lorsqu'on clique sur la fleche du haut
      // creation de l'animation "anim_deplacer_en_bas" qui sera jouée sur le player lorsqu'on clique sur fleche du bas
    
      /***********************
       *  CREATION DU CLAVIER *
       ************************/
      // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
      clavier = this.input.keyboard.createCursorKeys();
    
      /*****************************************************
       *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
       ******************************************************/
    
      //  Collide the player and the groupe_haies with the groupe_plateformes
      this.physics.add.collider(player, Fond);
      this.physics.add.collider(player, groupe_haies, chocavechaie, null, this);
      this.physics.add.overlap(player, groupe_personnages, ramasserPersonnage, null, this);
      this.porte1 = this.physics.add.staticSprite(80, 416, "img_porte1");
      this.porte2 = this.physics.add.staticSprite(15904, 384, "img_porte1");

      Fond.setCollisionByProperty({ estSolide: true });
    
      // redimentionnement du monde avec les dimensions calculées via tiled
      this.physics.world.setBounds(0, 0, 16000, 768);
      //  ajout du champs de la caméra de taille identique à celle du monde
      this.cameras.main.setBounds(0, 0, 16000, 768);
      // ancrage de la caméra sur le joueur
      this.cameras.main.startFollow(player);
    
      /*****************************************************
      *  CREATION DU CHRONOMETRE *
      ******************************************************/
      monTimer = this.time.addEvent({
        delay: 1000,
        callback: compteUneSeconde,
        callbackScope: this,
        loop: true
      });
    
      chronoText = this.add.text(16, 210, "Chrono: 00,00", {
        fontSize: "24px",
        fill: "#FFFFFF" //Couleur de l'écriture
      });
      chronoText.setScrollFactor(0);
    
    /*****************************************************
      *  CREATION DU COMPTEUR *
      ******************************************************/
    nombrePersonnagesText = this.add.text(16, 260, "Elèves ramassés: 0", {
      fontSize: "24px",
      fill: "#FFFFFF" // Couleur de l'écriture
    });
    nombrePersonnagesText.setScrollFactor(0);

    musique_de_fond = this.sound.add('son'); 
    // lancement du son background
      musique_de_fond.play();  

    }
  
    
    
    /***********************************************************************/
    /** FONCTION UPDATE 
    /***********************************************************************/
    
    update() {
      player.anims.play("anim_marcher", true); // Joue l'animation de marche

  // Vérifie les entrées du clavier pour les déplacements verticaux
  if (clavier.up.isDown) {
    player.setVelocityY(-160);
  } else if (clavier.down.isDown) {
    player.setVelocityY(160);
  } else {
    player.setVelocityY(0); // Arrête le mouvement vertical si aucune touche n'est enfoncée
  }

  // Vérifie l'entrée du clavier pour le déplacement horizontal
  if (clavier.right.isDown) {
    player.setAccelerationX(acceleration); // Accélère vers la droite lorsque la touche droite est enfoncée
  } else {
    player.setAccelerationX(0); // Arrête l'accélération lorsque la touche droite est relâchée
    player.setVelocityX(vitessebase);
  }

  // Vérifie si le joueur est à la hauteur de la porte
  if ( player.x >= 15904) {
    // Arrête le joueur
    player.setAccelerationX(0);
    player.setVelocityX(0);

    // Vérifie si le joueur peut se déplacer vers le haut ou vers le bas
    if (clavier.up.isDown) {
      player.setVelocityY(-160);
    } else if (clavier.down.isDown) {
      player.setVelocityY(160);
    } else {
      player.setVelocityY(0); // Arrête le mouvement vertical si aucune touche n'est enfoncée
    }
    if (clavier.space.isDown && nombrePersonnagesRamasses < 8 && this.physics.overlap(player, this.porte2)) {
      // Redémarre la scène
      musique_de_fond.stop();  
      this.scene.restart();
    }
  
    // Vérifie si le joueur a appuyé sur la touche espace et s'il a au moins 10 personnages ramassés
    if (clavier.space.isDown && nombrePersonnagesRamasses >= 8 && this.physics.overlap(player, this.porte2)) {
      // Passe à la scène de sélection
      musique_de_fond.stop();  
      this.scene.switch("Selection");
    }
  }
}
}

function chocavechaie(player, groupe_haies) {
  this.physics.pause();
  player.setTint(0xff0000);
  resetTimer();
  monTimer.reset();
  resetnombrePersonnagesRamasses();
  musique_de_fond.stop();  
  this.scene.restart();
}
    
    function ramasserPersonnage(un_player, un_personnage) {
      // on désactive le "corps physique" de l'étoile mais aussi sa texture
      // l'étoile existe alors sans exister : elle est invisible et ne peut plus intéragir
      un_personnage.disableBody(true, true);
      nombrePersonnagesRamasses++; // Incrémente le compteur de personnages ramassés
      // Met à jour le texte affichant le nombre de personnages ramassés
      nombrePersonnagesText.setText("Elèves ramassés: " + nombrePersonnagesRamasses);
    }
    
function compteUneSeconde() {
  secondes++; // Incrémente les secondes

  // Si les secondes atteignent 60, réinitialise à 0 et incrémente les minutes
  if (secondes >= 60) {
    secondes = 0;
    minutes++;
  }

  // Met à jour le texte du chronomètre avec le format mm:ss
  chronoText.setText("Chrono: " + pad(minutes) + "," + pad(secondes));
}

function resetTimer() {
  // Réinitialise le chrono, les minutes et les secondes à zéro
  chrono = 0;
  minutes = 0;
  secondes = 0;

  // Met à jour l'affichage du chronomètre
  chronoText.setText("Chrono: 00,00");
}

function pad(value) {
  return value < 10 ? '0' + value : value;
}

function resetnombrePersonnagesRamasses (){
  nombrePersonnagesRamasses=0;
}
