namespace SpriteKind {
    export const Powerup = SpriteKind.create()
    export const BombPowerup = SpriteKind.create()
    export const LifePowerup = SpriteKind.create()
    export const EnemyProjectile = SpriteKind.create()
}

enum Direction { UP, LEFT, DOWN, RIGHT };

function rotate(image: Image, direction: Direction): Image {
    switch (direction) {
        case Direction.UP: return image;
        case Direction.DOWN: return image.rotated(180);
        case Direction.LEFT: return image.rotated(270);
        case Direction.RIGHT: return image.rotated(90);
    }
}

interface Enemy {
    destroy(): void;
    getSprite(): Sprite;
    getScore(): number;
    gotHitBy(projectile?: Sprite): void;
    getMovement(): Movement;
}

interface Movement {
    direction: Direction;
    pos: number;
    v: number;
}

abstract class BaseEnemy  {
    protected readonly sprite: Sprite;
    protected remainingHits: number = 1;
    protected hits: number = 1;
    protected movement: Movement;


    constructor(image: Image, mov: Movement, hits: number = 1) {
        this.sprite = sprites.create(image, SpriteKind.Enemy);
        this.sprite.setFlag(SpriteFlag.AutoDestroy, true);
        this.movement = mov;
        this.remainingHits = hits;
        this.hits = hits;

        let x: number, y: number, vx: number, vy: number;
        switch (mov.direction) {
            case Direction.DOWN:
                x = mov.pos;
                y = 0;
                vx = 0;
                vy = mov.v;
                break;
            case Direction.UP:
                x = mov.pos;
                y = scene.screenHeight();
                vx = 0;
                vy = -mov.v;
                break;
            case Direction.LEFT:
                x = scene.screenWidth();
                y = mov.pos;
                vx = -mov.v;
                vy = 0;
                break;
            case Direction.RIGHT:
                x = 0;
                y = mov.pos;
                vx = mov.v;
                vy = 0;
                break;
        }

        this.sprite.setPosition(x, y)
        this.sprite.setVelocity(vx, vy)
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

    public getMovement(): Movement {
        return this.movement;
    }
    
    public gotHitBy(projectile: Sprite): void {
        if (projectile.kind() === SpriteKind.BombPowerup) {
            this.remainingHits = Math.max(this.remainingHits - 11, 0);
        } else {
            this.remainingHits -= 1;
        }

        if (this.remainingHits == 0) {
            this.sprite.destroy(effects.fire, 100);
            info.changeScoreBy(this.getScore())
            music.playSound("C4:1");
        } else if (this.remainingHits < this.hits / 2) {
            this.sprite.startEffect(effects.fire);
        }

        if (projectile.kind() === SpriteKind.Projectile) {
            projectile.destroy();
        }
    }
}

abstract class Ship extends BaseEnemy {
    constructor(image: Image, mov: Movement, hits: number = 6) {
        super(image, mov, hits);
        this.sprite.z = 0;
    }
}

class GreenPlane extends BaseEnemy implements Enemy {
    private static readonly image: Image = img`
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
    `;

    constructor(mov: Movement) {
        super(rotate(GreenPlane.image, mov.direction), mov);
    }
}

class RedPlane extends BaseEnemy implements Enemy {
    private static readonly image: Image = img`
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
    `;

    constructor(mov: Movement) {
        super(rotate(RedPlane.image, mov.direction), mov);
    }
}

class GrayPlane extends BaseEnemy implements Enemy {
    private static readonly projectileImage: Image = img`
        d f d
        f 2 f
        d f d
    `;
    
    private static readonly image: Image = img`
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
    `;

    constructor(mov: Movement) {
        super(rotate(GrayPlane.image, mov.direction), mov);
        this.shoot();
    }

    private shoot(): void {
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

    public getScore(): number {
        return 20;
    }
}

class BigPlane extends BaseEnemy implements Enemy {
    private static readonly projectileImage: Image = img`
        5 2 5
        2 4 2
        5 2 5
    `;
    private static readonly image: Image = img`
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
    `;

    private readonly interval: number;

    constructor(mov: Movement) {
        super(rotate(BigPlane.image, mov.direction), mov, 3);
        this.shoot();
        this.interval = setInterval(() => {
            this.shoot();
        }, 1200);
    }

    private shoot(): void {
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

class BomberPlane extends BaseEnemy implements Enemy {
    private static readonly projectileImage: Image = img`
        5 2 5
        2 4 2
        5 2 5
    `;
    private static readonly image: Image = img`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . 2 2 . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . 2 d d 2 . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d 2 2 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . 2 d d 2 . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . 6 2 2 6 . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d d d . . . . . . . . . . . . . . . . . . . . . .
        . . . . c 6 6 6 6 b . . . c 6 6 6 6 b . . . d 8 8 d . . . c 6 6 6 6 b . . . c 6 6 6 6 b . . . .
        . . . . . . d d . . . . . . . d d . . . . . d 8 8 d . . . . . d d . . . . . . . d d . . . . . .
        . . . . . . d d . . . . . . . d d . . . . . d d d d . . . . . d d . . . . . . . d d . . . . . .
        . d d d d d d d d d d d d d d d d d d d d d d 8 8 d d d d d d d d d d d d d d d d d d d d d b .
        d d d d d 4 4 d d d 4 4 d d d 4 4 d d d d d 8 d d 8 d d d d d 4 4 d d d 4 4 d d d 4 4 d d d d b
        d d d d d 4 4 d d d 4 4 d d d 4 4 d d d d d d d d d d d d d d 4 4 d d d 4 4 d d d 4 4 d d d d b
        d d d d d d d d 6 d d d d 6 d d d d d d d d d d d d d d d d d d d d 6 d d d d 6 d d d d d d d b
        . 3 3 3 3 3 3 d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d b b b b b b .
        . . . . . . . 3 3 3 3 3 d d d d d d d d d d d d d d d d d d d d d d d d b b b b b . . . . . . .
        . . . . . . . . . . . . 3 3 3 3 3 d d d d d d d d d d d d d d b b b b b . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . 3 3 3 3 d d d d d d b b b b . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . 3 d d d d b . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . d d 6 d . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . d d d d d c d d d b . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . d d d 4 d d d c d d 4 d d b . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . d d d d d d c d d b b b . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . 2 2 . . . . . . . . . . . . . . . . . . . . . . .
    `;

    private readonly interval: number;

    constructor(mov: Movement) {
        super(rotate(BomberPlane.image, mov.direction), mov, 20);
        this.shoot();
        this.interval = setInterval(() => {
            this.shoot();
        }, 800);
    }

    public shoot(): void {
        let projectile = sprites.createProjectileFromSprite(BomberPlane.projectileImage, this.sprite, 0, 100);
        projectile.setKind(SpriteKind.EnemyProjectile);

        projectile = sprites.createProjectileFromSprite(BomberPlane.projectileImage, this.sprite, -50, 87);
        projectile.setKind(SpriteKind.EnemyProjectile);
        
        projectile = sprites.createProjectileFromSprite(BomberPlane.projectileImage, this.sprite, 50, 87);
        projectile.setKind(SpriteKind.EnemyProjectile);
    }

    public destroy() {
        clearInterval(this.interval);
    }

    public getScore(): number {
        return 100;
    }
}

class SmallShip extends Ship implements Enemy {
    private readonly interval: number;
    private static readonly projectileImage: Image = img`
        5 4 5
        4 f 4
        5 4 5
    `;
    private static readonly image: Image = img`
        . . . . . . . c c c . . . . . .
        . . . . . . c 6 6 6 c . . . . .
        . . . . . . c 6 6 6 c . . . . .
        . . . . . c c 6 6 6 c c . . . .
        . . . . . c 6 6 6 6 6 c . . . .
        . . . . . c 6 8 8 8 6 c . . . .
        . . . . . c 6 b b b 6 c . . . .
        . . . . . c 6 b f b 6 c . . . .
        . . . . . c 6 b f b 6 c . . . .
        . . . . . c 6 b b b 6 c . . . .
        . . . . . c 6 e e e 6 c . . . .
        . . . . . c 6 e e e 6 c . . . .
        . . . . . c 6 6 6 6 6 c . . . .
        . . . . . c c c c c c c . . . .
        . . . . . . 1 . 1 . 1 . . . . .
        . . . . . 1 . 1 . 1 . 1 . . . .
    `;

    constructor(mov: Movement) {
        super(rotate(SmallShip.image, mov.direction), mov);
        this.interval = setInterval(() => {
            this.shoot();
        }, 3000);
    }

    private shoot(): void {
        const dx: number = player.getSprite().x - this.sprite.x;
        const dy: number = player.getSprite().y - this.sprite.y;
        const a = Math.atan(dy/dx);

        const v = 30;
        const vx = v * Math.cos(a) * Math.sign(dx);
        const vy = v * Math.sin(a) * Math.sign(dx);
        const projectile = sprites.createProjectileFromSprite(SmallShip.projectileImage, this.sprite, vx, vy)
        projectile.setKind(SpriteKind.EnemyProjectile)
    }

    public destroy() {
        clearInterval(this.interval);
    }

    public getScore() {
        return 20;
    }
}


function isShip(toBeDetermined: Enemy): toBeDetermined is Ship {
    return toBeDetermined instanceof Ship;
}

class Enemies {
    private static planes: Enemy[] = [];

    private static register<T extends Enemy>(plane: T): T {
        Enemies.planes.push(plane);
        plane.getSprite().onDestroyed(() => {
            
            plane.destroy();
            Enemies.planes = Enemies.planes.filter(
                p => p.getSprite().id !== plane.getSprite().id
            );
            
        });

        return plane;
    }

    public static fromSprite(sprite: Sprite): Enemy {
        return Enemies.planes.find(p => p.getSprite().id === sprite.id);
    }

    public static redPlane = (mov: Movement) => Enemies.register(new RedPlane(mov));
    public static greenPlane = (mov: Movement) => Enemies.register(new GreenPlane(mov));
    public static grayPlane = (mov: Movement) => Enemies.register(new GrayPlane(mov));
    public static bigPlane = (mov: Movement) => Enemies.register(new BigPlane(mov));
    public static bomberPlane = (mov: Movement) => Enemies.register(new BomberPlane(mov));
    public static smallShip = (mov: Movement) => Enemies.register(new SmallShip(mov));

    public static destroyAll(sprite: Sprite): void {
        Enemies.planes.forEach((enemy: Enemy) => {
            enemy.gotHitBy(sprite);
        });
        sprites.allOfKind(SpriteKind.EnemyProjectile).forEach((projectile: Sprite) => {
            projectile.destroy();
        });
    }
}

class Player {
    private static readonly maxLifes = 50;
    private hits = 0
    private bombs = 2;
    private weaponLevel = 1
    private readonly sprite: Sprite;
    private readonly bombSprites: Sprite[];
    private static readonly bombImage: Image = img`
        . . 6 6 6 . . f
        . 6 6 6 6 6 f .
        6 6 6 6 6 6 f f
        . 6 6 6 6 b f .
        . . b b b . . f
    `;
    private static readonly projectileImg = img`
        1
        1
    `;
    private static readonly planeLeft = img`
        . . . . . 4 . . . . . . . . . .
        . . 4 . . 4 . . 4 . . . . . . .
        . 9 9 9 4 8 e 9 9 9 . . . . . .
        . . 4 . 4 8 e . 4 . . . . . . .
        4 4 4 4 4 4 4 4 4 4 e . . . . .
        4 e e e e 4 b b b b e . . . . .
        6 4 4 4 4 4 4 4 4 4 6 . . . . .
        . . 4 e . . . 4 e . . . . . . .
        . . 4 e . . . 4 e . . . . . . .
        . . 4 e . . . 4 e . . . . . . .
        . 4 4 4 . . . 4 4 e . . . . . .
        . 3 4 2 e e e 2 4 3 . . . . . .
        4 4 4 4 4 4 4 4 4 4 e . . . . .
        . . 4 e . . . 4 e . . . . . . .
    `;
    private static readonly planeStraight = img`
        . . . . . . . 4 4 . . . . . . .
        . . . 4 . . . 4 4 . . . 4 . . .
        . . 6 6 6 . 4 8 8 e . 6 6 6 . .
        . . . 4 . . 4 8 8 e . . 4 . . .
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 e e e e e e b b b b b b 4 e
        . 6 4 4 4 4 4 4 4 4 4 4 4 4 6 .
        . . . 4 e . . . . . . 4 e . . .
        . . . 4 e . . . . . . 4 e . . .
        . . . 4 e . . . . . . 4 e . . .
        . . 4 4 4 e . . . . 4 4 4 e . .
        . . 3 4 2 3 e e e e 3 2 4 3 . .
        d 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
        . . . 4 e . . . . . . 4 e . . .
    `;
    private static readonly planeRight = img`
        . . . . . . . . . . 4 . . . . .
        . . . . . . . 4 . . 4 . . 4 . .
        . . . . . . 9 9 9 4 8 e 9 9 9 .
        . . . . . . . 4 . 4 8 e . 4 . .
        . . . . . 3 4 4 4 4 4 4 4 4 4 4
        . . . . . 3 e e e e 4 b b b b e
        . . . . . 6 4 4 4 4 4 4 4 4 4 6
        . . . . . . . 4 e . . . 4 e . .
        . . . . . . . 4 e . . . 4 e . .
        . . . . . . . 4 e . . . 4 e . .
        . . . . . . 4 4 4 . . . 4 4 e .
        . . . . . . 3 4 2 e e e 2 4 3 .
        . . . . . 3 4 4 4 4 4 4 4 4 4 4
        . . . . . . . 4 e . . . 4 e . .
    `;

    constructor() {
        info.setLife(Player.maxLifes);

        this.sprite = sprites.create(Player.planeStraight, SpriteKind.Player)
        this.sprite.y = 110;
        this.sprite.z = 20;

        controller.moveSprite(this.sprite);
        this.sprite.setFlag(SpriteFlag.StayInScreen, true);

        const bomb1 = sprites.create(Player.bombImage, SpriteKind.BombPowerup);
        const bomb2 = sprites.create(Player.bombImage, SpriteKind.BombPowerup);
        const bomb3 = sprites.create(Player.bombImage, SpriteKind.BombPowerup);

        bomb1.setFlag(SpriteFlag.RelativeToCamera, false);
        bomb2.setFlag(SpriteFlag.RelativeToCamera, false);
        bomb3.setFlag(SpriteFlag.RelativeToCamera, false);
        bomb1.setFlag(SpriteFlag.Ghost | SpriteFlag.Invisible, true);
        bomb2.setFlag(SpriteFlag.Ghost | SpriteFlag.Invisible, true);
        bomb3.setFlag(SpriteFlag.Ghost | SpriteFlag.Invisible, true);

        bomb1.setPosition(5, scene.screenHeight() - 5);
        bomb2.setPosition(14, scene.screenHeight() - 5);
        bomb3.setPosition(23, scene.screenHeight() - 5);

        this.bombSprites = [bomb1, bomb2, bomb3];
        
        this.drawBombs();

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (this.bombs > 0) {
                this.bombs -= 1;
                this.sprite.startEffect(effects.halo, 2000);
                scene.cameraShake(10, 2000);
                Enemies.destroyAll(bomb1);
                this.drawBombs();
            }
        });

        controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
            this.shoot();
        });

        game.onUpdateInterval(250, function () {
            if (controller.B.isPressed()) {
                this.shoot();
            }
            if (controller.left.isPressed()) {
                this.sprite.setImage(Player.planeLeft);
            } else if (controller.right.isPressed()) {
                this.sprite.setImage(Player.planeRight);
            } else {
                this.sprite.setImage(Player.planeStraight);
            }
        });

        sprites.onOverlap(SpriteKind.EnemyProjectile, SpriteKind.Player, function (enemyProjectile, playerSprite) {
            this.gotHit(playerSprite, enemyProjectile)
        });

        sprites.onOverlap(SpriteKind.Powerup, SpriteKind.Player, function (powerUpSprite, playerSprite) {
            this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
            powerUp.caught();
        });

        sprites.onOverlap(SpriteKind.BombPowerup, SpriteKind.Player, function (powerUpSprite, playerSprite) {
            this.bombs = Math.min(this.bombs + 1, 3);
            this.drawBombs();
            bombPowerUp.caught();
        });
        sprites.onOverlap(SpriteKind.LifePowerup, SpriteKind.Player, function (lifeUpSprite, playerSprite) {
            info.setLife(Math.min(info.life() + 1, Player.maxLifes));
            lifePowerUp.caught();
        });

        sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (enemySprite, playerSprite) {
            const enemy = Enemies.fromSprite(enemySprite);
            if (isShip(enemy)) {
                // no collision with a ship
                return;
            }
            this.gotHit(playerSprite, undefined);
            scene.cameraShake(3, 500);
            enemy.gotHitBy(playerSprite);
            const pushedBy: number = 30;
            switch (enemy.getMovement().direction) {
                case Direction.DOWN:
                    playerSprite.y += pushedBy;
                    break;
                case Direction.UP:
                    playerSprite.y -= pushedBy;
                    break;
                case Direction.LEFT:
                    playerSprite.x -= pushedBy;
                    break;
                case Direction.RIGHT:
                    playerSprite.x += pushedBy;
                    break;
            }            
        });
    }

    private drawBombs() {
        this.bombSprites.forEach((sprite: Sprite, index: number) => {
            sprite.setFlag(SpriteFlag.Invisible, this.bombs < index + 1);
        });
    }

    public getSprite(): Sprite {
        return this.sprite;
    }

    public shoot() {
        if (this.weaponLevel >= 1) {
            sprites.createProjectileFromSprite(Player.projectileImg, this.sprite, 0, -100)
        }
        if (this.weaponLevel >= 2) {
            sprites.createProjectileFromSprite(Player.projectileImg, this.sprite, -50, -87)
            sprites.createProjectileFromSprite(Player.projectileImg, this.sprite, 50, -87)
        }
        if (this.weaponLevel >= 3) {
            sprites.createProjectileFromSprite(Player.projectileImg, this.sprite, -87, -50)
            sprites.createProjectileFromSprite(Player.projectileImg, this.sprite, 87, -50)
        }
    }

    public gotHit(player: Sprite, otherSprite?: Sprite) {
        if (this.weaponLevel > 1) {
            this.weaponLevel -= 1;
            music.playSound("G5:1 C5:1");
        } else {
            info.changeLifeBy(-1)
            music.playSound("G5:1 E5:1 C5:2");
        }
        player.startEffect(effects.spray, 200)
        if (otherSprite) {
            otherSprite.destroy(effects.fire, 100)
        }
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (projectile, enemiesprite) {
    const plane = Enemies.fromSprite(enemiesprite);
    if (plane) {
        plane.gotHitBy(projectile);
    }
})


game.onUpdateInterval(5000, function () {
    if (Math.percentChance(10)) {
        const island = sprites.create(img`
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . b d b d . . . . d b . . . . . . . . .
            . . . . . . . . . . . d d d d d d b d d b d d d d . . . . . . .
            . . . . . . . b d b d b d d d d d d d d d d d d b . . . . . . .
            . . . . . . d d d d 7 6 7 6 7 7 d d d d d d d d d b . . . . . .
            . . . . . b d d 7 7 7 7 6 7 7 7 7 d d d d d d d d d d . . . . .
            . . . . b d d 7 7 7 6 7 7 7 6 7 7 7 d d d d 7 7 7 d d b . . . .
            . . . . d d 7 7 7 6 6 7 e 7 7 7 6 7 d d d d 7 7 7 7 d d d . . .
            . . . . d d 7 7 6 7 7 7 7 6 7 6 7 7 7 d d d 7 a 7 a d d d d . .
            . . . b d d 7 7 e 7 5 6 7 7 7 7 7 d d d d d 7 7 a 7 7 7 d d . .
            . . b d d d 7 7 5 6 7 4 7 6 6 8 8 8 8 d d d d 7 7 7 7 7 7 b . .
            . . d d 7 7 7 e 7 7 6 7 7 7 8 9 8 9 8 8 d d d 7 7 7 7 7 7 d . .
            . . b d 7 7 7 7 7 7 7 6 7 7 8 8 9 8 9 8 8 d d 7 5 7 7 7 7 d . .
            . . b d 7 7 7 6 7 6 7 7 7 7 8 9 8 9 8 9 8 d d 7 7 a 7 a d d . .
            . . d d 7 7 7 7 7 7 7 7 7 d d 8 8 8 8 8 d d d 7 5 7 a 7 d b . .
            . . b d 7 7 7 7 7 7 7 7 d d d d d d d d d d d 7 7 7 7 7 d d . .
            . . . d d d d d d d d d 2 2 d d d 2 2 d d d d 7 7 a 7 a d d . .
            . . . b d d d d d d d 2 2 2 d d 2 2 2 d d d d 7 7 7 a 7 d b . .
            . . . b d d 7 7 7 7 7 2 2 d d d 2 2 d d d d d 7 7 a 7 a d d . .
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
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 d d d d 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        . . . 1 1 1 1 1 1 1 1 1 1 d 1 1 1 1 d 1 1 1 1 1 1 1 1 1 1 1 1 1
        . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 d 1 1 1 1
        . . . 1 1 1 d 1 1 1 1 1 d 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
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
    constructor(img: Image, spriteKind: number, interval: number, chance: number) {
        this.sprite = sprites.create(img, spriteKind);
        this.hide();
        this.sprite.z = 10;

        game.onUpdateInterval(interval, function () {
            if (game.runtime() > 5000 && Math.percentChance(chance)) {
                this.sprite.setPosition(Math.randomRange(10, scene.screenWidth() - 10), Math.randomRange(10, scene.screenHeight() - 10))
                this.show();
                setTimeout(function () {
                    this.hide();
                }, 2000)
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
    planeFactory(): Enemy;
}

interface EventProps {
    ticks: number;
    v: number;
    delay?: number,
    pos: number,
    offset?: number,
    direction: Direction;
    plane: (mov: Movement) => Enemy
}

class StoryBook {
    private storyBook: Event[];

    private setup() {
        this.storyBook = [];
        let ticks = 0;
        for (let i = 0; i < 1; i++) {

            this.single({ ticks: ticks += 10, v: 40, pos: 10, direction: Direction.LEFT, plane: Enemies.greenPlane});
            this.single({ ticks: ticks += 10, v: 40, pos: 30, direction: Direction.RIGHT, plane: Enemies.greenPlane });
            this.single({ ticks: ticks += 20, v: 60, pos: 70, direction: Direction.RIGHT, plane: Enemies.redPlane});
            this.single({ ticks: ticks, v: 60, pos: 90, direction: Direction.LEFT, plane: Enemies.redPlane });
            this.single({ ticks: ticks += 50, v: 80, pos: 30, direction: Direction.LEFT, plane: Enemies.grayPlane});
            this.single({ ticks: ticks += 20, v: 30, pos: 60, direction: Direction.DOWN, plane: Enemies.bigPlane});

            this.inARow(3, { ticks: ticks += 30, v: 50, pos: 50, direction: Direction.LEFT, plane: Enemies.greenPlane});
            this.inARow(4, { ticks: ticks += 30, delay: 2, v: 80, pos: 10, offset: 10, direction: Direction.RIGHT, plane: Enemies.redPlane});
            this.inARow(3, { ticks: ticks += 30, delay: 4, v: 30, pos: 40, offset: 20, direction: Direction.DOWN, plane: Enemies.bigPlane});
            this.inARow(2, { ticks: ticks += 30, delay: 4, v: 30, pos: 40, offset: 0, direction: Direction.DOWN, plane: Enemies.greenPlane });

            this.single({ ticks: ticks += 30, v: 5, pos: 50, direction: Direction.DOWN, plane: Enemies.smallShip });
            this.single({ ticks: ticks += 10, v: 5, pos: 100, direction: Direction.DOWN, plane: Enemies.smallShip });

            this.single({ ticks: ticks += 80, v: 60, pos: scene.screenHeight() / 2, direction: Direction.LEFT, plane: Enemies.redPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenHeight() / 2, direction: Direction.RIGHT, plane: Enemies.redPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: Enemies.redPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: Enemies.redPlane });

            this.inARow(6, { ticks: ticks += 30, v: 15, delay: 0, pos: 10, offset: 27, direction: Direction.DOWN, plane: Enemies.greenPlane });
            this.inARow(6, { ticks: ticks += 10, v: 30, delay: 0, pos: 10, offset: 27, direction: Direction.DOWN, plane: Enemies.redPlane });
            this.inARow(6, { ticks: ticks += 10, v: 80, delay: 0, pos: 10, offset: 27, direction: Direction.DOWN, plane: Enemies.grayPlane });

            this.single({ ticks: ticks += 30, v: 15, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: Enemies.bomberPlane });

            this.single({ ticks: ticks += 100, v: 20, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: Enemies.bomberPlane });

            this.single({ ticks: ticks += 50, v: 20, pos: scene.screenHeight() / 2, direction: Direction.LEFT, plane: Enemies.greenPlane });
            this.single({ ticks: ticks, v: 20, pos: scene.screenHeight() / 2, direction: Direction.RIGHT, plane: Enemies.greenPlane });
            this.single({ ticks: ticks, v: 20, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: Enemies.greenPlane });
            this.single({ ticks: ticks, v: 20, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: Enemies.greenPlane });

            this.single({ ticks: ticks += 30, v: 60, pos: scene.screenHeight() / 2, direction: Direction.LEFT, plane: Enemies.grayPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenHeight() / 2, direction: Direction.RIGHT, plane: Enemies.grayPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenWidth() / 2, direction: Direction.DOWN, plane: Enemies.grayPlane });
            this.single({ ticks: ticks, v: 60, pos: scene.screenWidth() / 2, direction: Direction.UP, plane: Enemies.grayPlane });

            this.single({ ticks: ticks += 30, v: 5, pos: 50, direction: Direction.UP, plane: Enemies.smallShip });
            this.single({ ticks: ticks += 10, v: 5, pos: 100, direction: Direction.UP, plane: Enemies.smallShip });

            this.inARow(2, { ticks: ticks += 80, v: 50, pos: 50, direction: Direction.LEFT, plane: Enemies.greenPlane });
            this.inARow(2, { ticks: ticks += 20, v: 50, pos: 50, direction: Direction.RIGHT, plane: Enemies.redPlane });

            this.inARow(3, { ticks: ticks += 30, delay: 4, v: 30, pos: 40, offset: 30, direction: Direction.LEFT, plane: Enemies.grayPlane });
            this.inARow(3, { ticks: ticks, delay: 4, v: 30, pos: 25, offset: 30, direction: Direction.RIGHT, plane: Enemies.grayPlane });

            this.inARow(3, { ticks: ticks += 30, v: 10, pos: 60, offset: 20, direction: Direction.UP, plane: Enemies.bigPlane });
            this.inARow(3, { ticks: ticks += 30, v: 10, pos: 60, offset: 20, direction: Direction.UP, plane: Enemies.bigPlane });

            this.inARow(3, { ticks: ticks += 50, v: 10, delay: 0, pos: 20, offset: 30, direction: Direction.LEFT, plane: Enemies.smallShip });
            this.inARow(3, { ticks: ticks, v: 10, delay: 0, pos: 30, offset: 30, direction: Direction.RIGHT, plane: Enemies.smallShip });

            this.inARow(2, { ticks: ticks += 120, v: 10, delay: 25, pos: 50, offset: 70, direction: Direction.DOWN, plane: Enemies.bomberPlane });

            this.inARow(3, { ticks: ticks += 200, v: 10, delay: 0, pos: 25, offset: 54, direction: Direction.DOWN, plane: Enemies.bomberPlane });

            this.inARow(2, { ticks: ticks += 50, v: 70, delay: 0, pos: 50, offset: 60, direction: Direction.DOWN, plane: Enemies.grayPlane });
            this.single({ ticks: ticks += 7, v: 70, delay: 0, pos: scene.screenWidth() / 2, offset: 0, direction: Direction.DOWN, plane: Enemies.grayPlane });
            this.inARow(2, { ticks: ticks += 7, v: 70, delay: 0, pos: 50, offset: 60, direction: Direction.DOWN, plane: Enemies.grayPlane });

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

    private createEvent(ticks: number, direction: Direction, pos: number, v: number, plane: (mov: Movement) => Enemy): Event {
        return {
            ticks,
            planeFactory: () => plane({
                direction, pos, v
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

scene.setBackgroundColor(9);
const player = new Player();

const powerUp = new PowereUp(img`
    . . . . . . . .
    . . 7 7 7 7 7 .
    . 7 7 1 1 1 7 7
    . 7 7 1 7 1 7 7
    . 7 7 1 1 1 7 7
    . 7 7 1 7 7 7 7
    . 7 7 1 7 7 7 7
    . . 7 7 7 7 7 .
`, SpriteKind.Powerup, 3000, 50);
const bombPowerUp = new PowereUp(img`
    . 6 6 6 6 . . c
    6 6 6 6 6 6 c .
    . b b b b . . c
`, SpriteKind.BombPowerup, 10000, 50);
const lifePowerUp = new PowereUp(img`
    . 2 2 . . 2 2 .
    2 2 2 2 2 2 3 2
    2 2 2 2 2 3 2 2
    c 2 2 2 2 2 2 2
    . c 2 2 2 2 2 .
    . . c 2 2 2 . .
    . . . c 2 . . .
`, SpriteKind.LifePowerup, 10000, 40);

const storyBook = new StoryBook();
storyBook.play();

