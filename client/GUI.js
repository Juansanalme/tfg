var hpbar, manabar;
var hptext, manatext;
var advancedTexture;

function loadGUI(){

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    loadBars();
    loadPotions();
    loadWeapon();
}

function loadBars(){
    var blackbar = new BABYLON.GUI.Image("", "textures/blackbar.png");;
    blackbar.height = 0.1;
    blackbar.width = 0.4;
    blackbar.top = "320px";
    advancedTexture.addControl(blackbar);

    hpbar = new BABYLON.GUI.Image("", "textures/hpbar.png");
    hpbar.height = 0.1;
    hpbar.width = 0.4;
    hpbar.top = "320px";
    advancedTexture.addControl(hpbar);

    manabar = new BABYLON.GUI.Image("", "textures/manabar.png");
    manabar.height = 0.1;
    manabar.width = 0.4;
    manabar.top = "320px";
    advancedTexture.addControl(manabar);

    var emptybar = new BABYLON.GUI.Image("", "textures/emptybar.png");
    emptybar.height = 0.1;
    emptybar.width = 0.4;
    emptybar.top = "320px";
    advancedTexture.addControl(emptybar);
}

function loadPotions(){
    var hpPotion, manaPotion;
    hpPotion = new BABYLON.GUI.Image("", "textures/32/healpotion.png");
    manaPotion = new BABYLON.GUI.Image("", "textures/32/manapotion.png");

    hpPotion.height = manaPotion.height = 32/_HEIGHT;
    hpPotion.width = manaPotion.width = 32/_WIDTH;
    hpPotion.top = manaPotion.top = "286px";
    hpPotion.left = "-190px"; manaPotion.left = "-144px";
    
    advancedTexture.addControl(hpPotion);
    advancedTexture.addControl(manaPotion);

    hptext = new BABYLON.GUI.TextBlock();    
    manatext = new BABYLON.GUI.TextBlock();
    hptext.text = manatext.text = "0";
    hptext.color = manatext.color = "white";
    hptext.outlineWidth = manatext.outlineWidth = 3;
    hptext.outlineColor = manatext.outlineColor = "black";
    hptext.fontSize = manatext.fontSize = 18;

    hptext.top = manatext.top = "296px";
    hptext.left = "-166px"; manatext.left = "-120px";

    advancedTexture.addControl(hptext);
    advancedTexture.addControl(manatext);
}

function loadWeapon(){

}

function changeBarSize(hp, mana){

    let hpSize = 0.4 * hp / 100;
    let manaSize = 0.4 * mana / 100;

    hpbar.width = hpSize;
    manabar.width = manaSize;
}

function changePotionCount(hp, mana){

    if(parseInt(hptext.text) > hp){
        hptext.color = "black";
        hptext.outlineColor = "white";
        let potionCD = setInterval(() => {
            hptext.color = "white";
            hptext.outlineColor = "black";
            clearInterval(potionCD);
        }, 5000);
    }

    if(parseInt(manatext.text) > mana){
        manatext.color = "black";
        manatext.outlineColor = "white";
        let potionCD = setInterval(() => {
            manatext.color = "white";
            manatext.outlineColor = "black";
            clearInterval(potionCD);
        }, 5000);
    }

    hptext.text = hp.toString();
    manatext.text = mana.toString();
}