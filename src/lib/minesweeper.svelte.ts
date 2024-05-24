import type { get } from 'svelte/store';

export enum GameState {
	Idle,
	Playing,
	Won,
	Lost
}

type Field = {
	value: number;
	isRevealed: boolean;
	isFlagged: boolean;
};

export function createMinesweeper(width: number, height: number, mines: number) {
	let _width = $state(width);
	let _height = $state(height);
	let _minesCount = $state(mines);

	let _board: Field[][] = $state(initBoard());
	let _revealedCount: number;
	let _clickCount: number;

	let _startTime: Date;
	let _endTime: Date;

	let _gameState: GameState = $state(GameState.Idle);

	resetGame(_width, _height, _minesCount);

	function initBoard() {
		return Array.from({ length: _height }, () =>
			Array.from(
				{ length: _width },
				() => ({ value: 0, isRevealed: false, isFlagged: false }) as Field
			)
		);
	}

	function placeMines() {
		for (let i = 0; i < _minesCount; i++) {
			let x = Math.floor(Math.random() * _width);
			let y = Math.floor(Math.random() * _height);
			if (_board[y][x].value === 9 || _board[y][x].isRevealed) {
				i--;
			} else {
				_board[y][x].value = 9;
			}
		}

		// calculate numbers
		for (let i = 0; i < _width; i++) {
			for (let j = 0; j < _height; j++) {
				if (_board[j][i].value === 9) {
					for (let k = 0; k < 3; k++) {
						for (let l = 0; l < 3; l++) {
							if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height) {
								if (_board[j + l - 1][i + k - 1].value !== 9) {
									_board[j + l - 1][i + k - 1].value++;
								}
							}
						}
					}
				}
			}
		}
	}

	function revealField(i: number, j: number) {
		if (
			i < 0 ||
			j < 0 ||
			i >= _width ||
			j >= _height ||
			_board[j][i].isRevealed ||
			_board[j][i].isFlagged ||
			(_gameState != GameState.Playing && _gameState != GameState.Idle)
		)
			return;

		_revealedCount++;
		_board[j][i].isRevealed = true;

		if (_revealedCount === 1) {
			_startTime = new Date();
			_gameState = GameState.Playing;
			placeMines();
		}

		if (_board[j][i].value === 0) {
			revealField(i - 1, j);
			revealField(i + 1, j);
			revealField(i, j - 1);
			revealField(i, j + 1);
			revealField(i + 1, j + 1);
			revealField(i - 1, j - 1);
			revealField(i - 1, j + 1);
			revealField(i + 1, j - 1);
		} else if (_board[j][i].value === 9) {
			_gameState = GameState.Lost;
			revealMines();
			_endTime = new Date();
		}

		// check game over
		if (_revealedCount === _width * _height - _minesCount) {
			_gameState = GameState.Won;
			_endTime = new Date();
		}
	}

	function resetGame(width: number, height: number, minesCount: number) {
		_width = width;
		_height = height;
		_minesCount = minesCount;
		_gameState = GameState.Idle;
		_revealedCount = 0;
		_board = initBoard();
		console.log(_board);
	}

	function toggleFlag(i: number, j: number) {
		_board[j][i].isFlagged = !_board[j][i].isFlagged;
	}

	function revealMines() {
		_board.forEach((row) => {
			row.forEach((field) => {
				if (field.value === 9) field.isRevealed = true;
			});
		});
	}

	return {
		get board() {
			return _board;
		},
		get gameState() {
			return _gameState;
		},
		get startTime() {
			return _startTime;
		},
		get endTime() {
			return _endTime;
		},
		revealField,
		resetGame,
		toggleFlag
	};
}
