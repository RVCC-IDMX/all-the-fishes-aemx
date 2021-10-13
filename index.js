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

// Random range function
let randRange = (min, max) => Math.random() * (max - min) + min;

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

// Bubble pool
let bubbles = []
for (let i = 0; i < 20; i++) {
    bubbles[i] = initSprite('bubble', 0, 0, 1, background);
    bubbles[i].alpha = randRange(0.4, 0.6);
}

// Push containers to stage
app.stage.addChild(background);
app.stage.addChild(middleground);
app.stage.addChild(foreground);

// ANIMATION SETUP --------------------------------------------------------- //

// Eases
let Ease = {
    lin:        x => x,
    sinein:     x => 1 - Math.cos((x * Math.PI) / 2),
    sineout:    x => Math.sin((x * Math.PI) / 2),
    sines:      x => -(Math.cos(Math.PI * x) - 1) / 2,
    quadin:     x => x * x,
    quadout:    x => 1 * (1 - x) * (1 - x),
    quads:      x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    circout:    x => Math.sqrt(1 - Math.pow(x - 1, 2)),
};

// Animate an object
let animate = (obj, end) => {
    return new Promise( (resolve, reject) => {
        let attribs = ['x', 'y', 'rotation', 'tint', 'alpha'];
        // Set initial attributes if not defined
        attribs.forEach(attrib => {
            if (end[attrib] == undefined) end[attrib] = obj[attrib];
        });
        if (end.zoomx == undefined) end.zoomx = obj.scale.x;
        if (end.zoomy == undefined) end.zoomy = obj.scale.y;
        if (end.duration == undefined) end.duration = 0;
        if (end.ease == undefined) end.ease = Ease.lin;
        // Add initial attributes
        let start = {};
        attribs.forEach(attrib => start[attrib] = obj[attrib]);
        start.zoomx = obj.scale.x;
        start.zoomy = obj.scale.y;
        // Ticker stuff
        let t0 = Date.now()/1000;
        let loop = () => {
            let t = Date.now()/1000 - t0;
            let delta = t / end.duration;
            let ease = end.ease(delta);
            if (delta >= 1) {
                attribs.forEach(attrib => obj[attrib] = end[attrib]);
                obj.scale.x = end.zoomx;
                obj.scale.y = end.zoomy;
                resolve();
                return;
            }
            let lerp = (a, b, n) => (1 - n) * a + n * b;
            attribs.forEach(attrib => {
                obj[attrib] = lerp(start[attrib], end[attrib], ease);
            });
            obj.scale.x = lerp(start.zoomx, end.zoomx, ease);
            obj.scale.y = lerp(start.zoomy, end.zoomy, ease);
            obj.animationID = requestAnimationFrame(loop);
        };
        cancelAnimationFrame(obj.animationID);
        loop();
    });
};

// ANIMATION EXECUTION ----------------------------------------------------- //

let floatSin = async (sprite, start, amp, duration, attrib) => {
    let params = {duration: duration/4, ease: Ease.sineout};
    params[attrib] = start + amp;
    await animate(sprite, params);
    params = {duration: duration/2, ease: Ease.sines};
    params[attrib] = start - amp;
    await animate(sprite, params);
    params = {duration: duration/4, ease: Ease.sinein};
    params[attrib] = start;
    await animate(sprite, params);
    floatSin(sprite, start, amp, duration, attrib);
};

let floatCos = async (sprite, start, amp, duration, attrib) => {
    let params = {duration: duration/2, ease: Ease.sines};
    params[attrib] = start - amp * 2;
    await animate(sprite, params);
    params[attrib] = start;
    await animate(sprite, params);
    floatCos(sprite, start, amp, duration, attrib);
};

let bubbleUp = async sprite => {
    sprite.x = randRange(20, 620);
    sprite.y = 400;
    sprite.scale.x = randRange(0.02, 0.15);
    sprite.scale.y = sprite.scale.x;
    await animate(sprite, {duration: randRange(5, 13), ease: Ease.sineout, y: -200});
    bubbleUp(sprite);
};

let quickRot = async (sprite, amp) => {
    await animate(sprite, {duration: 0.8, ease: Ease.quads, rotation: sprite.rotation+amp, zoomx: -sprite.scale.x});
}

let floatToTop = async (xy0, xy) => {
    await animate(fish3, {duration: 3, ease: Ease.quads, x: xy[0], y: xy[1]});
    await quickRot(fish3, 1);
    await animate(fish3, {duration: 4, ease: Ease.quads, x: xy0[0], y: xy0[1]});
    await quickRot(fish3, -1);
    floatCos(fish3, 320, -12, 4.4, 'y');
    floatCos(fish3, -0.3, -0.1, 4, 'rotation');
};

let floatToPoint = async (xy) => {
    if (xy[0] >= 150) await quickRot(fish1, 0);
    await animate(fish1, {duration: 3, ease: Ease.quads, x: xy[0], y: xy[1]});
    await quickRot(fish1, xy[0] >= 150 ? 0 : 1);
    await animate(fish1, {duration: 4, ease: Ease.quads, x: 150, y: 280});
    if (xy[0] < 150) await quickRot(fish1, -1);
    floatSin(fish1, 280, 10, 4, 'y');
    floatCos(fish1, -0.2, -0.1, 3.4, 'rotation');
};

// Default idle animations
floatSin(fish1, 280, 10, 4, 'y');
floatCos(fish1, -0.2, -0.1, 3.4, 'rotation');
floatSin(fish2, 320, -15, 5.2, 'y');
floatSin(fish2, 0, -0.1, 3.6, 'rotation');
floatCos(fish3, 320, -12, 4.4, 'y');
floatCos(fish3, -0.3, -0.1, 4, 'rotation');
floatSin(fish4, 280, -25, 3.8, 'y');
floatSin(fish4, -0.2, -0.1, 4.8, 'rotation');
floatSin(background, 0, 20, 12, 'x');
floatSin(middleground, 0, 10, 12, 'x');
floatSin(foreground, 0, 4, 12, 'x');
bubbles.forEach(bubble => bubbleUp(bubble));

// FISH ON CLICK ----------------------------------------------------------- //

// Set attributes
fish3.interactive = true;
fish3.cursor = 'pointer';

// Set click properties
fish3.on("pointerup", e => {
    cancelAnimationFrame(fish3.animationID);
    floatToTop([530, 330], [300, 0]);
});

// GLASS TAP --------------------------------------------------------------- //

// Set attributes
background.interactive = true;

// Set click properties
background.on("pointerup", e => {
    console.log('bar');
    cancelAnimationFrame(fish1.animationID);
    floatToPoint([e.data.global.x, e.data.global.y]);
});