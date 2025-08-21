import { Gesture, Paper, Rock, Scissor } from "./gesture.js";

export class RPSsimulator {
    private readonly gestureArr: Gesture[] = [];
    constructor(
        private c: CanvasRenderingContext2D,
        private numGestures: number,
        private images: {
            rock: HTMLImageElement;
            paper: HTMLImageElement;
            scissor: HTMLImageElement;
        }
    ) {}

    public placeGestures() {
        for (let i = 0; i < this.numGestures; ++i) {
            this.addRandomGesture();
        }
        Object.seal(this.gestureArr);
    }

    public animate() {
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
        //Collisions are turned off temporarily due to sprite jitter
        // this.handleCollissions();
        for (const gesture of this.gestureArr) {
            gesture.move(this.c);
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    private createGesture(
        type: typeof Rock | typeof Paper | typeof Scissor
    ): Gesture {
        const image = this.imageMapper(type);
        return new type(
            Math.random() * (this.c.canvas.width - image.width),
            Math.random() * (this.c.canvas.height - image.height),
            image
        );
    }

    private handleCollissions() {
        for(let i = 0; i < this.gestureArr.length; ++i) {
            for(let j = i+1; j < this.gestureArr.length; ++j) {
                const g1 = this.gestureArr[i] as Gesture;
                const g2 = this.gestureArr[j] as Gesture;
                if(!g1.checkCollision(g2)) continue;

                const dx = (g1.getCoords().x + g1.getWidth()/2) - (g2.getCoords().x + g2.getWidth()/2);
                const dy = (g1.getCoords().y + g1.getHeight()/2) - (g2.getCoords().y + g2.getHeight()/2);
                
                if(Math.abs(dx) > Math.abs(dy)) {
                    this.gestureArr[i]?.reverseX();
                    this.gestureArr[j]?.reverseX();
                } else {
                    this.gestureArr[i]?.reverseY();
                    this.gestureArr[j]?.reverseY();
                }
            }
        }
    }

    private imageMapper(
        gesture: typeof Rock | typeof Paper | typeof Scissor
    ): HTMLImageElement {
        switch (gesture) {
            case Rock:
                return this.images.rock;
            case Paper:
                return this.images.paper;
            case Scissor:
                return this.images.scissor;
            default:
                return this.images.rock;
        }
    }

    private addRandomGesture(): boolean {
        let placed = false;
        let iterations = 0;
        const choices = [Rock, Paper, Scissor];
        while (!placed) {
            // Pick and make an instance of a random gesture
            const choice = choices[
                Math.floor(Math.random() * choices.length)
            ] as typeof Rock | typeof Paper | typeof Scissor;
            const newGesture = this.createGesture(choice);

            // Check if the random gesture overlaps with any other existing gestures
            const overlap = this.gestureArr.some((gesture) =>
                newGesture.checkCollision(gesture)
            );
            if (!overlap) {
                this.gestureArr.push(newGesture);
                placed = true;
            }

            // Stop making new gestures as there may not be free space in the canvas
            iterations++;
            if (iterations > 100) {
                throw new Error(
                    "ERROR: Could not place gesture due to multiple overlaps"
                );
            }
        }
        return true;
    }
}
