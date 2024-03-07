export default class Regle extends Phaser.Scene {
    constructor() {
      super({ key: "Regle" });
    }
    //on charge les images
    preload() {
      this.load.image("Regle", "src/assets/Regle.png");
      this.load.image("imageBoutonPlay", "src/assets/ImageBoutonPlay.png");
    }
  
    create() {
     // on place les éléments de fond
      this.add
      .image(500, 400, "Regle")
      .setDisplaySize(950, 900);
 

      //on ajoute un bouton de clic, nommé bouton_play
      var bouton_regle = this.add.image(830, 740, "imageBoutonPlay")
      .setDepth(1)
      .setScale(0.25); 
      //=========================================================
      //on rend le bouton interratif
      bouton_regle.setInteractive();
  
      //Cas ou la souris passe sur le bouton play
      bouton_regle.on("pointerover", () => {
      });
      
      //Cas ou la souris ne passe plus sur le bouton play
      bouton_regle.on("pointerout", () => {
      });
  
  
      //Cas ou la sourris clique sur le bouton play :
      // on lance le niveau 1
      bouton_regle.on("pointerup", () => {
        this.scene.start("Selection");
      });
    }
  }    