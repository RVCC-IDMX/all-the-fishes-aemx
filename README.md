# **All The Fishes**

**All The Fishes** is a small Javascript project that uses the [PixiJS](https://pixijs.com/) Engine to create a small animated "fish tank".

## **Coding strategy**
Organized code is a must have for projects like these- layering sprites and setting properties becomes so much simplier when you know exactly where and when everything is loaded.
### **Sprite initalization**
The primary coding strategy for this project was to create a way to load each sprite into the environment that was clean, easy to use, and mutable. During sprite initalization, a function `initSprite()` is called that sets a couple of different properties via passed parameters. These parameters are `file`, `x`, `y`, `size`, and `container`.

- `file` - The sprite to be initialized, must be a `.png` file from the `img` folder
- `x`, `y` - Sets the position of the sprite
- `size` - Sets the scale of the sprite, 1 being the original size of the sprite
- `container` (optional) - Sets the container the sprite belongs to. Must be a predefined variable

The function returns a PIXI `sprite` object, so that the sprite is placed into the environment when it is set to a variable as so:
```js
let mySpriteName = initSprite(file, x, y, size, container);
```
### **Easing and animation**
Similar to sprite initalization, the animations applied to the sprites are done through a function call in an animation loop. There are two ease options that calculate the sine and cosine wave given a time value, amplitude, period, and offset. These eases can be applied to any sprite or container property, in this case, the `x`, `y`, and `rotation` properties. These are all combined to make the fish floating look extra-realistic, and the "fish tank" to have a parallax effect,

## **Image Attribution**
[**Fish Tank Rocks**](https://m.media-amazon.com/images/I/71OB9GNAlXL._AC_SL1000_.jpg)

[**Coral 1**](https://i.dlpng.com/static/png/1433484-cartoon-coral-cartoon-coral-sea-png-and-vector-coral-png-572_519_preview.png) - [**Coral 2**](https://atlas-content-cdn.pixelsquid.com/stock-images/coral-reef-e1aEDLE-600.jpg) - [**Coral 3**](https://www.vhv.rs/dpng/d/22-221099_pink-coral-reef-png-transparent-png.png)

[**Fish 1**](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP7xi1XT0uXjJ-VtYmEkkyUY1-hUyeupf3nmusPGuj4bOcf7VGqf1SPDJvsJgvoxMlNb4&usqp=CAU) - [**Fish 2**](https://img.favpng.com/21/1/10/siamese-fighting-fish-aquarium-tropical-fish-saltwater-fish-png-favpng-GisUaLtBNLsEFnfXyVhJFar7d.jpg) - [**Fish 3**](https://www.pngkey.com/png/full/99-995213_fantail-fish-pet-stock-photography-fish.png) - [**Fish 4**](https://png.pngtree.com/png-vector/20210422/ourlarge/pngtree-aquarium-beautiful-tropical-fish-png-image_3226783.jpg)