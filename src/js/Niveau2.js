
var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier;// pour la gestion du clavier
var boutonFeu;  
var cursors;
// mise en place d'une variable groupeBullets
var groupefleche;  
var groupecible;  

var gameOver = false; 
var chronoText;
var monTimer;
var chrono = 180;
var secondes = 60;
var minutes = 2;
var porte; 
var nombreCiblesRestantes; 
var groupe_ennemis;
var nombreCiblesRestantesText;
var musique_de_fond;
var musique_tir; 


export default class Niveau2 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
      super({
        key: "Niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
      });
    }
    preload() {
      // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
      
      this.load.spritesheet("img_perso2", "src/assets/dudearc.png", {
        frameWidth: 32,
        frameHeight: 64
      });
    
      this.load.image("fleche", "src/assets/fleche.png");  
      // chargement de l'image cible.png
      this.load.image("cibles", "src/assets/cible.png");
      
      // chargement tuiles de jeu et anneaux
    this.load.image("tuiledejeu", "src/assets/tuilesBis.png");
    
    this.load.spritesheet("ennemis", "src/assets/ennemis.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    
      // chargement de la carte
    this.load.tilemapTiledJSON("carte3", "src/assets/mapcloclo.json");  
    
    this.load.spritesheet("img_porte", "src/assets/spritesheet_porte.png", { frameWidth: 96, frameHeight: 120 });
    this.load.audio('son', 'src/assets/son.mp3');
   this.load.audio('sonfleche', 'src/assets/sonfleche.mp3');

    
    }
    create() {
      player = this.physics.add.sprite(100, 450, "img_perso2");
      gameOver =false;
      chrono = 180;
    
      
    // chargement de la carte
    const carteDuNiveau = this.add.tilemap("carte3");
    
    // chargement du jeu de tuiles
    const ts1 = carteDuNiveau.addTilesetImage("tuilesBis", "tuiledejeu");
            // chargement du calque Plateformes
    
    
    // chargement du calque Fond
    const Fond = carteDuNiveau.createLayer(
      "Fond",
      [ts1],
    );
    
    
    
    this.Plateformes = carteDuNiveau.createLayer(
      "Plateformes",
      [ts1],
    );
    
    
    
    this.Plateformes.setCollisionByProperty({ estSolide: true }); 
    this.physics.add.collider(player, this.Plateformes); 
    
    
    groupe_ennemis = this.physics.add.group({ immovable: true });
    groupecible = this.physics.add.group({ immovable: false });
    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    
    
    // extraction des poitns depuis le calque calque_ennemis, stockage dans tab_points
    const tab_points = carteDuNiveau.getObjectLayer("calque_ennemis");   
    
    // on fait une boucle foreach, qui parcours chaque élements du tableau tab_points  
    tab_points.objects.forEach(point => {
        if (point.name == "ennemis") {
          var nouvel_ennemi = this.physics.add.sprite(point.x, point.y, "ennemis");
          groupe_ennemis.add(nouvel_ennemi);
        }
    }); 
    
    this.physics.add.collider(groupe_ennemis, this.Plateformes);  
    
    
     /*****************************************************
       *  ajout du modele de mobilite des ennemis *
       ******************************************************/
      // par défaut, on va a gauche en utilisant la meme animation que le personnage
      groupe_ennemis.children.iterate(function iterateur(un_ennemi) {
        un_ennemi.setVelocityX(-40);
        un_ennemi.direction = "gauche";
        un_ennemi.play("anim_ennemi_tourne_left", true);
      }); 
    
      // extraction des poitns depuis le calque calque_cibles, stockage dans tab_points
       const tab_points2= carteDuNiveau.getObjectLayer("calque_cibles");   
    
    // on fait une boucle foreach, qui parcours chaque élements du tableau tab_points  
    tab_points2.objects.forEach(point => {
        if (point.name == "cible") {
          var nouvel_cibles = this.physics.add.sprite(point.x, point.y, "cibles");
          groupecible.add(nouvel_cibles);
        }
    }); 
    
    
    
    
    // modification des cibles créées
    groupecible.children.iterate(function (cibleTrouvee) {
      // définition de points de vie
      cibleTrouvee.pointsVie=Phaser.Math.Between(1, 1);;
      
      
    });  
    nombreCiblesRestantes = groupecible.getChildren().length;
    
      
    
      /****************************
       *  CREATION DU PERSONNAGE  *
       ****************************/
    
      // On créée un nouveeau personnage : player
      player = this.physics.add.sprite(100, 450, "img_perso2");
      
    
      //  propriétées physiqyes de l'objet player :
      player.setBounce(0.2); // on donne un petit coefficient de rebond
      player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    
      player.setDepth(20);
            /***************************
       *  CREATION DES ANIMATIONS *
       ****************************/
      // dans cette partie, on crée les animations, à partir des spritesheet
      // chaque animation est une succession de frame à vitesse de défilement défini
      // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
      // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
      this.anims.create({
        key: "anim_tourne_left", // key est le nom de l'animation : doit etre unique poru la scene.
        frames: this.anims.generateFrameNumbers("img_perso2", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
        frameRate: 10, // vitesse de défilement des frames
        repeat: -1 // nombre de répétitions de l'animation. -1 = infini
      });
    
      // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
      this.anims.create({
        key: "anim_face",
        frames: [{ key: "img_perso2", frame: 4 }],
        frameRate: 20
      });
    
      // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
      this.anims.create({
        key: "anim_tourne_right",
        frames: this.anims.generateFrameNumbers("img_perso2", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
      
      this.anims.create({
        key: "anim_ennemi_tourne_right",
        frames: this.anims.generateFrameNumbers("ennemis", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: "anim_ennemi_tourne_left",
        frames: this.anims.generateFrameNumbers("ennemis", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

    clavier=this.input.keyboard.createCursorKeys();
      // ajout d'une collision entre le joueur et le calque plateformes
    this.physics.add.collider(player,this.Plateformes); 
    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);  
    player.direction = 'right';  
    // création du clavier - code déja présent sur le jeu de départ
    cursors = this.input.keyboard.createCursorKeys();
    
    // affectation de la touche A à boutonFeu
    boutonFeu = this.input.keyboard.addKey('A'); 
    
    // création d'un groupe d'éléments vide
    groupefleche = this.physics.add.group();  
    
       // ajout du modèle de collision entre cibles et plate-formes
       this.physics.add.collider(groupecible, this.Plateformes);  
       this.physics.add.overlap(groupefleche, groupecible, hit, null, this);
    
       // instructions pour les objets surveillés en bord de monde
    this.physics.world.on("worldbounds", function(body) {
      // on récupère l'objet surveillé
      var objet = body.gameObject;
      // s'il s'agit d'une balle
      if (groupefleche.contains(objet)) {
          // on le détruit
          objet.destroy();
      }
    });
     
    
    this.physics.add.overlap(groupefleche, groupe_ennemis, hit2, null,this);
    
    this.physics.add.collider(player, groupe_ennemis, chocAvecUnennemis, null, this); 
    
    groupe_ennemis.children.iterate(function (groupe_ennemisTrouvee) {
      // définition de points de vie
      groupe_ennemisTrouvee.pointsVie=Phaser.Math.Between(3, 3);;
      
     
    });  
    
    
    monTimer = this.time.addEvent({
      delay: 1000,
      callback: compteUneSeconde,
      callbackScope: this,
      loop: true
    });  
    chronoText = this.add.text(16, 100, "Chrono: 03,00", {
      fontSize: "24px",
      fill: "#FFFFFF" //Couleur de l'écriture
    });
    chronoText.setScrollFactor(0); 
    
    nombreCiblesRestantesText = this.add.text(16, 130, "Cibles restantes: " + nombreCiblesRestantes, {
      fontSize: "24px",
      fill: "#FFFFFF" //Couleur de l'écriture
    });
    
    nombreCiblesRestantesText.setScrollFactor(0);
    
    porte = this.physics.add.staticSprite(3100, 485, "img_porte");
    player.x = 50;
    porte.setVisible(false);
    porte.setDepth(10);
    
    this.anims.create({
      key: "anim_ouvreporte",
      frames: this.anims.generateFrameNumbers("img_porte", { start: 0, end: 5 }),
      frameRate: 50,
      repeat: 0
    }); 
    this.anims.create({
      key: "anim_fermeporte",
      frames: this.anims.generateFrameNumbers("img_porte", { start: 5, end: 0 }),
      frameRate: 50,
      repeat: 0
    }); 
    musique_de_fond = this.sound.add('son'); 
  // lancement du son background
    musique_de_fond.play();  
    musique_tir = this.sound.add('sonfleche');

    
    }

  
    update() {
  if (gameOver) {
    musique_de_fond.stop();  
    this.scene.restart();
  } 

  if (cursors.left.isDown) {
    // enregistrement de la direction : gauche
    player.direction = 'left';
    player.setVelocityX(-160);
    player.anims.play('anim_tourne_left', true);
}
   else if (cursors.right.isDown) {
    // enregistrement de la direction : droite
    player.direction = 'right';
    player.setVelocityX(160);
    player.anims.play('anim_tourne_right', true);
}  
   else {
    player.setVelocityX(0);
    player.anims.play("anim_face");
  }

  if (clavier.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-250);
  }  
  // déclenchement de la fonction tirer() si appui sur boutonFeu 
if ( Phaser.Input.Keyboard.JustDown(boutonFeu)) {
  tirer(player);
}  

groupe_ennemis.children.iterate(function iterateur(un_ennemi) {
  if (un_ennemi.direction == "gauche" && un_ennemi.body.blocked.down) {
    var coords = un_ennemi.getBottomLeft();
    var tuileSuivante = this.Plateformes.getTileAtWorldXY(
      coords.x,
      coords.y + 10
    );
    if (tuileSuivante == null || un_ennemi.body.blocked.left) {
      // on risque de marcher dans le vide, on tourne
      un_ennemi.direction = "droite";
      un_ennemi.setVelocityX(40);
      un_ennemi.play("anim_ennemi_tourne_right", true);
    }
  } else if (un_ennemi.direction == "droite" && un_ennemi.body.blocked.down) {
    var coords = un_ennemi.getBottomRight();
    var tuileSuivante = this.Plateformes.getTileAtWorldXY(
      coords.x,
      coords.y + 10
    );
    if (tuileSuivante == null || un_ennemi.body.blocked.right) {
      // on risque de marcher dans le vide, on tourne
      un_ennemi.direction = "gauche";
      un_ennemi.setVelocityX(-40);
      un_ennemi.play("anim_ennemi_tourne_left", true);
    }
    if (clavier.space.isDown && this.physics.overlap(player, porte)) {
      // Passe à la scène de sélection
      musique_de_fond.stop();  
      this.scene.switch("End");
    }
  }
}, this);


if (chrono == 0) {
  gameOver = true;
  this.physics.pause();
  player.setTint(0xff0000);
  resetTimer();
  monTimer.reset();
  resetnombreCiblesRestantes();
  musique_de_fond.stop();  
  this.scene.restart();
}

if (gameOver) {
  musique_de_fond.stop();  
  return;
} 

if ( Phaser.Input.Keyboard.JustDown(clavier.space) == true &&
    this.physics.overlap(player, porte) == true) {
   // le personnage est sur la porte et vient d'appuyer sur espace
   porte.anims.play("anim_ouvreporte");
  } 
 

}
}


//fonction tirer( ), prenant comme paramètre l'auteur du tir
function tirer(player) {
  musique_tir.play();  
  var coefDir;
  if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
  // on crée la balle a coté du joueur
  var fleche = groupefleche.create(player.x + (25 * coefDir), player.y - 4, 'fleche');
  // parametres physiques de la balle.
  fleche.setCollideWorldBounds(true);
  // on acive la détection de l'evenement "collision au bornes"
  fleche.body.onWorldBounds = true;  
  fleche.body.allowGravity =false;
  fleche.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
  
}  
// fonction déclenchée lorsque uneBalle et uneCible se superposent

function hit (fleche, Cibles) {
  nombreCiblesRestantes--; // Decrement counter by 1
  Cibles.pointsVie--;
  nombreCiblesRestantesText.setText("Cibles restantes:" + nombreCiblesRestantes);
  if (Cibles.pointsVie==0) {
    Cibles.destroy();
  } 
  if (nombreCiblesRestantes === 0) {
    // affichage de la porte si toutes les cibles ont été détruites
    porte.visible = true;
    porte.setVisible(true);
  }
}

function hit2 (fleche, ennemis) {
  ennemis.pointsVie--;
  if (ennemis.pointsVie==0) {
    ennemis.destroy(); 
  } 
   fleche.destroy();
}  

function chocAvecUnennemis(player, groupe_ennemis) {
  this.physics.pause();
  player.setTint(0xff0000);
  resetTimer();
  monTimer.reset();
  resetnombreCiblesRestantes();
  musique_de_fond.stop();  
  this.scene.restart();
 
}

function compteUneSeconde() {
  chrono --;
  secondes --;
  if (secondes<=0){
    secondes=60;
    minutes --;
  }
    chronoText.setText("Chrono: " + pad(minutes) + "," + pad(secondes));
  }
  //chrono = chrono + 1; // on incremente le chronometre d'une unite
  //chronoText.setText("Chrono: " + chrono); // mise à jour de l'affichage


  function resetTimer() {
    chrono = 180;
    minutes = 2;
    secondes = 60;
  
    chronoText.setText("Chrono: 03,00 ");
  }
  
  function pad(value) {
    return value < 10 ? '0' + value : value;
  }
  
  function resetnombreCiblesRestantes (){
    nombreCiblesRestantes= groupecible.getChildren().length;
  }
  