namespace SpriteKind {
    export const Powerup = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
}


enum Direction { UP, LEFT, DOWN, RIGHT };

class PlaneImages {
    private readonly up: Image;
    private readonly left: Image;
    private readonly down: Image;
    private readonly right: Image;

    constructor(up: Image, left: Image, down: Image, right: Image) {
        this.up = up;
        this.left = left;
        this.down = down;
        this.right = right;
    }

    public getImage(direction: Direction): Image {
        switch(direction) {
            case Direction.UP: return this.up;
            case Direction.LEFT: return this.left;
            case Direction.DOWN: return this.down;
            case Direction.RIGHT: return this.right;
        }
    }
}

interface EnemyPlane {
    getImages(): PlaneImages;
    destroy(): void;
    getSprite(): Sprite;
    getScore(): number;
    gotHitBy(projectile: Sprite): void;
}

interface PlaneDefinition {
    direction: Direction;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

abstract class Plane  {
    protected readonly sprite: Sprite;
    protected remainingHits: number = 1;
    
    constructor(image: Image, def: PlaneDefinition) {
        this.sprite = sprites.create(image, SpriteKind.Enemy);
        this.sprite.setFlag(SpriteFlag.AutoDestroy, true);
        this.sprite.setPosition(def.x, def.y)
        this.sprite.setVelocity(def.vx, def.vy)
    }

    public destroy(): void {
        // override in derived classes
    }

    public getSprite(): Sprite {
        return this.sprite
    }

    public getScore(): number {
        return 10;
    }
    
    public gotHitBy(projectile: Sprite): void {
        this.remainingHits -= 1;
        projectile.destroy();
        if (this.remainingHits == 0) {
            this.sprite.destroy(effects.fire, 100);
            info.changeScoreBy(this.getScore())
            music.playSound("C4:1");
        }
    }
}

class GreenPlane extends Plane implements EnemyPlane {
    public static readonly images: PlaneImages = new PlaneImages(
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . 9 9 9 9 9 9 . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 8 8 . . . . . . .
            . . . . . 7 7 8 8 7 7 . . . . .
            . 6 7 7 6 7 e 7 7 e 7 6 7 7 6 .
            . . . 7 7 7 7 7 7 7 7 7 7 . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . 7 7 7 7 . . . . . .
            . . . . 7 7 6 7 7 6 7 7 . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . 6 . . . . . . . .
            . . . . . . . 7 . . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 6 7 . . . . 7 . .
            . . . 9 . . 7 7 7 . . . . 7 . .
            . . . 9 . . 7 e 7 . . . 7 6 . .
            . . . 9 7 8 8 7 7 7 7 7 7 7 7 .
            . . . 9 7 8 8 7 7 7 7 7 7 7 7 .
            . . . 9 . . 7 e 7 . . . 7 6 . .
            . . . 9 . . 7 7 7 . . . . 7 . .
            . . . . . . . 6 7 . . . . 7 . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 7 . . . . . . . .
            . . . . . . . 6 . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . 7 7 6 7 7 6 7 7 . . . .
            . . . . . . 7 7 7 7 . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . 7 7 7 7 7 7 7 7 7 7 . . .
            . 6 7 7 6 7 e 7 7 e 7 6 7 7 6 .
            . . . . . 7 7 8 8 7 7 . . . . .
            . . . . . . . 8 8 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . 9 9 9 9 9 9 . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . 6 . . . . . . .
            . . . . . . . . 7 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . 7 . . . . 7 6 . . . . . . .
            . . 7 . . . . 7 7 7 . . 9 . . .
            . . 6 7 . . . 7 e 7 . . 9 . . .
            . 7 7 7 7 7 7 7 7 8 8 7 9 . . .
            . 7 7 7 7 7 7 7 7 8 8 7 9 . . .
            . . 6 7 . . . 7 e 7 . . 9 . . .
            . . 7 . . . . 7 7 7 . . 9 . . .
            . . 7 . . . . 7 6 . . . . . . .
            . . . . . . . 7 7 . . . . . . .
            . . . . . . . . 7 . . . . . . .
            . . . . . . . . 6 . . . . . . .
            . . . . . . . . . . . . . . . .
        `
    );

    constructor(def: PlaneDefinition) {
        super(GreenPlane.images.getImage(def.direction), def);
    }

    public getImages() {
        return GreenPlane.images;
    }
}

class RedPlane extends Plane implements EnemyPlane {
    static readonly images: PlaneImages = new PlaneImages(
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . 9 9 9 8 9 9 9 . . . .
            . . . . . . 2 2 2 2 2 . . . . .
            . . . . . 2 2 2 2 2 2 2 . . . .
            . 4 4 3 3 3 3 9 8 c 2 2 2 2 c c
            . 4 3 3 3 3 3 9 8 c 2 2 2 2 2 c
            . 4 4 3 3 3 3 9 8 c 2 2 2 2 c c
            . . . 4 4 3 3 3 2 2 2 2 c c . .
            . . . . . 4 4 3 2 2 c c . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . 2 2 2 c 2 2 2 . . . .
            . . . . . . . . 2 . . . . . . .
            . . . . . . . . 2 . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . 4 4 4 . . . . . . . .
            . . . . . 4 3 4 . . . . . . . .
            . . . . . 3 3 3 4 . . . . . . .
            . . . . . 3 3 3 4 . . . . . . .
            . . 9 . 2 3 3 3 3 4 . . . 2 . .
            . . 9 2 2 3 3 3 3 4 . . . 2 . .
            . . 9 2 2 9 9 9 3 3 2 2 2 2 . .
            . . 8 2 2 8 8 8 2 2 2 2 2 c 2 2
            . . 9 2 2 c c c 2 2 2 2 2 2 . .
            . . 9 2 2 2 2 2 2 c . . . 2 . .
            . . 9 . 2 2 2 2 2 c . . . 2 . .
            . . . . . 2 2 2 c . . . . . . .
            . . . . . 2 2 2 c . . . . . . .
            . . . . . c 2 c . . . . . . . .
            . . . . . c c c . . . . . . . .
        `,
        img`
            . . . . . . . . 2 . . . . . . .
            . . . . . . . . 2 . . . . . . .
            . . . . . 2 2 2 c 2 2 2 . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . . . 2 2 2 . . . . . .
            . . . . . 4 4 3 2 2 c c . . . .
            . . . 4 4 3 3 3 2 2 2 2 c c . .
            . 4 4 3 3 3 3 9 8 c 2 2 2 2 c c
            . 4 3 3 3 3 3 9 8 c 2 2 2 2 2 c
            . 4 4 3 3 3 3 9 8 c 2 2 2 2 c c
            . . . . . 2 2 2 2 2 2 2 . . . .
            . . . . . . 2 2 2 2 2 . . . . .
            . . . . . 9 9 9 8 9 9 9 . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . 4 4 4 . . . . .
            . . . . . . . . 4 3 4 . . . . .
            . . . . . . . 4 3 3 3 . . . . .
            . . . . . . . 4 3 3 3 . . . . .
            . . 2 . . . 4 3 3 3 3 2 . 9 . .
            . . 2 . . . 4 3 3 3 3 2 2 9 . .
            . . 2 2 2 2 3 3 9 9 9 2 2 9 . .
            2 2 c 2 2 2 2 2 8 8 8 2 2 8 . .
            . . 2 2 2 2 2 2 c c c 2 2 9 . .
            . . 2 . . . c 2 2 2 2 2 2 9 . .
            . . 2 . . . c 2 2 2 2 2 . 9 . .
            . . . . . . . c 2 2 2 . . . . .
            . . . . . . . c 2 2 2 . . . . .
            . . . . . . . . c 2 c . . . . .
            . . . . . . . . c c c . . . . .
        `
    );

    constructor(def: PlaneDefinition) {
        super(RedPlane.images.getImage(def.direction), def);
    }

    public getImages(): PlaneImages {
        return RedPlane.images;
    }

    public shoot(): void {
        // does not shoot
    }
}

class GrayPlane extends Plane implements EnemyPlane {
    private static readonly projectileImage: Image = img`
        d f d
        f 2 f
        d f d
    `;
    
    public static readonly images: PlaneImages = new PlaneImages(
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . 6 b . . . . . . .
            . . . . . . . 6 b . . . . . . .
            . . . . . . . 6 b . . . . . . .
            . . . . . . 6 6 6 b . . . . . .
            . . . . . . 6 8 8 b . . . . . .
            . . . . . 6 6 8 8 6 b . . . . .
            . . . . . 6 6 8 8 6 b . . . . .
            . . . . 6 6 6 6 6 6 6 b . . . .
            . . . . 6 6 6 6 6 6 6 b . . . .
            . . . 6 6 6 6 6 6 6 6 6 b . . .
            . . . 6 6 6 6 6 6 6 6 6 b . . .
            . . 6 6 6 6 6 6 6 6 6 6 6 b . .
            . 6 6 6 6 6 6 6 6 6 6 6 6 b b .
            . . . 2 4 2 . . . . 2 4 2 . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . 6 .
            . . . . . . . . . . . . . 6 6 .
            . . . . . . . . . . . 6 6 6 6 2
            . . . . . . . . . 6 6 6 6 6 6 4
            . . . . . . . 6 6 6 6 6 6 6 6 2
            . . . . . 6 6 6 6 6 6 6 6 6 6 .
            . . 6 6 6 6 8 8 8 6 6 6 6 6 6 .
            . . b b b 6 8 8 8 6 6 6 6 6 6 .
            . . . . . b b 6 6 6 6 6 6 6 6 .
            . . . . . . . b b 6 6 6 6 6 6 2
            . . . . . . . . . b b 6 6 6 6 4
            . . . . . . . . . . . b b 6 6 2
            . . . . . . . . . . . . . b b .
            . . . . . . . . . . . . . . b .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . 2 4 2 . . . . 2 4 2 . . .
            . 6 6 6 6 6 6 6 6 6 6 6 6 b b .
            . . 6 6 6 6 6 6 6 6 6 6 6 b . .
            . . . 6 6 6 6 6 6 6 6 6 b . . .
            . . . 6 6 6 6 6 6 6 6 6 b . . .
            . . . . 6 6 6 6 6 6 6 b . . . .
            . . . . 6 6 6 6 6 6 6 b . . . .
            . . . . . 6 6 8 8 6 b . . . . .
            . . . . . 6 6 8 8 6 b . . . . .
            . . . . . . 6 8 8 b . . . . . .
            . . . . . . 6 6 6 b . . . . . .
            . . . . . . . 6 b . . . . . . .
            . . . . . . . 6 b . . . . . . .
            . . . . . . . 6 b . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . .
            . 6 . . . . . . . . . . . . . .
            . 6 6 . . . . . . . . . . . . .
            2 6 6 6 6 . . . . . . . . . . .
            4 6 6 6 6 6 6 . . . . . . . . .
            2 6 6 6 6 6 6 6 6 . . . . . . .
            . 6 6 6 6 6 6 6 6 6 6 . . . . .
            . 6 6 6 6 6 6 8 8 8 6 6 6 6 . .
            . 6 6 6 6 6 6 8 8 8 6 b b b . .
            . 6 6 6 6 6 6 6 6 b b . . . . .
            2 6 6 6 6 6 6 b b . . . . . . .
            4 6 6 6 6 b b . . . . . . . . .
            2 6 6 b b . . . . . . . . . . .
            . b b . . . . . . . . . . . . .
            . b . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `
    );

    constructor(def: PlaneDefinition) {
        super(GrayPlane.images.getImage(def.direction), def);
        this.shoot();
    }

    public getImages(): PlaneImages {
        return GrayPlane.images;
    }

    public shoot(): void {
        let vx =  50 * Math.sign(this.sprite.vx);
        let vy =  50 * Math.sign(this.sprite.vy);
        let ax = 200 * Math.sign(this.sprite.vx);
        let ay = 200 * Math.sign(this.sprite.vy);
        if (this.sprite.vx !== 0) {
            vy = 0;
            ay = 0;
        } else if (this.sprite.vy !== 0) {
            vx = 0;
            ax = 0;
        }
        const projectile = sprites.createProjectileFromSprite(GrayPlane.projectileImage, this.sprite, vx, vy)
        projectile.ax = ax;
        projectile.ay = ay;
        projectile.setKind(SpriteKind.EnemyProjectile)
    }
}

class BigPlane extends Plane implements EnemyPlane {
    private static readonly projectileImage: Image = img`
        5 2 5
        2 4 2
        5 2 5
    `;
    public static readonly images: PlaneImages = new PlaneImages(
        img`
            . . . . . . . . . . . 2 . . . . . . . . . . . .
            . . . . . . . . . . 2 7 2 . . . . . . . . . . .
            . . . . 1 9 9 9 b . 7 2 7 . 1 9 9 9 b . . . . .
            . . . . . . 7 . . . 2 7 2 . . . 7 . . . . . . .
            . . . . . 7 7 7 7 7 7 7 7 7 7 7 7 7 . . . . . .
            d 7 7 7 7 7 d d d d 7 7 7 b b b b 7 7 7 7 7 7 b
            . d d d 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 b b b b .
            . . . . d d d 7 7 7 7 7 7 7 7 7 b b b . . . . .
            . . . . . . . d d 7 2 7 2 7 b b . . . . . . . .
            . . . . . . . . . d 7 2 7 b . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . b b b 7 7 7 b b b . . . . . . . .
            . . . . . . . 7 7 7 7 7 7 7 7 7 . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . . 2 . . . . . . . . . . . .
            . . . . . . . . . . . . . . . . . . . . . . . .
        `,
        img`
            . . . . . d . . . . . . . . . . . . . .
            . . . . . 7 d . . . . . . . . . . . . .
            . . . . . 7 7 . . . . . . . . . . . . .
            . . . . . 7 7 . . . . . . . . . . . . .
            . . b . . 7 7 d . . . . . . . . . . . .
            . . 9 . 7 7 7 7 . . . . . . . . . . . .
            . . 9 7 7 d 7 7 . . . . . . . . . . . .
            . . 9 . 7 d 7 7 d . . . . . . b 7 . . .
            . . 1 . 7 d 7 7 7 . . . . . . b 7 . . .
            . . . . 7 d 7 7 7 d . . . . . b 7 . . .
            . 2 7 2 7 7 7 7 2 7 7 7 7 7 7 7 7 7 . .
            2 7 2 7 7 7 7 7 7 2 7 7 7 7 7 7 7 7 2 .
            . 2 7 2 7 7 7 7 2 7 7 7 7 7 7 7 7 7 . .
            . . . . 7 b 7 7 7 b . . . . . b 7 . . .
            . . b . 7 b 7 7 7 . . . . . . b 7 . . .
            . . 9 . 7 b 7 7 b . . . . . . b 7 . . .
            . . 9 7 7 b 7 7 . . . . . . . . . . . .
            . . 9 . 7 7 7 7 . . . . . . . . . . . .
            . . 1 . . 7 7 b . . . . . . . . . . . .
            . . . . . 7 7 . . . . . . . . . . . . .
            . . . . . 7 7 . . . . . . . . . . . . .
            . . . . . 7 7 . . . . . . . . . . . . .
            . . . . . 7 b . . . . . . . . . . . . .
            . . . . . b . . . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . 2 . . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . 7 7 7 7 7 7 7 7 7 . . . . . . . .
            . . . . . . . b b b 7 7 7 b b b . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . . 7 7 7 . . . . . . . . . . .
            . . . . . . . . . d 7 2 7 b . . . . . . . . . .
            . . . . . . . d 7 7 2 7 2 7 7 b . . . . . . . .
            . . . . d 7 7 7 7 7 7 7 7 7 7 7 7 7 b . . . . .
            . d 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 b .
            d 7 7 7 7 7 d d d d 7 7 7 b b b b 7 7 7 7 7 7 b
            . . . . . 7 7 7 7 7 7 7 7 7 7 7 7 7 . . . . . .
            . . . . . . 7 . . . 2 7 2 . . . 7 . . . . . . .
            . . . . b d d d 1 . 7 2 7 . b d d d 1 . . . . .
            . . . . . . . . . . 2 7 2 . . . . . . . . . . .
            . . . . . . . . . . . 2 . . . . . . . . . . . .
        `,
        img`
            . . . . . . . . . . . . . . d . . . . .
            . . . . . . . . . . . . . d 7 . . . . .
            . . . . . . . . . . . . . 7 7 . . . . .
            . . . . . . . . . . . . . 7 7 . . . . .
            . . . . . . . . . . . . d 7 7 . . 1 . .
            . . . . . . . . . . . . 7 7 7 7 . 9 . .
            . . . . . . . . . . . . 7 7 d 7 7 9 . .
            . . . 7 b . . . . . . d 7 7 d 7 . 9 . .
            . . . 7 b . . . . . . 7 7 7 d 7 . b . .
            . . . 7 b . . . . . d 7 7 7 d 7 . . . .
            . . 7 7 7 7 7 7 7 7 7 2 7 7 7 7 2 7 2 .
            . 2 7 7 7 7 7 7 7 7 2 7 7 7 7 7 7 2 7 2
            . . 7 7 7 7 7 7 7 7 7 2 7 7 7 7 2 7 2 .
            . . . 7 b . . . . . b 7 7 7 b 7 . . . .
            . . . 7 b . . . . . . 7 7 7 b 7 . 1 . .
            . . . 7 b . . . . . . b 7 7 b 7 . 9 . .
            . . . . . . . . . . . . 7 7 b 7 7 9 . .
            . . . . . . . . . . . . 7 7 7 7 . 9 . .
            . . . . . . . . . . . . b 7 7 . . b . .
            . . . . . . . . . . . . . 7 7 . . . . .
            . . . . . . . . . . . . . 7 7 . . . . .
            . . . . . . . . . . . . . 7 7 . . . . .
            . . . . . . . . . . . . . b 7 . . . . .
            . . . . . . . . . . . . . . b . . . . .
        `
    );

    private readonly interval: number;

    constructor(def: PlaneDefinition) {
        super(BigPlane.images.getImage(def.direction), def);
        this.remainingHits = 3;
        this.shoot();
        this.interval = setInterval(() => {
            this.shoot();
        }, 1200);
    }

    public getImages(): PlaneImages {
        return BigPlane.images;
    }

    public shoot(): void {
        const projectile = sprites.createProjectileFromSprite(BigPlane.projectileImage, this.sprite, 0, 70)
        projectile.setKind(SpriteKind.EnemyProjectile)
    }

    public destroy() {
        clearInterval(this.interval);
    }

    public getScore(): number {
        return 30;
    }
}

interface IEnemyPlane {
    new(def: PlaneDefinition): EnemyPlane;
}
class EnemyPlanes {
    private static planes: any = {};

    private static register<T extends EnemyPlane>(plane: T): T {
        EnemyPlanes.planes[plane.getSprite().id] = plane;
        plane.getSprite().onDestroyed(() => {
            delete EnemyPlanes.planes[plane.getSprite().id];
            plane.destroy();
        });
        return plane;
    }

    public static fromSprite(sprite: Sprite): EnemyPlane {
        return EnemyPlanes.planes[sprite.id];
    }

    public static createRedPlane(def: PlaneDefinition): RedPlane {
        return EnemyPlanes.register(new RedPlane(def));
    }
    public static createGreenPlane(def: PlaneDefinition): GreenPlane {
        return EnemyPlanes.register(new GreenPlane(def));
    }
    public static createGrayPlane(def: PlaneDefinition): GrayPlane {
        return EnemyPlanes.register(new GrayPlane(def));
    }
    public static createBigPlane(def: PlaneDefinition): BigPlane {
        return EnemyPlanes.register(new BigPlane(def));
    }

    public static randomPlaneFactory(): { (def: PlaneDefinition): EnemyPlane} {
        switch (Math.randomRange(0, 2)) {
            case 0: return (def: PlaneDefinition) => EnemyPlanes.createRedPlane(def);
            case 1: return (def: PlaneDefinition) => EnemyPlanes.createGreenPlane(def)
            default: return (def: PlaneDefinition) => EnemyPlanes.createGrayPlane(def)
        }
    }
}

class Player {
    private hits = 0
    private weaponLevel = 1
    private readonly sprite: Sprite;

    constructor() {
        this.sprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . 4 4 . . . . . . .
            . . . 4 . . . 4 4 . . . 4 . . .
            . . 9 9 9 . 4 8 8 e . 9 9 9 . .
            . . . 4 . . 4 8 8 e . . 4 . . .
            . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
            4 4 e e e e e e b b b b b b 4 e
            . 6 4 4 4 4 4 4 4 4 4 4 4 4 6 .
            . . . 4 e . . . . . . 4 e . . .
            . . . 4 e . . . . . . 4 e . . .
            . . . 4 e . . . . . . 4 e . . .
            . . 4 4 4 e . . . . 4 4 4 e . .
            . . 3 4 2 3 e e e e 3 2 4 3 . .
            4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
            . . . 4 e . . . . . . 4 e . . .
        `, SpriteKind.Player)

        this.sprite.y = 110;
        controller.moveSprite(this.sprite);
        this.sprite.setFlag(SpriteFlag.StayInScreen, true);

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            this.shoot();
        });
        game.onUpdateInterval(150, function () {
            if (controller.A.isPressed()) {
                this.shoot();
            }
        });

        sprites.onOverlap(SpriteKind.EnemyProjectile, SpriteKind.Player, function (enemyProjectile, playerSprite) {
            this.gotHit(playerSprite, enemyProjectile)
        })

        sprites.onOverlap(SpriteKind.Powerup, SpriteKind.Player, function (powerUpSprite, playerSprite) {
            this.weaponLevel += 1;
            powerUp.caught();
        })
        sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (enemySprite, playerSprite) {
            this.gotHit(playerSprite, enemySprite)
        })
    }

    public getSprite(): Sprite {
        return this.sprite;
    }

    public shoot() {
        const projectileImg = img`
            1
            1
        `
        if (this.weaponLevel >= 1) {
            sprites.createProjectileFromSprite(projectileImg, this.sprite, 0, -100)
        }
        if (this.weaponLevel >= 2) {
            sprites.createProjectileFromSprite(projectileImg, this.sprite, -50, -87)
            sprites.createProjectileFromSprite(projectileImg, this.sprite, 50, -87)
        }
        if (this.weaponLevel >= 3) {
            sprites.createProjectileFromSprite(projectileImg, this.sprite, -87, -50)
            sprites.createProjectileFromSprite(projectileImg, this.sprite, 87, -50)
        }
    }

    public gotHit(player: Sprite, otherSprite: Sprite) {
        if (this.weaponLevel > 1) {
            this.weaponLevel -= 1;
            music.playSound("G5:1 C5:1");
        } else {
            info.changeLifeBy(-1)
            music.playSound("G5:1 E5:1 C5:2");
        }
        player.startEffect(effects.spray, 200)
        otherSprite.destroy(effects.fire, 100)
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (projectile, enemySprite) {
    EnemyPlanes.fromSprite(enemySprite).gotHitBy(projectile);
})


game.onUpdateInterval(5000, function () {
    if (Math.percentChance(10)) {
        const island = sprites.create(img`
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . b d b d . . . . d b . . . . . . . . .
            . . . . . . . . . . . d d d d d . . . . d d d d d . . . . . . .
            . . . . . . . b d b d b d d d d . . . . d d d d b . . . . . . .
            . . . . . . d d d d 7 7 7 7 7 7 d . . . . d d d d b . . . . . .
            . . . . . b d d 7 7 7 7 7 7 7 7 7 d . . . d d d d d d . . . . .
            . . . . b d d 7 7 7 6 7 7 7 6 7 7 7 d . . d 7 7 7 d d b . . . .
            . . . . d d 7 7 7 7 7 7 e 7 7 7 6 7 d . . d 7 7 7 7 d d d . . .
            . . . . d d 7 7 7 7 7 7 7 6 7 6 7 7 7 d . d 7 a 7 7 d d d d . .
            . . . b d d 7 7 e 7 5 6 7 7 7 7 7 d d d d d 7 7 7 7 7 7 d d . .
            . . b d d d 7 7 5 6 7 4 7 6 6 8 8 8 8 d d d d 7 7 7 7 7 7 b . .
            . . d d 7 7 7 e 7 7 6 7 7 7 8 9 8 9 8 8 d d d 7 7 7 7 7 7 d . .
            . . b d 7 7 7 7 7 7 7 6 7 7 8 8 9 8 9 8 8 d d 7 5 7 7 7 7 d . .
            . . b d 7 7 7 6 7 6 7 7 7 7 8 9 8 9 8 9 8 d d 7 7 a 7 7 d d . .
            . . d d 7 7 7 7 7 7 7 7 7 d d 8 8 8 8 8 d d d 7 5 7 7 7 d b . .
            . . b d 7 7 7 7 7 7 7 7 d d d d d d d d d d d 7 7 7 7 7 d d . .
            . . . d d d d d d d d 2 2 2 d d 2 2 2 d d d d 7 7 a 7 7 d d . .
            . . . b d d d d d d d 2 2 2 d d 2 2 2 d d d d 7 7 7 7 7 d b . .
            . . . b d d 7 7 7 7 7 2 2 2 d d 2 2 2 d d d d 7 7 a 7 7 d d . .
            . . . d d d 6 6 7 7 6 6 6 6 7 d d d d d d d d d 7 7 7 7 d d . .
            . . . b d d 6 6 6 6 6 6 6 6 6 6 7 d d d d d d d 7 7 7 d d b . .
            . . . . . d d 7 6 6 7 6 7 6 6 6 6 7 d d d e e d d d d d d d . .
            . . . . . b d 7 6 6 7 6 a 6 6 7 6 7 6 6 e e e d d 6 d d b . . .
            . . . . . b d 7 6 6 6 6 6 6 6 6 6 6 6 6 e e d 6 6 6 d . b . . .
            . . . . . d b d 7 7 7 6 6 6 6 6 6 6 6 d d d 6 6 d d d . . . . .
            . . . . . . . . d d 7 7 6 6 6 6 6 6 6 d d d 6 d d d b . . . . .
            . . . . . . . . b d d d d 7 7 7 7 7 7 d d d d d d b . . . . . .
            . . . . . . . . d b d d d d d d d d d d d d d d . . . . . . . .
            . . . . . . . . . . . d b d b d b d d b d d b d . . . . . . . .
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        `, SpriteKind.Food)
        island.setPosition(Math.randomRange(10, 100), -10)
        island.setVelocity(0, 5)
        island.setFlag(SpriteFlag.Ghost, true)
        island.z = -2
        island.setFlag(SpriteFlag.AutoDestroy, true);
    }
})

game.onUpdateInterval(3000, function () {
    const cloud = sprites.create(img`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . 1 1 1 d . . 1 1 1 1 . . . . . . . 1 1 1 d . . . .
        . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 d . . . . . 1 1 1 1 1 . . . .
        . . . 1 1 1 1 1 1 1 1 1 1 1 d 1 1 d 1 1 1 . 1 1 1 1 1 1 1 d . .
        . 1 1 1 1 1 1 d d 1 1 1 1 1 1 1 1 1 1 1 1 d 1 1 1 d d 1 1 1 d .
        . 1 1 1 1 1 d 1 1 d 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 d d d d 1 1 1 1 1 1 1 1 1 1 1 1 1 d
        . . . 1 1 1 1 1 1 1 1 1 1 d 1 1 1 1 d 1 1 1 1 1 1 1 1 1 1 1 1 d
        . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 d 1 1 1 d
        . . . 1 1 1 d 1 1 1 1 1 d 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 d
        . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 d 1 1 1 1 1 1 1 1 .
        . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 d 1 1 . .
        . . . . 1 1 1 1 1 1 1 1 1 1 d 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . .
        . . . . . . . . . . 1 1 1 1 1 1 1 d 1 1 1 1 1 1 1 1 1 1 . . . .
        . . . . . . . . . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    `, SpriteKind.Food)
    cloud.setPosition(Math.randomRange(10, 100), -10)
    cloud.setVelocity(0, Math.randomRange(20, 50))
    cloud.setFlag(SpriteFlag.Ghost, true)
    cloud.z = -1
    cloud.setFlag(SpriteFlag.AutoDestroy, true);
})

class PowereUp {
    private sprite: Sprite;
    constructor() {
        this.sprite = sprites.create(img`
            . . . . . . . .
            . . 7 7 7 7 7 .
            . 7 7 1 1 1 7 7
            . 7 7 1 7 1 7 7
            . 7 7 1 1 1 7 7
            . 7 7 1 7 7 7 7
            . 7 7 1 7 7 7 7
            . . 7 7 7 7 7 .
        `, SpriteKind.Powerup);
        this.hide();
        this.sprite.z = -1;

        game.onUpdateInterval(3000, function () {
            if (Math.percentChance(50)) {
                this.sprite.setPosition(Math.randomRange(10, scene.screenWidth() - 10), Math.randomRange(10, scene.screenHeight() - 10))
                this.show();
                setTimeout(function () {
                    this.hide();
                }, 3000)
            }
        })
    }

    private show() {
        this.sprite.setFlag(SpriteFlag.Invisible | SpriteFlag.Ghost, false);
    }

    private hide() {
        this.sprite.setFlag(SpriteFlag.Invisible | SpriteFlag.Ghost, true);
    }

    public caught() {
        music.baDing.play();
        this.sprite.startEffect(effects.fountain, 500);
        this.hide();
    }
}

interface Event {
    ticks: number;
    planeFactory(): EnemyPlane;
}

interface EventProps {
    ticks: number;
    v: number;
    delay?: number,
    pos: number,
    offset?: number,
    direction: Direction;
    plane: (def: PlaneDefinition) => EnemyPlane
}

class StoryBook {
    private storyBook: Event[];
    private static readonly greenPlane = (def: PlaneDefinition) => EnemyPlanes.createGreenPlane(def);
    private static readonly grayPlane = (def: PlaneDefinition) => EnemyPlanes.createGrayPlane(def);
    private static readonly redPlane = (def: PlaneDefinition) => EnemyPlanes.createRedPlane(def);
    private static readonly bigPlane = (def: PlaneDefinition) => EnemyPlanes.createBigPlane(def);

    private setup() {
        this.storyBook = [];
        let ticks = 0;
        for (let i = 0; i < 5; i++) {
            this.single(   { ticks: ticks += 10, v: 40, pos: 10, direction: Direction.LEFT, plane: StoryBook.greenPlane});
            this.single(   { ticks: ticks += 10, v: 40, pos: 30, direction: Direction.RIGHT, plane: StoryBook.greenPlane });
            this.single(   { ticks: ticks += 20, v: 60, pos: 70, direction: Direction.RIGHT, plane: StoryBook.redPlane});
            this.single(   { ticks: ticks,       v: 60, pos: 90, direction: Direction.LEFT, plane: StoryBook.redPlane });
            this.single(   { ticks: ticks += 50, v: 80, pos: 30, direction: Direction.LEFT, plane: StoryBook.grayPlane});
            this.single(   { ticks: ticks += 20, v: 30, pos: 60, direction: Direction.DOWN, plane: StoryBook.bigPlane});

            this.inARow(3, { ticks: ticks += 30, v: 50, pos: 50, direction: Direction.LEFT, plane: StoryBook.greenPlane});
            this.inARow(4, { ticks: ticks += 30, delay: 2, v: 80, pos: 10, offset: 10, direction: Direction.RIGHT, plane: StoryBook.redPlane});
            this.inARow(3, { ticks: ticks += 30, delay: 4, v: 30, pos: 40, offset: 20, direction: Direction.DOWN, plane: StoryBook.bigPlane});
            this.inARow(2, { ticks: ticks += 30, delay: 4, v: 30, pos: 40, offset: 0, direction: Direction.DOWN, plane: StoryBook.greenPlane });

            this.single(   { ticks: ticks += 10, v: 60, pos: scene.screenHeight() / 2, direction: Direction.LEFT, plane: StoryBook.redPlane });
            this.single(   { ticks: ticks,       v: 60, pos: scene.screenHeight() / 2, direction: Direction.RIGHT, plane: StoryBook.redPlane });
            this.single(   { ticks: ticks,       v: 60, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: StoryBook.redPlane });
            this.single(   { ticks: ticks,       v: 60, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: StoryBook.redPlane });

            this.inARow(6, { ticks: ticks += 30, v: 15, delay: 0, pos: 10, offset: 27, direction: Direction.DOWN, plane: StoryBook.greenPlane });
            this.inARow(6, { ticks: ticks += 10, v: 30, delay: 0, pos: 10, offset: 27, direction: Direction.DOWN, plane: StoryBook.redPlane });
            this.inARow(6, { ticks: ticks += 10, v: 80, delay: 0, pos: 10, offset: 27, direction: Direction.DOWN, plane: StoryBook.grayPlane });

            this.single({ ticks: ticks += 20, v: 20, pos: scene.screenHeight() / 2, direction: Direction.LEFT, plane: StoryBook.greenPlane });
            this.single({ ticks: ticks, v: 20, pos: scene.screenHeight() / 2, direction: Direction.RIGHT, plane: StoryBook.greenPlane });
            this.single({ ticks: ticks, v: 20, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: StoryBook.greenPlane });
            this.single({ ticks: ticks, v: 20, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: StoryBook.greenPlane });

            this.single({ ticks: ticks += 30, v: 60, pos: scene.screenHeight() / 2, direction: Direction.LEFT, plane: StoryBook.grayPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenHeight() / 2, direction: Direction.RIGHT, plane: StoryBook.grayPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: StoryBook.grayPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: StoryBook.grayPlane });

            this.inARow(3, { ticks: ticks += 30, delay: 4, v: 30, pos: 40, offset: 30, direction: Direction.LEFT, plane: StoryBook.grayPlane });
            this.inARow(3, { ticks: ticks,       delay: 4, v: 30, pos: 25, offset: 30, direction: Direction.RIGHT, plane: StoryBook.grayPlane });
            this.inARow(3, { ticks: ticks += 30, v: 10, pos: 60, offset: 20, direction: Direction.UP, plane: StoryBook.bigPlane });
            this.inARow(3, { ticks: ticks += 30, v: 10, pos: 60, offset: 20, direction: Direction.UP, plane: StoryBook.bigPlane });
           
        }
    }

    private single(props: EventProps) {
        this.inARow(1, props);
    }

    private inARow(n: number, props: EventProps) {
        for (let i = 0; i < n; i++) {
            if (!props.delay && props.delay !== 0) {
                props.delay = 3;
            }
            if (!props.offset && props.offset !== 0) {
                props.offset = 10;
            }
            this.storyBook.push(
                this.createEvent(props.ticks + i * props.delay, props.direction, props.pos + i * props.offset, props.v, props.plane)
            );
        }
    }

    private createEvent(ticks: number, direction: Direction, pos: number, v: number, plane: (def: PlaneDefinition) => EnemyPlane): Event {
        let x: number = 0, y: number = 0, vx: number = 0, vy: number = 0;
        switch (direction) {
            case Direction.DOWN:
                x = pos;
                y = 0;
                vx = 0;
                vy = v;
                break;
            case Direction.UP:
                x = pos;
                y = scene.screenHeight();
                vx = 0;
                vy = -v;
                break; 
            case Direction.LEFT:
                x = scene.screenWidth();
                y = pos;
                vx = -v;
                vy = 0;
                break;
            case Direction.RIGHT:
                x = 0;
                y = pos;
                vx = v;
                vy = 0;
                break; 
        }
        return {
            ticks,
            planeFactory: () => plane({
                direction, x, y, vx, vy
            })
        };
    }

    public play() {
        this.setup();
        let ticks = 0;
        game.onUpdateInterval(100, () => {
            ticks++;
            while (this.storyBook.length > 0 && this.storyBook[0].ticks <= ticks) {
                const event = this.storyBook.shift();
                event.planeFactory();
                if (this.storyBook.length == 0) {
                    setTimeout(function () {
                        game.over(true);
                    }, 10000);
                }
            }
        })
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// onStart
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

const player = new Player();
const powerUp = new PowereUp();
scene.setBackgroundColor(9);
info.setLife(5);
const storyBook = new StoryBook();
storyBook.play();

