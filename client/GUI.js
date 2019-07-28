var blackbar, hpbar, manabar, emptybar;
var advancedTexture;

function loadGUI(){

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    loadBars();

}

function loadBars(){
    blackbar = new BABYLON.GUI.Image("but", "textures/blackbar.png");;
    blackbar.height = 0.1;
    blackbar.width = 0.4;
    blackbar.top = "320px";
    advancedTexture.addControl(blackbar);

    hpbar = new BABYLON.GUI.Image("but", "textures/hpbar.png");
    hpbar.height = 0.1;
    hpbar.width = 0.4;
    hpbar.top = "320px";
    advancedTexture.addControl(hpbar);

    manabar = new BABYLON.GUI.Image("but", "textures/manabar.png");
    manabar.height = 0.1;
    manabar.width = 0.4;
    manabar.top = "320px";
    advancedTexture.addControl(manabar);

    emptybar = new BABYLON.GUI.Image("but", "textures/emptybar.png");
    emptybar.height = 0.1;
    emptybar.width = 0.4;
    emptybar.top = "320px";
    advancedTexture.addControl(emptybar);
}

function changeBarSize(hp, mana){

    let hpSize = 0.4 * hp / 100;
    let manaSize = 0.4 * mana / 100;

    hpbar.width = hpSize;
    manabar.width = manaSize;
}