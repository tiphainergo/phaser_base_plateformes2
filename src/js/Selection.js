var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier
var groupe_etoiles;
var score= 0;
var zone_texte_score; 


export default class Selection extends Phaser.Scene {
 
    constructor() {
       super({key : "Selection"}); // mettre le meme nom que le nom de la classe
  }
    preload() { 

  // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
 // this.load.image("img_ciel", "src/assets/sky.png");
 // this.load.image("img_plateforme", "src/assets/platform.png");
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
  // chargement tuiles de jeu
this.load.image("Phaser_map", "src/assets/map.png"); 
this.load.image("img_etoile", "src/assets/star.png"); 
this.load.image('img_medaille', 'src/assets/Médaille.png');
this.load.image('img_porte1', 'src/assets/door1.png');
this.load.image('img_porte2', 'src/assets/door2.png');
this.load.image('img_porte3', 'src/assets/door3.png');

// chargement de la carte
this.load.tilemapTiledJSON("carte", "src/assets/map4B.tmj");  
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


  groupe_etoiles = this.physics.add.staticGroup(); 

  /*************************************
   *  CREATION DU MONDE + PLATEFORMES  *
   *************************************/

  // On ajoute une simple image de fond, le ciel, au centre de la zone affichée (400, 300)
  // Par défaut le point d'ancrage d'une image est le centre de cette derniere
  //this.add.image(400, 300, "img_ciel");

  // la création d'un groupes permet de gérer simultanément les éléments d'une meme famille
  //  Le groupe groupe_plateformes contiendra le sol et deux platesformes sur lesquelles sauter
  // notez le mot clé "staticGroup" : le static indique que ces élements sont fixes : pas de gravite,
  // ni de possibilité de les pousser.
  //groupe_plateformes = this.physics.add.staticGroup();
  // une fois le groupe créé, on va créer les platesformes , le sol, et les ajouter au groupe groupe_plateformes

  // l'image img_plateforme fait 400x32. On en met 2 à coté pour faire le sol
  // la méthode create permet de créer et d'ajouter automatiquement des objets à un groupe
  // on précise 2 parametres : chaque coordonnées et la texture de l'objet, et "voila!"
 // groupe_plateformes.create(200, 584, "img_plateforme");
  // groupe_plateformes.create(600, 584, "img_plateforme");

  //  on ajoute 3 platesformes flottantes
 // groupe_plateformes.create(600, 450, "img_plateforme");
  //groupe_plateformes.create(50, 300, "img_plateforme");
 // groupe_plateformes.create(750, 270, "img_plateforme");

    // chargement de la carte
const carteDuNiveau = this.add.tilemap("carte");

// chargement du jeu de tuiles
        const ts1 = carteDuNiveau.addTilesetImage( "map", "Phaser_map");

// chargement des calques

// chargement du calque calque_background
const  Fond = carteDuNiveau.createLayer(
  "Fond",
  [ts1],
);


// définition des tuiles de plateformes qui sont solides
// utilisation de la propriété estSolide
Fond.setCollisionByProperty({ estSolide: true }); 
  // extraction des poitns depuis le calque calque_ennemis, stockage dans tab_points
 
  const tab_points = carteDuNiveau.getObjectLayer("Objets");   


  // on fait une boucle foreach, qui parcours chaque élements du tableau tab_points  
  tab_points.objects.forEach(point => {
      if (point.name == "Etoile") {
        groupe_etoiles.create(point.x, point.y, "img_medaille");
      }
  });  
  

  /****************************
   *  CREATION DU PERSONNAGE  *
   ****************************/

  // On créée un nouveeau personnage : player
  player = this.physics.add.sprite(150, 1600, "img_perso");

  //  propriétées physiqyes de l'objet player :
  player.setBounce(0.38); // on donne un petit coefficient de rebond
  player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

  /***************************
   *  CREATION DES ANIMATIONS *
   ****************************/
  // dans cette partie, on crée les animations, à partir des spritesheet
  // chaque animation est une succession de frame à vitesse de défilement défini
  // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
  // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
  this.anims.create({
    key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
    frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
    frameRate: 10, // vitesse de défilement des frames
    repeat: -1 // nombre de répétitions de l'animation. -1 = infini
  });

  // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
  this.anims.create({
    key: "anim_face",
    frames: [{ key: "img_perso", frame: 4 }],
    frameRate: 20
  });

  // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
  this.anims.create({
    key: "anim_tourne_droite",
    frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  /***********************
   *  CREATION DU CLAVIER *
   ************************/
  // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
  clavier = this.input.keyboard.createCursorKeys();

  /*****************************************************
   *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
   ******************************************************/

  //  Collide the player and the groupe_etoiles with the groupe_plateformes
// this.physics.add.collider(player, Plateformes);

// ajout d'une collision entre le joueur et le calque plateformes
this.physics.add.collider(player, Fond);  
this.physics.add.collider(groupe_etoiles, Fond);
this.physics.add.overlap(player, groupe_etoiles, ramasserEtoile, null, this);
zone_texte_score = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }); 

zone_texte_score.setScrollFactor(0);
this.porte1 = this.physics.add.staticSprite(430, 1580, "img_porte1");
this.porte2 = this.physics.add.staticSprite(550, 160, "img_porte3");


// redimentionnement du monde avec les dimensions calculées via tiled
this.physics.world.setBounds(0, 0, 1024, 1792);
//  ajout du  champs de la caméra de taille identique à celle du monde
this.cameras.main.setBounds(0, 0, 1024, 1792);
// ancrage de la caméra sur le joueur
this.cameras.main.startFollow(player);  

verifScorePourPorte.call(this); 

}

/***********************************************************************/
/** FONCTION UPDATE 
/***********************************************************************/

 update() {
  if (clavier.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("anim_tourne_gauche", true);
  } else if (clavier.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("anim_tourne_droite", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("anim_face");
  }
  if (clavier.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-370);
  }  
  if (clavier.space.isDown) {
    if (this.physics.overlap(player, this.porte1)) this.scene.switch("Reglelulu");
    if (this.physics.overlap(player, this.porte2)) this.scene.switch("Reglecloclo");
  }
}
}

function verifScorePourPorte() {
    if (score >= 50) {
        // Activer la collision avec la première porte
        this.physics.world.enable(this.porte1);
    } else {
        // Désactiver la collision avec la première porte
        this.physics.world.disable(this.porte1);
    }

    // Porte 2 : nécessite un score de 100
    if (score >= 100) {
        this.physics.world.enable(this.porte2);
    } else {
        this.physics.world.disable(this.porte2);
    }
}


function ramasserEtoile(un_player, une_etoile) {
    // on désactive le "corps physique" de l'étoile mais aussi sa texture
    // l'étoile existe alors sans exister : elle est invisible et ne peut plus intéragir
    une_etoile.disableBody(true, true);
    
    if (groupe_etoiles.countActive(true) === 0) {
        groupe_etoiles.children.iterate(function iterateur(etoile_i) {
            etoile_i.enableBody(true, etoile_i.x, 0, true, true);
        });
  
        var x;
        if (player.x < 400) {
            x = Phaser.Math.Between(400, 800);
        } else {
            x = Phaser.Math.Between(0, 400);
        }
    } 
    
    // Mettre à jour le score
    score += 10;
    zone_texte_score.setText("Score: " + score);
    
    // Vérifier si le joueur peut entrer dans la première porte
    verifScorePourPorte.call(this);
}
