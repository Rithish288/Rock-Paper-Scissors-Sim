export abstract class Gesture {
    private dx = this.randomDirection() * 2;
    private dy = this.randomDirection() * 1.5;
    public abstract readonly type: typeof Rock | typeof Paper | typeof Scissor;
    constructor(
        private x: number,
        private y: number,
        private image: HTMLImageElement
    ) {}

    public abstract beats(gesture: Gesture): boolean;

    public drawGesture(x: number, y: number, c: CanvasRenderingContext2D) {
        c.drawImage(this.image, x, y, this.image.width, this.image.height);
    }

    public move(c: CanvasRenderingContext2D) {
        if (this.x + this.image.width > c.canvas!.width || this.x <= 0) {
            this.dx *= -1;
        }

        if (this.y + this.image.height > c.canvas!.height || this.y <= 0) {
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.drawGesture(this.x, this.y, c);
    }

    public checkCollision(gesture: Gesture) {
        const isColliding =
            this.x < gesture.x + this.image.width && // Check if this gesture's left side is to the left of the other gesture's right side
            this.x + this.image.width > gesture.x && // Check if this gesture's right side is to the right of the other gesture's left side
            this.y < gesture.y + this.image.height && // Check if this gesture's top side is above the other gesture's bottom side
            this.y + this.image.height > gesture.y; // Check if this gesture's bottom side is below the other gesture's top side

        return isColliding;
    }

    public getCoords() {
        return {x: this.x, y: this.y};
    }

    public getWidth() {
        return this.image.width;
    }

    public getHeight() {
        return this.image.height;
    }

    public reverseX() {
        this.changeDirection(-this.dx, this.dy);
    }

    public reverseY() {
        this.changeDirection(this.dx, -this.dy);
    }

    private changeDirection(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    }

    private randomDirection() {
        const sign = Math.random() < 0.5 ? -1 : 1;
        return sign * (Math.random() * 0.5 + 0.5);
    }
}

export class Rock extends Gesture {
    public readonly type = Rock;
    public beats(gesture: Gesture): boolean {
        return gesture instanceof Scissor;
    }
}

export class Paper extends Gesture {
    public readonly type = Paper;
    beats(gesture: Gesture): boolean {
        return gesture instanceof Rock;
    }
}

export class Scissor extends Gesture {
    public readonly type = Scissor;
    beats(gesture: Gesture): boolean {
        return gesture instanceof Paper;
    }
}
