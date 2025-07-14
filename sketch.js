let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 1280;

const BUTTON_W = CANVAS_W/4;
const BUTTON_H = BUTTON_W/2;
const BUTTON_Y = CANVAS_H*2/3;
const BUTTON_M = 24;

const GRID_SIZE = 64;
const GRID_W = 64;
const GRID_BASE_X = GRID_SIZE*1;
const GRID_BASE_Y = GRID_SIZE*2;
const ITEM_NUM = 20;
const ITEM_H = GRID_SIZE*8;
const ITEM_W = GRID_SIZE*13/ITEM_NUM;
const ITEM_INT_X = ITEM_W;
const ITEM_INT_Y = ITEM_H;
const ITEM_BASE_X = GRID_BASE_X;
const ITEM_BASE_Y = GRID_BASE_Y;
//const ITEM_ROW = 8;
const ITEM_COLOR = 160;
const ITEM_SEL_COLOR = 'lightgray';
const PLAYER_H = ITEM_H+8;
const PLAYER_W = ITEM_W+8;

let gui;
let upButton, downButton, leftButton, rightButton;
let getButton;
let startButton;
let startFlag = false;
let startTime;
let endTime = 0;
let player;
let items;
let itemImg;
let itemImgWidth, itemImgHeight;
let fileInput;

let timeCount;
const TEXT_VIEW_SIZE = 32;

const DEBUG = true;
const DEBUG_VIEW_X = 40;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}
function numShuffle(num) {
	const arr = [];
	for (let i=0; i<num; i++){
		arr[i] = i;
	}
	let m = arr.length;
	while (m) {
		const i = Math.floor(Math.random() * m);
		m--;
		[arr[m], arr[i]] = [arr[i], arr[m]];
	}
	return arr;
}
function playerMove(x, y){
	const tx = player.pos.x + x;
	const ty = player.pos.y + y;
	for (let i=0; i<ITEM_NUM; i++){
		if ((items[i].pos.x==tx) && (items[i].pos.y==ty)){
			player.pos.x = tx;
			player.pos.y = ty;
			return;
		}
	}
}
function upFn() {
	playerMove(0, -1);
}
function downFn() {
	playerMove(0, 1);
}
function leftFn() {
	playerMove(-1, 0);
}
function rightFn() {
	playerMove(1, 0);
}
function getFn() {
	if (player.getIndex==null){
		for (let i=0; i<items.length; i++){
			if ((player.pos.x==items[i].pos.x) && (player.pos.y==items[i].pos.y)){
				player.getIndex = i;
				break;
			}
		}
	}else{
		for (let i=0; i<items.length; i++){
			if ((player.pos.x==items[i].pos.x) && (player.pos.y==items[i].pos.y)){
				items[i].pos.x = items[player.getIndex].pos.x;
				items[player.getIndex].pos.x = player.pos.x;
				items[i].pos.y = items[player.getIndex].pos.y;
				items[player.getIndex].pos.y = player.pos.y;
				player.getIndex = null;
				break;
			}
		}
		for (let i=0; i<items.length; i++){
			if (items[i].pos.x!=i){
				return;
			}
		}
		startButton.visible = true;
		endTime = (millis() - startTime)/1000;
		startFlag = false;
	}
}
function startFn() {
	startFlag = true;
	startTime = millis();
	startButton.visible = false;
	player.getNum = 0;
	const numArr = numShuffle(ITEM_NUM);
	for (let i=0; i<ITEM_NUM; i++){
		items[i].pos.x = numArr[i];
//		items[i].pos.y = numArr[i]%ITEM_ROW;
	}
}
function handleFile(file) {
	if (file.type == 'image') {
		itemImg = loadImage(file.data);
	}else{
		itemImg = null;
	}
}
function setup() {
	createCanvas(CANVAS_W, CANVAS_H);
	time = millis();
	player = {};
	player.pos = {};
	player.pos.x = 0;
	player.pos.y = 0;
	items = [];
	rectMode(CENTER);
	fileInput = createFileInput(handleFile);

//	itemImg = loadImage('./sample_img.png');
	itemImg = loadImage('./DSCF9001.jpg');
	gui = createGui();
	gui.loadStyle("Seafoam");
	gui.setTextSize(48);
	getButton = buttonInit('SEL', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y+BUTTON_H+BUTTON_M);
	upButton = buttonInit('↑', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y);
	downButton = buttonInit('↓', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y+(BUTTON_H+BUTTON_M)*2);
	leftButton = buttonInit('←', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W*3)/2-BUTTON_M, BUTTON_Y+BUTTON_H+BUTTON_M);
	rightButton = buttonInit('→', BUTTON_W, BUTTON_H, (CANVAS_W+BUTTON_W)/2+BUTTON_M, BUTTON_Y+BUTTON_H+BUTTON_M);
	startButton = buttonInit('START', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y-BUTTON_H*1.5);
	items = [];
	for (let i=0; i<ITEM_NUM; i++){
		items[i] = {};
		items[i].pos = {};
		items[i].pos.x = i;
		items[i].pos.y = 0;
		items[i].enable = true;
	}
	textAlign(CENTER,CENTER);
}
function buttonInit(text, w, h, x, y) {
	let button = createButton(text, x, y, w, h);
	return button;
}
function draw() {
	background(48);
	let current = millis();
	if ( (current-time)>=1000 ){
		time += 1000;
		fps = frameCount - frameCountBuffer;
		frameCountBuffer = frameCount;
	}
	if (getButton.isPressed) getFn();
	if (upButton.isPressed) upFn();
	if (downButton.isPressed) downFn();
	if (leftButton.isPressed) leftFn();
	if (rightButton.isPressed) rightFn();
	if (startButton.isPressed) startFn();
	if (DEBUG){
		stroke(128);
		strokeWeight(1);
		for (let i=0; i<CANVAS_H/GRID_SIZE; i++){
			line(0, i*GRID_SIZE, CANVAS_W, i*GRID_SIZE);
		}
		for (let i=0; i<CANVAS_W/GRID_SIZE; i++){
			line(i*GRID_SIZE, 0, i*GRID_SIZE, CANVAS_H);
		}
	}
	let tx = 0;
	let ty = 0;
	strokeWeight(1);
	stroke(255);
	fill(255);
/*
	textSize(40);
	for (let i=0; i<ITEM_NUM; i++){
		text(i+1, GRID_BASE_X+ITEM_INT_X*tx, GRID_BASE_Y+ITEM_INT_Y*ty);
		ty++;
		if (ty>=ITEM_ROW){
			tx++;
			ty = 0;
		}
	}
*/
	itemImgWidth = itemImg.width/ITEM_NUM;
	itemImgHeight = itemImg.height;
	textSize(40);
	for (let i=0; i<items.length; i++){
		if (i!=player.getIndex){
			strokeWeight(0);
			stroke(255);
			fill(ITEM_COLOR-i*4);
//			rect(ITEM_BASE_X+ITEM_INT_X*items[i].pos.x+ITEM_W/2, ITEM_BASE_Y+ITEM_INT_Y*items[i].pos.y+ITEM_H/2, ITEM_W, ITEM_H);	
			image(itemImg, ITEM_BASE_X+ITEM_INT_X*items[i].pos.x, ITEM_BASE_Y+ITEM_INT_Y*items[i].pos.y, ITEM_W, ITEM_H,
				itemImgWidth*i, 0, itemImgWidth, itemImgHeight
			);
//			fill(255);
//			text(ITEM_ARRAY[i], ITEM_BASE_X+ITEM_INT_X*items[i].pos.x, ITEM_BASE_Y+ITEM_INT_Y*items[i].pos.y);
		}
		if (player.getIndex!=null){
			strokeWeight(0);
//			stroke('pink');
//			fill(ITEM_SEL_COLOR);
//			rect(ITEM_BASE_X+ITEM_INT_X*player.pos.x+ITEM_W/2, ITEM_BASE_Y+ITEM_INT_Y*player.pos.y+ITEM_H/2, ITEM_W, ITEM_H);
			image(itemImg, ITEM_BASE_X+ITEM_INT_X*player.pos.x, ITEM_BASE_Y+ITEM_INT_Y*player.pos.y, ITEM_W, ITEM_H,
				itemImgWidth*player.getIndex, 0, itemImgWidth, itemImgHeight
			);
//			fill(255);
//			strokeWeight(1);
//			text(ITEM_ARRAY[player.getIndex], ITEM_BASE_X+ITEM_INT_X*player.pos.x, ITEM_BASE_Y+ITEM_INT_Y*player.pos.y);
		}
	}
	stroke(255);
	strokeWeight(3);
	noFill();
	rect(ITEM_BASE_X+ITEM_INT_X*player.pos.x+ITEM_W/2, ITEM_BASE_Y+ITEM_INT_Y*player.pos.y+ITEM_H/2, PLAYER_W, PLAYER_H);

	if (startFlag==false){
		fill(255);
		stroke(255);
		textSize(64);
		textAlign(CENTER);
		text(endTime.toFixed(1)+' sec', CANVAS_W/2, GRID_SIZE*3);
	}
	drawGui();
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
}
