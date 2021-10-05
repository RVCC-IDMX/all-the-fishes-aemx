// Spencer Gunning - IDMX 291
// All The Fishes

// ENVIRONMENT SETUP ------------------------------------------------------- //

// The app
let app = new PIXI.Application({
    width: 640,
    height: 480,
    backgroundColor: 0xCCCCCC,
});

// Add view to the document
document.body.appendChild(app.view);

// Initialize containers
let background = new PIXI.Container();
let middleground = new PIXI.Container();
let foreground = new PIXI.Container();
let buttonContainer = new PIXI.Container();
let sliderContainer = new PIXI.Container();

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

// minmax function
let minMax = (num, min, max) => Math.min(Math.max(parseInt(num), min), max);

// SPRITE SETUP ------------------------------------------------------------ //

// Sprite pool
let bg = initSprite('bg', 0, 0, 1);
let coral3 = initSprite('coral3', 0, -50, 0.8, background);
let coral1 = initSprite('coral1', 0, 160, 0.5, middleground);
let coral2 = initSprite('coral2', 380, 250, 0.5, middleground);
let rocks = initSprite('rocks', -50, -30, 1.2, middleground);
let fish1 = initSprite('fish1', 150, 280, 0.45, foreground);
let fish2 = initSprite('fish2', 400, 320, 0.25, foreground);
let fish3 = initSprite('fish3', 530, 330, 0.3, foreground);
let fish4 = initSprite('fish4', -20, 280, 0.24, foreground);
let button = initSprite('button', 478, 10, 0.5, buttonContainer);
let sliderMain = initSprite('slider', 10, 10, 0.75, sliderContainer);
let sliderDial = initSprite('dial', 135, 15.5, 0.75, sliderContainer);
let sliderText = initSprite('size', 12, 52, 0.3, sliderContainer);

// Let fish2 anchor to the center for resizing
fish2.anchor.set(0.5);

// Array of all fish
let allFish = [fish1, fish2, fish3, fish4];

// Give hue changing properties to all fish
allFish.forEach(fish => fish.filters = [new PIXI.filters.ColorMatrixFilter()]);

// Push containers to stage
app.stage.addChild(background);
app.stage.addChild(middleground);
app.stage.addChild(foreground);
app.stage.addChild(buttonContainer);
app.stage.addChild(sliderContainer);

// EASE FUNCTIONS SETUP ---------------------------------------------------- //

let t0 = Date.now()/1000;

let float = (time, amp, period, offset) => {
    return amp * Math.sin(Math.PI * (time-t0) * period/2) + offset;
};

let floatCos = (time, amp, period, offset) => {
    return amp * Math.cos(Math.PI * (time-t0) * period/2) + offset;
};

// ANIMATION SETUP --------------------------------------------------------- //

let fish1yAnimate = 280; // If you drag the fish, the animation isn't affected!

let animationLoop = () => {
    let t = Date.now()/1000;
    fish1.y = float(t, 10, 1, fish1yAnimate);
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

// DRAGGABLE FISH ---------------------------------------------------------- //

// Set attributes
fish1.interactive = true;
fish1.dragging = false;
fish1.cursor = 'pointer';

// Set hover properties
fish1.on("pointerover", e => fish1.alpha = 0.7);
fish1.on("pointerout", e => fish1.alpha = 1.0);

// Set click+drag properties
fish1.on("pointerdown", e => fish1.dragging = true);
fish1.on("pointermove", e => {
    if (fish1.dragging) {
        fish1.x = e.data.global.x - fish1.width/2;
        fish1yAnimate = e.data.global.y - fish1.height/2;
    }
});
fish1.on("pointerup", e => fish1.dragging = false);

// COLOR CHANGER ----------------------------------------------------------- //

// Set attributes
button.interactive = true;
button.cursor = 'pointer';

// Preload button textures
let buttonTexture = PIXI.Texture.from('img/button.png');
let buttonTextureHover = PIXI.Texture.from('img/button-hover.png');
let buttonTextureDown = PIXI.Texture.from('img/button-down.png');

// Set hover properties
button.on("pointerover", e => button.texture = buttonTextureHover);
button.on("pointerout", e => button.texture = buttonTexture);

// Set click properties
button.on("pointerdown", e => button.texture = buttonTextureDown);
button.on("pointerup", e => {
    button.texture = buttonTextureHover;
    let randomFish = Math.floor(Math.random() * allFish.length);
    let randomHue = Math.random() * 360;
    allFish[randomFish].filters[0].hue(randomHue);
});

// SIZE CHANGER ------------------------------------------------------------ //

// Set attributes
sliderDial.interactive = true;
sliderDial.dragging = false;
sliderDial.cursor = 'pointer';

// Set hover properties
sliderDial.on("pointerover", e => sliderDial.alpha = 0.7);
sliderDial.on("pointerout", e => {
    sliderDial.alpha = 1.0;
    sliderDial.dragging = false;
});

// Set click properties
sliderDial.on("pointerdown", e => sliderDial.dragging = true);
sliderDial.on("pointermove", e => {
    if (sliderDial.dragging) {
        // slider values
        let xpos = e.data.global.x - sliderDial.width/2;
        let xval = minMax(xpos, 17, sliderMain.width-17*2);
        sliderDial.x = xval
        // parabola passing through (17, 0.125), (135, 0.25), (252.2, 0.5)
        let size = 0.00000456541 * Math.pow(xval, 2) + 0.00036538 * xval + 0.117469;
        fish2.scale.x = size;
        fish2.scale.y = size;
    }
});
sliderDial.on("pointerup", e => sliderDial.dragging = false);