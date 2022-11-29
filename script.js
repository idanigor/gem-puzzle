let gemSettings = {
	size: 4,
	arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	cellStyle: [],
	cellStyleNow: [],
	timer: {
		min: 0,
		sec: 0,
	},
	move: 0,
	sound: true,
	top: [],
}
let topGameList = []
let targetCard
let interval

if (localStorage.getItem('lastGame')) {
	gemSettings = getLocal()
}

const wrapperButton = document.createElement('div')
document.body.append(wrapperButton)
wrapperButton.innerHTML = `	<div class="button-wrapper">
		<div class="button" id="btn-restart">Restart</div>
		<div class="button" id="btn-start">Start</div>
		<div class="button" id="btn-sound">Sound</div>
	</div>
	<div class="section-wrapper">
		<div class="button" id="x3">3x3</div>
		<div class="button" id="x4">4x4</div>
		<div class="button" id="x5">5x5</div>
		<div class="button" id="x6">6x6</div>
		<div class="button" id="x7">7x7</div>
		<div class="button" id="x8">8x8</div>
	</div>
	<div class="title-wrapper"></div>`
document.querySelector(`#x${gemSettings.size}`).classList.add('active')
const wrapperTable = document.createElement('div')
document.body.append(wrapperTable)
wrapperTable.className = 'wrapper-table event-off'
const wrapperTimer = document.createElement('div')
document.body.append(wrapperTimer)
wrapperTimer.className = 'wrapper-timer'
wrapperTimer.innerHTML = `<div class="timer">Timer: <span id="min">00</span>:<span id="sec">00</span></div><div class="button top-game">Top game</div><div class="moves">Moves: <span id="move">0</span></div>`

const topWrapper = document.createElement('div')
document.body.append(topWrapper)
topWrapper.className = 'wrapper-top hide'
topWrapper.innerHTML = `<p class="top-label"><span>Date:</span><span>Time:</span><span>Moves:</span></p>`

const buttonWrapper = document.querySelector('.button-wrapper')
const sectionWrapper = document.querySelector('.section-wrapper')
const titleWrapper = document.querySelector('.title-wrapper')
const btnRestart = document.querySelector('#btn-restart')
const btnStart = document.querySelector('#btn-start')
const btnSound = document.querySelector('#btn-sound')
const min = document.querySelector('#min')
const sec = document.querySelector('#sec')
const move = document.querySelector('#move')
const btnTop = document.querySelector('.top-game')

if (gemSettings.sound) {
	btnSound.classList.add('active')
}
addTable(gemSettings.arr)
if (localStorage.getItem('localTop')) {
	topGameList = getLocalTop()
	setNodeTop()
}

wrapperTable.addEventListener('dragstart', dropStart)
wrapperTable.addEventListener('dragend', dropEnd)
wrapperTable.addEventListener('drop', dropDrag)
wrapperTable.addEventListener('click', clickMove)
sectionWrapper.addEventListener('click', getSize)
btnRestart.addEventListener('click', () => {
	localStorage.removeItem('lastGame')
	gemSettings.move = 0
	gemSettings.timer.min = 0
	gemSettings.timer.sec = 0
	randomClick()
})
btnSound.addEventListener('click', () => {
	if (gemSettings.sound) {
		gemSettings.sound = false
		btnSound.classList.remove('active')
	} else {
		gemSettings.sound = true
		btnSound.classList.add('active')
	}
})
btnStart.addEventListener('click', () => {
	if (document.querySelector('.win-title')) {
		btnRestart.click()
	}
	btnStart.classList.add('active')
	wrapperTable.classList.remove('event-off')
	clearInterval(interval)
	interval = setInterval(timerStart, 1000)
})
btnTop.addEventListener('click', () => {
	btnTop.classList.toggle('active')
	topWrapper.classList.toggle('hide')
})

if (localStorage.getItem('lastGame')) {
	addLocalTable()
	for (let i = 0; i < gemSettings.top.length; i++) {
		const obj = gemSettings.top[i]
		const div = document.createElement('div')
		div.className = 'top-element'
		div.innerHTML = `<span>${obj.date}</span><span>${obj.time}</span><span>${obj.move}</span>`
		topWrapper.append(div)
	}
} else {
	randomClick()
}

updateLocal()

function updateLocal() {
	setInterval(updateLocalGame, 1000)
}
function updateLocalGame() {
	if (btnStart.classList.contains('active')) {
		setLocalLastGame()
	}
}
function cellSize() {
	return Math.round((320 - (+gemSettings.size + 1) * 5) / +gemSettings.size)
}
function getLocal() {
	return JSON.parse(localStorage.getItem('lastGame'))
}
function getLocalTop() {
	return JSON.parse(localStorage.getItem('localTop'))
}
function setLocalLastGame() {
	localStorage.removeItem('lastGame')
	localStorage.setItem('lastGame', JSON.stringify(gemSettings))
}
function setLocalTop() {
	localStorage.setItem('localTop', JSON.stringify(topGameList))
}
function randomClick() {
	titleWrapper.innerHTML = ''
	btnStart.classList.remove('active')
	wrapperTable.classList.add('event-off')
	gemSettings.cellStyle = []
	const children = wrapperTable.childNodes
	for (let j = 0; j < children.length; j++) {
		gemSettings.cellStyle.push(children[j].style.top)
		gemSettings.cellStyle.push(children[j].style.left)
	}
	function getRandomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min)) + min
	}
	const node = wrapperTable.querySelectorAll('.cell')
	let minS = gemSettings.timer.min
	let secS = gemSettings.timer.sec
	let moveS = gemSettings.move
	for (let i = 0; i < 10000; i++) {
		node[getRandomInt(0, gemSettings.arr.length)].click()
	}
	gemSettings.move = moveS
	gemSettings.timer.min = minS
	gemSettings.timer.sec = secS
	move.innerText = gemSettings.move
	min.innerHTML = getMinSec()[0]
	sec.innerHTML = getMinSec()[1]
	clearInterval(interval)
}
function checkWin() {
	if (btnStart.classList.contains('active')) {
		const children = wrapperTable.childNodes
		let arr = []
		for (let j = 0; j < children.length; j++) {
			arr.push(children[j].style.top)
			arr.push(children[j].style.left)
		}
		gemSettings.cellStyleNow = arr
		if (
			JSON.stringify(gemSettings.cellStyleNow) ==
			JSON.stringify(gemSettings.cellStyle)
		) {
			winTitle()
			addTop()
		}
	}
}
function getMinSec() {
	let minT,
		secT = ''
	if (gemSettings.timer.min < 10) {
		minT = '0' + gemSettings.timer.min
	} else {
		minT = gemSettings.timer.min
	}
	if (gemSettings.timer.sec < 10) {
		secT = '0' + gemSettings.timer.sec
	} else {
		secT = gemSettings.timer.sec
	}
	return [`${minT}`, `${secT}`]
}
function winTitle() {
	btnStart.classList.remove('active')
	wrapperTable.classList.add('event-off')
	clearInterval(interval)
	titleWrapper.innerHTML = `<div class="win-title">Hooray! You solved the puzzle in ${
		getMinSec()[0]
	}:${getMinSec()[1]} and ${gemSettings.move} moves!
	</div>`
}
function addTop() {
	topWrapper.innerHTML = `<p class="top-label"><span>Date:</span><span>Time:</span><span>Moves:</span></p>`
	let obj = {}
	obj.date = new Date().toLocaleString()
	obj.time = `${getMinSec()[0]}:${getMinSec()[1]}`
	obj.move = gemSettings.move
	topGameList.push(obj)
	topGameList.sort((a, b) => (a.move > b.move ? 1 : -1))
	topGameList = topGameList.slice(0, 10)
	setNodeTop()
	setLocalTop()
}
function setNodeTop() {
	for (let i = 0; i < topGameList.length; i++) {
		createTopElement(
			topGameList[i].date,
			topGameList[i].time,
			topGameList[i].move
		)
	}
}
function createTopElement(date, time, moves) {
	const div = document.createElement('div')
	div.className = 'top-element'
	let tempMove = moves
	if (moves < 10) moves = '0' + moves
	div.innerHTML = `<span>${date}</span><span>${time}</span><span>${moves}</span>`
	moves = tempMove
	topWrapper.append(div)
}
function timerStart() {
	gemSettings.timer.sec++
	if (gemSettings.timer.sec < 10) {
		sec.innerText = '0' + gemSettings.timer.sec
	} else if (gemSettings.timer.sec < 60) {
		sec.innerText = gemSettings.timer.sec
	} else {
		gemSettings.timer.min++
		min.innerText = '0' + gemSettings.timer.min
		gemSettings.timer.sec = 0
		sec.innerText = '0' + gemSettings.timer.sec
	}
	if (gemSettings.timer.min >= 10) {
		min.innerText = gemSettings.timer.min
	}
	if (gemSettings.timer.min == 99) {
		clearInterval(interval)
	}
}
function getSize(event) {
	const target = event.target
	if (
		target.classList.contains('button') &&
		!target.classList.contains('active')
	) {
		gemSettings.move = 0
		gemSettings.timer.min = 0
		gemSettings.timer.sec = 0
		gemSettings.size = target.id.slice(1)
		getArray()
		addTable(gemSettings.arr)
		sectionWrapper.querySelector('.active').classList.remove('active')
		wrapperTable.classList.add('event-off')
		document.querySelector('#btn-start').classList.remove('active')
		target.classList.add('active')
	}
}
function getArray() {
	gemSettings.arr = []
	for (let i = 1; i < gemSettings.size * gemSettings.size; i++) {
		gemSettings.arr.push(i)
	}
}
function addTable(arr) {
	wrapperTable.innerHTML = ''
	for (let i = 0; i <= arr.length; i++) {
		const cell = document.createElement('div')
		cell.className = 'cell'
		cell.id = `cell-${i}`
		cell.draggable = true
		cell.style.width = `${cellSize()}px`
		cell.style.height = `${cellSize()}px`
		cell.innerHTML = arr[i]
		cell.style.left = `${(i % gemSettings.size) * (cellSize() + 5)}px`
		cell.style.top = `${
			((i - (i % gemSettings.size)) / gemSettings.size) * (cellSize() + 5)
		}px`
		wrapperTable.append(cell)
	}
	wrapperTable.lastChild.className = 'empty'
	wrapperTable.lastChild.id = 'empty'
	wrapperTable.lastChild.innerText = ''
	wrapperTable.lastChild.draggable = false
	randomClick()
}
function addLocalTable() {
	const children = wrapperTable.childNodes
	for (let i = 0; i < children.length; i++) {
		children[i].style.top = gemSettings.cellStyleNow[i * 2]
		children[i].style.left = gemSettings.cellStyleNow[i * 2 + 1]
	}
}
function dropStart(event) {
	document.querySelector('.empty').addEventListener('dragover', dropOver)
	targetCard = event.target
	setTimeout(() => {
		targetCard.classList.add('hide')
	}, 10)
}
function dropEnd(event) {
	const element = event.target
	setTimeout(() => {
		element.classList.remove('hide')
	}, 10)
}
function dropOver(event) {
	event.preventDefault()
}
function dropDrag() {
	const empty = document.querySelector('.empty')
	const leftDiff = Math.abs(
		parseInt(empty.style.left, 10) - parseInt(targetCard.style.left, 10)
	)
	const topDiff = Math.abs(
		parseInt(empty.style.top, 10) - parseInt(targetCard.style.top, 10)
	)
	if (leftDiff + topDiff <= cellSize() + 5) {
		;[targetCard.style.left, empty.style.left] = [
			empty.style.left,
			targetCard.style.left,
		]
		;[targetCard.style.top, empty.style.top] = [
			empty.style.top,
			targetCard.style.top,
		]
		gemSettings.move++
		move.innerText = gemSettings.move
		checkWin()
		playAudio()
	}
}
function clickMove(event) {
	if (event.target.classList.contains('cell')) {
		targetCard = event.target
		dropDrag()
	}
}
function playAudio() {
	if (gemSettings.sound && btnStart.classList.contains('active')) {
		const audio = new Audio('click.mp3')
		audio.play()
	}
}
