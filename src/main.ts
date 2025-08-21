import { RPSsimulator } from "./RPSsimulator.js";

const canvas = document.querySelector('canvas');

const imageDim = 30;

const [rockImg, scissorImg, paperImg] = [new Image(), new Image(), new Image()];
rockImg.src = "assets/rock.svg";
scissorImg.src = "assets/scissor.svg";
paperImg.src = "assets/paper.svg";

// rockImg.width = rockImg.height = imageDim;
// scissorImg.width = scissorImg.height = imageDim;
// paperImg.width = paperImg.height = imageDim;


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
	const numGestures = 30;

	function checkAllLoaded() {
		loadedCount++;
		if (loadedCount == 3) {
			const rps = new RPSsimulator(c, numGestures, {rock: rockImg, paper: paperImg, scissor: scissorImg});
			rps.placeGestures();
			rps.animate();
		};
	}

	rockImg.onload = checkAllLoaded;
    scissorImg.onload = checkAllLoaded;
    paperImg.onload = checkAllLoaded;
}