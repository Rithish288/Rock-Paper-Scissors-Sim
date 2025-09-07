import type { gesTypes } from "./gesture.js";
import { RPSsimulator } from "./RPSsimulator.js";

const canvas = document.querySelector('canvas');
const status = document.getElementById('status');

const imageSize = 30;
const numGestures = 30;

const [rockImg, scissorImg, paperImg] = [new Image(), new Image(), new Image()];
rockImg.src = "assets/rock.svg";
scissorImg.src = "assets/scissor.svg";
paperImg.src = "assets/paper.svg";

function canvasSetup(canvas: HTMLCanvasElement) {
	canvas.width = window.innerWidth*0.8;
	canvas.height = window.innerHeight*0.75;
}


if(canvas != null) {
	canvasSetup(canvas);
	const c = canvas.getContext("2d") as CanvasRenderingContext2D;
	window.onresize = () => {
		canvasSetup(canvas);
	}

	let loadedCount = 0;

	function updateStatusCounts(newCounts: Record<gesTypes, number>) {
		const countStatus = Array.from(status?.children as HTMLCollection).map(p => p.lastChild);
		countStatus.forEach(span => {
			if (span && (span as HTMLElement).id) {
				// safely access (span as HTMLElement).id
				const id = (span as HTMLElement).id;
				const type = id.split('-')[0] as gesTypes;
				span.textContent = newCounts[type].toString()
			}
		})
	}

	function checkAllLoaded(): void {
		loadedCount++;
		if (loadedCount == 3) {
			simulate();
		};
	}

	function simulate(): void {
		const rps = new RPSsimulator(c, numGestures, {
            rock: rockImg,
            paper: paperImg,
            scissor: scissorImg,
        }, imageSize);

        const initialSprites = rps.placeGestures();

        rps.animate();

		rps.onCountCHange.subscribe(counts => {
			updateStatusCounts(counts);
		});
	}

	rockImg.onload = checkAllLoaded;
    scissorImg.onload = checkAllLoaded;
    paperImg.onload = checkAllLoaded;
}