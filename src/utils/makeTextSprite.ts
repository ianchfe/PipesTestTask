import * as THREE from "three";

interface TextSpriteParams {
    fontsize?: number;
    color?: string;
}

export function makeTextSprite(message: string, parameters: TextSpriteParams = {}): THREE.Sprite {
    const fontface = "Arial";
    const fontsize = parameters.fontsize ?? 64;
    const color = parameters.color ?? "#ffffff";

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    context.font = `${fontsize}px ${fontface}`;

    const textWidth = context.measureText(message).width;

    canvas.width = textWidth;
    canvas.height = fontsize * 1.4;

    context.font = `${fontsize}px ${fontface}`;
    context.fillStyle = color;
    context.textBaseline = "top";

    context.fillText(message, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);

    return sprite;
}
