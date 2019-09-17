var hpbar, manabar;
var hptext, manatext;
var button, background;
var scoretext, leveltext;
var advancedTexture;

function beginGUI(startGame){
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    background = new BABYLON.GUI.Image("", "textures/gamebackground.png");;
    advancedTexture.addControl(background);

    button = BABYLON.GUI.Button.CreateImageOnlyButton("", "textures/startbutton.png");
    button.width = 0.2;
    button.height = "60px";
    button.color = "black";
    button.background = "white";
    button.top = "40px";

    let toDelete = false;

    button.onPointerDownObservable.add(function() {
        toDelete = true;
    });

    button.onPointerUpObservable.add(function() {
        if(toDelete){            
            startGame();
        }
    });

    
    advancedTexture.addControl(button);
}

function loadGUI(){
    loadBars();
    loadPotions();
    loadWeapon();
    loadScore();
    loadLevel();

    background.dispose();
    button.dispose();
}

function loadBars(){
    let blackbar = new BABYLON.GUI.Image("", "textures/blackbar.png");;
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

    let emptybar = new BABYLON.GUI.Image("", "textures/emptybar.png");
    emptybar.height = 0.1;
    emptybar.width = 0.4;
    emptybar.top = "320px";
    advancedTexture.addControl(emptybar);
}

function loadPotions(){
    let hpPotion, manaPotion;
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

function loadScore(){
    scoretext = new BABYLON.GUI.TextBlock();    
    scoretext.text = "0";
    scoretext.color = "white";
    scoretext.outlineWidth = 4;
    scoretext.outlineColor = "black";
    scoretext.fontSize = 72;
    
    scoretext.textHorizontalAlignment = 0;
    scoretext.top = "-300px";
    scoretext.left = "5px";
    advancedTexture.addControl(scoretext);
}

function loadLevel() {
    leveltext = new BABYLON.GUI.TextBlock();    
    leveltext.text = "Lv: 1";
    leveltext.color = "white";
    leveltext.outlineWidth = 4;
    leveltext.outlineColor = "black";
    leveltext.fontSize = 48;
    
    leveltext.top = "-300px";
    leveltext.left = "5px";
    advancedTexture.addControl(leveltext); 
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

function changeScore(points){
    scoretext.text = points.toString();
}

function changeLevel(level){
    leveltext.text = "Lv. " + level.toString();
}

function showFinalScore(score){
    let final = new BABYLON.GUI.TextBlock();    
    final.text = "Final Score: " + score.toString();
    final.color = "white";
    final.outlineWidth = 4;
    final.outlineColor = "black";
    final.fontSize = 48;
    
    advancedTexture.addControl(final);   
}