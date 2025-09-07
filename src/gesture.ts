export type gesTypes = "rock" | "paper" | "scissor";

export class Gesture {
    private vel = new Vector(this.randomDirection()*1.5, this.randomDirection());
    private height: number;
    private width: number;
    constructor(
        private x: number,
        private y: number,
        private image: HTMLImageElement,
        private size: number,
        private type: gesTypes
    ) {
        this.height = this.size;
        this.width = this.size * image.width / image.height; // size adjusted for aspect ratio
    }

    public beats(gesture: Gesture): boolean {
        switch (this.type) {
            case "rock":
                return gesture.type === "scissor";
            case "paper":
                return gesture.type === "rock";
            case "scissor":
                return gesture.type === "paper";
        }
    };

    public drawGesture(x: number, y: number, c: CanvasRenderingContext2D) {
        c.drawImage(this.image, x, y, this.width, this.height);
    }

    public move(c: CanvasRenderingContext2D) {
        if (this.x + this.width > c.canvas.width || this.x <= 0) {
            this.vel.flipX();
        }

        if (this.y + this.height > c.canvas.height || this.y <= 0) {
            this.vel.flipY();
        }
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.drawGesture(this.x, this.y, c);
    }

    public checkCollision(gesture: Gesture) {
        const isColliding =
            this.x < gesture.x + this.width && // Check if this gesture's left side is to the left of the other gesture's right side
            this.x + this.width > gesture.x && // Check if this gesture's right side is to the right of the other gesture's left side
            this.y < gesture.y + this.height && // Check if this gesture's top side is above the other gesture's bottom side
            this.y + this.height > gesture.y; // Check if this gesture's bottom side is below the other gesture's top side

        return isColliding;
    }

    public surrender(gesture: Gesture) {
        this.image = gesture.image;
        this.type = gesture.type;
        this.size = gesture.size;
        this.height = gesture.height;
        this.width = gesture.width;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getType() {
        return this.type;
    }

    private randomDirection() {
        const sign = Math.random() < 0.5 ? -1 : 1;
        return sign * (Math.random() * 0.5 + 0.5);
    }
}

class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}

    public flipX(): void {
        this.x *= -1;
    }

    public flipY(): void {
        this.y *= -1;
    }
}