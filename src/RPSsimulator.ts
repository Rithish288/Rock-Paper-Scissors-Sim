import { Gesture, type gesTypes } from "./gesture.js";
import { EventEmitter } from "./EventEmitter.js";

export class RPSsimulator {
    private gestureArr: Gesture[] = [];
    private spriteCount: Record<gesTypes, number> = {
        rock: 0,
        paper: 0,
        scissor: 0
    };
    constructor(
        private c: CanvasRenderingContext2D,
        private numGestures: number,
        private images: {
            rock: HTMLImageElement;
            paper: HTMLImageElement;
            scissor: HTMLImageElement;
        },
        private imageDim: number
    ) {}
    
    public placeGestures() {
        for (let i = 0; i < this.numGestures; ++i) {
            this.addRandomGesture();
        }
        Object.seal(this.gestureArr);
        return this.spriteCount
    }
    
    public animate() {
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
        this.handleCollissions();
        for (const gesture of this.gestureArr) {
            gesture.move(this.c);
        }
        
        requestAnimationFrame(this.animate.bind(this));
    }

    public onCountCHange = new EventEmitter<Record<gesTypes, number>>();

    private updateSpriteCounts(winner: Gesture, loser: Gesture) {
        this.spriteCount[winner.getType()]++;
        this.spriteCount[loser.getType()]--;
        this.onCountCHange.emit(this.spriteCount);
    }
    
    private createGesture(
        type: gesTypes
    ): Gesture {
        const image = this.imageMapper(type);
        return new Gesture(
            Math.random() * (this.c.canvas.width - this.imageDim*image.width/image.height),
            Math.random() * (this.c.canvas.height - this.imageDim),
            image,
            30,
            type
        );
    }
    
    // Called in animate(), but commented off due to sprite jitter
    private handleCollissions() {
        for(let i = 0; i < this.gestureArr.length; ++i) {
            for(let j = i+1; j < this.gestureArr.length; ++j) {
                const g1 = this.gestureArr[i] as Gesture;
                const g2 = this.gestureArr[j] as Gesture;
                if(!g1.checkCollision(g2)) continue;
                if(g1.beats(g2)) {
                    this.updateSpriteCounts(g1, g2);
                    g2.surrender(g1);
                } else if(g2.beats(g1)) {
                    this.updateSpriteCounts(g2, g1);
                    g1.surrender(g2);
                }
            }
        }
    }

    private imageMapper(type: gesTypes) {
        switch (type) {
            case "rock":
                return this.images.rock;
            case "paper":
                return this.images.paper;
            case "scissor":
                return this.images.scissor;
            default:
                return this.images.rock;
        }
    }

    private addRandomGesture(): boolean {
        let placed = false;
        let iterations = 0;
        const choices = Object.keys(this.spriteCount);
        while (!placed) {
            // Pick and make an instance of a random gesture'
            const choice = choices[Math.floor(Math.random() * choices.length)] as gesTypes;
            const newGesture = this.createGesture(choice);

            // Check if the random gesture overlaps with any other existing gestures
            const overlap = this.gestureArr.some(gesture => 
                newGesture.checkCollision(gesture)
            );
            if (!overlap) {
                this.gestureArr.push(newGesture);
                this.spriteCount[choice]++;

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
