export default class GFXUtil {
    public static RGBToHex(r: number, g: number, b: number): number {
        return Number("0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
    }

    /**
     * Adds a rounded rectangle to existing graphics gameObject, optional border
     */
    public static addRoundedRect(
        gfx: Phaser.GameObjects.Graphics,
        fillColor: number,
        rectWidth: number,
        rectHeight: number,
        radius: number = 22,
        borderWidth: number = 0,
        borderColor?: number,
    ): Phaser.GameObjects.Graphics {
        if (borderWidth != 0) {
            gfx.fillStyle(borderColor, 1);
            gfx.fillRoundedRect(-1, -1, rectWidth, rectHeight, radius);
            rectWidth -= borderWidth * 2;
            rectHeight -= borderWidth * 2;
        }

        gfx.fillStyle(fillColor, 1);
        gfx.fillRoundedRect(0, 0, rectWidth, rectHeight, radius);
        return gfx;
    }

    /**
     * Adds a rectangle to existing graphics gameObject, optional border
     */
    public static addRect(
        gfx: Phaser.GameObjects.Graphics,
        fillColor: number,
        rectWidth: number,
        rectHeight: number,
        borderWidth: number = 0,
        borderColor?: number,
    ): Phaser.GameObjects.Graphics {
        if (borderWidth != 0) {
            gfx.fillStyle(borderColor, 1);
            gfx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
            rectWidth -= borderWidth * 2;
            rectHeight -= borderWidth * 2;
        }

        gfx.fillStyle(fillColor, 1);
        gfx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
        return gfx;
    }

    public static GetWorldPos(
        obj:
            | Phaser.GameObjects.Image
            | Phaser.GameObjects.Sprite
            | Phaser.GameObjects.Container
            | Phaser.GameObjects.DynamicBitmapText
            | Phaser.GameObjects.BitmapText,
    ): Phaser.Math.Vector2 {
        let x = obj.x;
        let y = obj.y;
        let cur = obj;
        while (cur.parentContainer != undefined) {
            x += cur.parentContainer.x;
            y += cur.parentContainer.y;
            cur = cur.parentContainer;
        }
        return new Phaser.Math.Vector2(x, y);
    }
}
