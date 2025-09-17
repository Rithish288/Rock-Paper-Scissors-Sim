import type { Listener } from "./EventEmitter.js";
import type { gesTypes } from "./gesture.js";
import { RPSsimulator } from "./RPSsimulator.js";

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const status = document.getElementById('status') as HTMLDivElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const restartBtn = document.getElementById('restart') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel') as HTMLButtonElement;
const winText = document.getElementById('win-text') as HTMLHeadingElement;
const restartBanner = document.querySelector('.restart') as HTMLDivElement;

const imageSize = 30;
const numGestures = 30;

let listener: Listener<{
	prev: Record<gesTypes, number>, 
	next: Record<gesTypes, number>
}> | undefined = undefined;

const [rockImg, scissorImg, paperImg] = [new Image(), new Image(), new Image()];
rockImg.src = "assets/rock.svg";
scissorImg.src = "assets/scissor.svg";
paperImg.src = "assets/paper.svg";

function canvasSetup(canvas: HTMLCanvasElement) {
	canvas.width = window.innerWidth < 750 ? window.innerWidth * 0.9 : window.innerWidth*0.9 - 170;
	canvas.height = window.innerHeight*0.75;
}

function updateStatusCounts(currentCounts: Record<gesTypes, number>, newCounts: Record<gesTypes, number>) {
	const countStatus = Array.from(status.children).map(p => p.lastChild);
	countStatus.forEach(span => {
		if (span && (span as HTMLElement).id) {
			// safely access (span as HTMLElement).id
			const id = (span as HTMLElement).id;
			const type = id.split('-')[0] as gesTypes;
			const txtColor = newCounts[type] > currentCounts[type] ? 'green' : (newCounts[type] < currentCounts[type] ? 'red' : 'black');
			// update color and count
			
			(span as HTMLElement).style.color = txtColor;
			span.textContent = newCounts[type].toString()
		}
	})
	if(newCounts.rock == 0 || newCounts.paper == 0 || newCounts.scissor == 0) {
		let winner: gesTypes | null;
		if(newCounts.rock == 0 && newCounts.paper == 0) { // scissor wins
			winner = 'scissor';
		} else if(newCounts.paper == 0 && newCounts.scissor == 0) { // rock wins
			winner = 'rock';
		} else if(newCounts.scissor == 0 && newCounts.rock == 0) { // paper wins
			winner = 'paper';
		} else winner = null;

		if(winner != null) endGame(winner);
	}
}

function simulate(c: CanvasRenderingContext2D): void {
	const rps = new RPSsimulator(c, numGestures, {
		rock: rockImg,
		paper: paperImg,
		scissor: scissorImg,
	}, imageSize);

	if(listener != undefined) {
		rps.onCountCHange.unsubscribe(listener);
	}
	
	rps.placeGestures();

	rps.animate();

	rps.onCountCHange.subscribe(({prev, next}) => {
		updateStatusCounts(prev, next);
	});
}

function endGame(winner: gesTypes) {
	winText.textContent = `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`;
	restartBanner.style.display = 'revert';	
}

function cancelRestart() {
	restartBanner.style.display = 'none';
	startBtn.removeAttribute('disabled');
	startBtn.textContent = 'Restart';
}

function restartGame(c: CanvasRenderingContext2D) {
	restartBanner.style.display = 'none';
	simulate(c)
}

if(canvas != null) {
	canvasSetup(canvas);
	const c = canvas.getContext("2d") as CanvasRenderingContext2D;
	window.onresize = () => {
		canvasSetup(canvas);
	}

	let loadedCount = 0;

	function checkAllLoaded(): boolean {
		if (loadedCount == 3) {
			return true
		} else {
			loadedCount++;
			return false;
		}
	}

	if (startBtn) {
		startBtn.onclick = () => {
			if(checkAllLoaded()) simulate(c);
			startBtn.setAttribute('disabled', 'true')
		}
	}

	cancelBtn.onclick = cancelRestart;
	restartBtn.onclick = restartGame.bind(null, c);

	rockImg.onload = checkAllLoaded;
    scissorImg.onload = checkAllLoaded;
    paperImg.onload = checkAllLoaded;
}