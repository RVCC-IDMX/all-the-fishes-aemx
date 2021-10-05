// Spencer Gunning - IDMX 291
// All The Fishes

// ENVIRONMENT SETUP ------------------------------------------------------- //

// The app
var app = new PIXI.Application({
    width: 640,
    height: 480,
    backgroundColor: 0xCCCCCC,
});

// Add view to the document
document.body.appendChild(app.view);

// Initialize containers
var background = new PIXI.Container();
var middleground = new PIXI.Container();
var foreground = new PIXI.Container();

// Initialize sprite, change properties, add to stage and container
let initSprite = (file, x, y, size, container) => {
    let sprite = PIXI.Sprite.from(`img/${file}.png`);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.x = size;
    sprite.scale.y = size;
    app.stage.addChild(sprite);
    if (container) container.addChild(sprite);
    return sprite;
};

// SPRITE SETUP ------------------------------------------------------------ //

// Sprite pool
let bg = initSprite('bg', 0, 0, 1);
let coral3 = initSprite('coral3', 0, -50, 0.8, background);
let coral1 = initSprite('coral1', 0, 160, 0.5, middleground);
let coral2 = initSprite('coral2', 380, 250, 0.5, middleground);
let rocks = initSprite('rocks', -50, -30, 1.2, middleground);
let fish1 = initSprite('fish1', 150, 280, 0.45, foreground);
let fish2 = initSprite('fish2', 350, 320, 0.25, foreground);
let fish3 = initSprite('fish3', 530, 330, 0.3, foreground);
let fish4 = initSprite('fish4', -20, 280, 0.24, foreground);

// Push containers to stage
app.stage.addChild(background);
app.stage.addChild(middleground);
app.stage.addChild(foreground);

// EASE FUNCTIONS SETUP ---------------------------------------------------- //

let t0 = Date.now()/1000;

let float = (time, amp, period, offset) => {
    return amp * Math.sin(Math.PI * (time-t0) * period/2) + offset;
};

let floatCos = (time, amp, period, offset) => {
    return amp * Math.cos(Math.PI * (time-t0) * period/2) + offset;
};

// ANIMATION SETUP --------------------------------------------------------- //

let animationLoop = () => {
    let t = Date.now()/1000;
    fish1.y = float(t, 10, 1, 280);
    fish2.y = float(t, 15, -1.3, 320);
    fish3.y = floatCos(t, 12, -1.1, 330);
    fish4.y = float(t, 30, -0.7, 280);
    fish1.rotation = floatCos(t, 0.2, -0.6, -0.2);
    fish2.rotation = float(t, -0.15, 0.7, 0);
    fish3.rotation = floatCos(t, -0.1, 1, -0.3);
    fish4.rotation = float(t, 0.1, -0.7, -0.2);
    background.x = float(t, 40, 0.3, 0);
    middleground.x = float(t, 20, 0.3, 0);
    foreground.x = float(t, 10, 0.3, 0);
    setTimeout(animationLoop, 1000/30);
}
animationLoop();