export default class Menu extends Phaser.Scene {
    constructor() {
      super({ key: "Menu" });
    }
    //on charge les images
    preload() {
      this.load.image("menu", "src/assets/Menu.png");
      this.load.image("imageBoutonPlay", "src/assets/ImageBoutonPlay.png");
    }
  
    create() {
     // on place les éléments de fond
      this.add
      .image(500, 400, "menu")
      .setDisplaySize(1000, 1000);
  
        this.add.text(200, 40, "Bienvenue dans EPF Olympic Games", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: "30pt",
          color: "black"
        });

      //on ajoute un bouton de clic, nommé bouton_play
      var bouton_play = this.add.image(520, 425, "imageBoutonPlay")
      .setDepth(1)
      .setScale(0.5); 
      //=========================================================
      //on rend le bouton interratif
      bouton_play.setInteractive();
  
      //Cas ou la souris passe sur le bouton play
      bouton_play.on("pointerover", () => {
      });
      
      //Cas ou la souris ne passe plus sur le bouton play
      bouton_play.on("pointerout", () => {
      });
  
  
      //Cas ou la sourris clique sur le bouton play :
      // on lance le niveau 1
      bouton_play.on("pointerup", () => {
        this.scene.start("Regle");
      });
    }
  }   