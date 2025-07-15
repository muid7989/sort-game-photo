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
const GRID_BASE_Y = GRID_SIZE*1;
const ITEM_NUM = 20;
const VIEW_H = GRID_SIZE*10;
const VIEW_W = GRID_SIZE*13;
const ITEM_BASE_X = GRID_BASE_X;
const ITEM_BASE_Y = GRID_BASE_Y;
let itemHeight = VIEW_H/ITEM_NUM;
let itemWidth = VIEW_W;
const ITEM_COLOR = 160;
const ITEM_SEL_COLOR = 'yellow';
let playerHeight = itemHeight+8;
let playerWidth = itemWidth+8;

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
			if (player.getIndex!=null){
				items[i].pos.x = items[player.getIndex].pos.x;
				items[i].pos.y = items[player.getIndex].pos.y;
				items[player.getIndex].pos.x = tx;
				items[player.getIndex].pos.y = ty;
			}
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
		player.getIndex = null;
		for (let i=0; i<items.length; i++){
			if (items[i].pos.y!=i){
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
		items[i].pos.y = numArr[i];
	}
}
function handleFile(file) {
	if (file.type == 'image') {
		itemImg = loadImage(file.data);
		startButton.visible = true;
		endTime = 0;
		startFlag = false;
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
//	fileInput.size(100,100);
	fileInput.style('font-size', '32px');

	itemImg = loadImage('./sample_img.png');
	getButton = buttonInit('SEL', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y+BUTTON_H+BUTTON_M);
	upButton = buttonInit('↑', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y);
	downButton = buttonInit('↓', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y+(BUTTON_H+BUTTON_M)*2);
	leftButton = buttonInit('←', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W*3)/2-BUTTON_M, BUTTON_Y+BUTTON_H+BUTTON_M);
	rightButton = buttonInit('→', BUTTON_W, BUTTON_H, (CANVAS_W+BUTTON_W)/2+BUTTON_M, BUTTON_Y+BUTTON_H+BUTTON_M);
	startButton = buttonInit('START', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y-BUTTON_H*1.5);
	getButton.mousePressed(getFn);
	upButton.mousePressed(upFn);
	downButton.mousePressed(downFn);
	leftButton.mousePressed(leftFn);
	rightButton.mousePressed(rightFn);
	startButton.mousePressed(startFn);
	items = [];
	for (let i=0; i<ITEM_NUM; i++){
		items[i] = {};
		items[i].pos = {};
		items[i].pos.x = 0;
		items[i].pos.y = i;
		items[i].enable = true;
	}
	textAlign(CENTER,CENTER);
}
function buttonInit(text, w, h, x, y) {
	let button = createButton(text);
	button.size(w,h);
	button.position(x,y);
	button.style('font-size', '32px');
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
/*
	if (getButton.isPressed) getFn();
	if (upButton.isPressed) upFn();
	if (downButton.isPressed) downFn();
	if (leftButton.isPressed) leftFn();
	if (rightButton.isPressed) rightFn();
	if (startButton.isPressed) startFn();
*/
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
	itemWidth = VIEW_W;
	itemHeight = VIEW_W*itemImg.height/itemImg.width/ITEM_NUM;
	itemImgHeight = itemImg.height/ITEM_NUM;
	itemImgWidth = itemImg.width;
	if (itemImg.height>(itemImg.width*VIEW_H/VIEW_W)){
		itemHeight = VIEW_H/ITEM_NUM;
		itemWidth = VIEW_H*itemImg.width/itemImg.height;
	}
	playerWidth = itemWidth+8;
	playerHeight = itemHeight+8;
	textSize(40);
	for (let i=0; i<items.length; i++){
		if (i!=player.getIndex){
			strokeWeight(0);
			image(itemImg, (CANVAS_W-itemWidth)/2, ITEM_BASE_Y+itemHeight*items[i].pos.y, itemWidth, itemHeight,
				0, itemImgHeight*i, itemImgWidth, itemImgHeight
			);
		}
		if (player.getIndex!=null){
			strokeWeight(4);
			stroke(ITEM_SEL_COLOR);
			noFill();
			rect(CANVAS_W/2, ITEM_BASE_Y+itemHeight*player.pos.y+itemHeight/2, itemWidth, itemHeight);
			image(itemImg, (CANVAS_W-itemWidth)/2, ITEM_BASE_Y+itemHeight*player.pos.y, itemWidth, itemHeight,
				0, itemImgHeight*player.getIndex, itemImgWidth, itemImgHeight
			);
		}
	}
	stroke(255);
	strokeWeight(3);
	noFill();
	rect(CANVAS_W/2, ITEM_BASE_Y+itemHeight*player.pos.y+itemHeight/2, playerWidth, playerHeight);

	if (startFlag==false){
		fill(255);
		stroke(255);
		textSize(64);
		textAlign(CENTER);
		text(endTime.toFixed(1)+' sec', CANVAS_W/2, GRID_SIZE*3);
	}
//	drawGui();
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
}
function touchMoved() {
	return false;
}