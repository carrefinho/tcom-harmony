let synth, secondSynth, thirdSynth;
let majorScale = [], minorScale = [], majorPentatonicScale = [], locrianMode = [];
let root, octave;

function setup(){
	let canvas = createCanvas(windowWidth, 400);
	canvas.position(windowWidth / 2 - width / 2, windowHeight - 400)
	canvas.parent("canvas-container");
	canvas.mousePressed(function(){
		let radioOption = document.querySelector('input[name="synth-radio"]:checked').value;
		switch (radioOption){
			case "para":
				paraellMotion();
				break;
			case "chrp":
				chordProgression();
				break;
			default:
				playNotes();
				break;
		}
	});

	synth = new Tone.Synth().toMaster();
	secondSynth = new Tone.Synth().toMaster();
	thirdSynth = new Tone.Synth().toMaster();

	majorScale = [0, 2, 4, 5, 7, 9, 11, 12];
	minorScale = [0, 2, 3, 5, 7, 8, 10, 12];
	majorPentatonicScale = [0, 2, 4, 8, 10, 12];
	locrianMode = [0, 1, 3, 5, 6, 8, 10, 12];

	root = 48;
	octave = 0;

	background("#303030");
	fill("#7a7a7a");
	textFont('pf_tempesta_fiveregular');
	textSize(12);
	text("click here to play", 128, 32);
}


function playNotes(){
	let currentScale = scaleOption();
	let noteToMidi = currentScale[floor(random(currentScale.length))] + root + octave * 12;
	let freq = Tone.Frequency(noteToMidi, "midi");
	synth.triggerAttackRelease(freq, 0.2);
	secondSynthPlay(noteToMidi);
}

function paraellMotion(){
	let currentScale = scaleOption();
	let originalLength = currentScale.length;
	for (let i = 1; i < originalLength; i++){
		currentScale.push(currentScale[originalLength - 1] + currentScale[i]);
	}

	let motionNotes = []
	let secondMotionNotes = []
	let rootIndex = floor(random(originalLength));

	for (let i = 0; i < 5; i++){
		let note1 = Tone.Frequency(currentScale[rootIndex + i] + root + octave * 12, "midi");
		let note2 = Tone.Frequency(currentScale[rootIndex + i] + root + octave * 12 - 12, "midi");
		motionNotes.push(note1);
		secondMotionNotes.push(note2);
	}
	for (let i = motionNotes.length - 1; i >= 2; i--){
		motionNotes.push(motionNotes[i]);
		secondMotionNotes.push(secondMotionNotes[i]);
	}

	Tone.Transport.start();
	let firstParaell = new Tone.Sequence(function(time, note){
		synth.triggerAttackRelease(note, 0.2);
	}, motionNotes, "8n");
	firstParaell.loop = 0;
	firstParaell.start();

	let secondParaell = new Tone.Sequence(function(time, note){
		secondSynth.triggerAttackRelease(note, 0.2);
	}, secondMotionNotes, "8n");
	secondParaell.loop = 0;
	secondParaell.start();
}

function chordProgression(){
	let currentScale = scaleOption();
	let originalLength = currentScale.length;

	for (let i = 1; i < originalLength * 2; i++){
		currentScale.push(currentScale[originalLength - 1] + currentScale[i]);
	}
	for (let i = 0; i < currentScale.length; i++){
		currentScale[i] += root + octave * 12;
	}

	let rootIndex = floor(random(5));

	let chords = [];
	for (let i = 0; i < 3; i ++){
		chords[i] = [];
		chords[i][0] = currentScale[rootIndex + i * 2];
		chords[i][1] = currentScale[rootIndex + 2 + i * 2];
		chords[i][2] = currentScale[rootIndex + 4 + i * 2];
		chords[i][3] = currentScale[rootIndex + 3 + i * 2];
	}

	for (let i = 0; i < 3; i++){
		for (let j = 0; j < 4; j++){
			let noteMidi = new Tone.Frequency(chords[i][j], "midi");
			chords[i][j] = noteMidi;
		}
	}

	Tone.Transport.start();
	let chordSeq1 = new Tone.Sequence(function(time, note){
		synth.triggerAttackRelease(note, 0.8);
	}, chords[0], "2n");
	chordSeq1.loop = 0;
	chordSeq1.start();

	let chordSeq2 = new Tone.Sequence(function(time, note){
		secondSynth.triggerAttackRelease(note, 0.8);
	}, chords[1], "2n");
	chordSeq2.loop = 0;
	chordSeq2.start();

	let chordSeq3 = new Tone.Sequence(function(time, note){
		thirdSynth.triggerAttackRelease(note, 0.8);
	}, chords[2], "2n");
	chordSeq3.loop = 0;
	chordSeq3.start();




}


function scaleOption(){
	let selectObj = document.getElementById("scale-select");
	switch (selectObj.options[selectObj.selectedIndex].value){
		case "majr":
			return majorScale.slice(0);
			break;
		case "minr":
			return minorScale.slice(0);
			break;
		case "mapt":
			return majorPentatonicScale.slice(0);
			break;
		case "locr":
			return locrianMode.slice(0);
			break;
	}
}

function secondSynthPlay(freq){
	let radioOption = document.querySelector('input[name="synth-radio"]:checked').value;
	let freq2;
	switch (radioOption){
		case "none":
			break;
		case "dron":
			freq2 = Tone.Frequency(root - 12, "midi");
			secondSynth.triggerAttackRelease(freq2, 0.4);
			break;
		case "cons":
			freq2 = Tone.Frequency(freq + 7, "midi");
			secondSynth.triggerAttackRelease(freq2, 0.2);
			break;
		case "diss":
			freq2 = Tone.Frequency(freq + 2, "midi");
			secondSynth.triggerAttackRelease(freq2, 0.2);
			break;
	}
}
