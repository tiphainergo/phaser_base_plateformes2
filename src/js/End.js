export default class End extends Phaser.Scene {
    constructor() {
      super({ key: "End" });
    }
    //on charge les images
    preload() {
      this.load.image("End", "src/assets/Final.png");
      this.load.image("imageBoutonReplay", "src/assets/BoutonReplay.png");
    }
  
    create() {
     // on place les éléments de fond
      this.add
      .image(500, 400, "End")
      .setDisplaySize(1000, 1000);
  
        this.add.text(350, 180, "Congratulations", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: "30pt",
          color: "black"
        });

      //on ajoute un bouton de clic, nommé bouton_play
      var bouton_replay = this.add.image(510, 250, "imageBoutonReplay")
      .setDepth(1)
      .setScale(0.25); 
      //=========================================================
      //on rend le bouton interratif
      bouton_replay.setInteractive();
  
      //Cas ou la souris passe sur le bouton play
      bouton_replay.on("pointerover", () => {
      });
      
      //Cas ou la souris ne passe plus sur le bouton play
      bouton_replay.on("pointerout", () => {
      });
  
  
      //Cas ou la sourris clique sur le bouton play :
      // on lance le niveau 1
      bouton_replay.on("pointerup", () => {
        this.scene.start("Selection");
      });
    }
  }   