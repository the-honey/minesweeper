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
	let _flagsCount = $state(0);

	let _board: Field[][] = $state(initBoard());
	let _revealedCount: number;

	let _timeElapsed = $state(0);
	let _timer: any;

	let _clickMode: boolean = $state(false);

	let _gameState: GameState = $state(GameState.Idle);
	$effect(() => {
		if (_gameState === GameState.Playing) {
			_timer = setInterval(() => {
				_timeElapsed++;
			}, 1000);
		} else {
			clearInterval(_timer);
		}
	});

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
			_board[j][i].isFlagged ||
			(_gameState != GameState.Playing && _gameState != GameState.Idle)
		)
			return;

		if (_board[j][i].isRevealed) {
			if (_board[j][i].value === 0) return;

			let flags = 0;
			for (let k = 0; k < 3; k++) {
				for (let l = 0; l < 3; l++) {
					if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height) {
						if (_board[j + l - 1][i + k - 1].isFlagged) {
							flags++;
						}
					}
				}
			}

			if (flags === _board[j][i].value) {
				for (let k = 0; k < 3; k++) {
					for (let l = 0; l < 3; l++) {
						if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height) {
							if (
								!_board[j + l - 1][i + k - 1].isRevealed &&
								!_board[j + l - 1][i + k - 1].isFlagged
							) {
								revealField(i + k - 1, j + l - 1);
							}
						}
					}
				}
			}

			return;
		}

		_board[j][i].isRevealed = true;

		if (_revealedCount === 0) {
			_gameState = GameState.Playing;
			placeMines();
		}

		if (_board[j][i].value === 0) {
			_revealedCount++;
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
		} else {
			_revealedCount++;
		}

		// check game over
		if (_revealedCount === _width * _height - _minesCount) {
			_gameState = GameState.Won;
		}
	}

	function resetGame(width: number, height: number, minesCount: number) {
		_width = width;
		_height = height;
		_minesCount = minesCount;
		_gameState = GameState.Idle;
		_revealedCount = 0;
		_timeElapsed = 0;
		_flagsCount = 0;
		_board = initBoard();
	}

	function toggleFlag(i: number, j: number) {
		if (
			i < 0 ||
			j < 0 ||
			i >= _width ||
			j >= _height ||
			_board[j][i].isRevealed ||
			(_gameState != GameState.Playing && _gameState != GameState.Idle)
		)
			return;

		if (_board[j][i].isFlagged) {
			_flagsCount--;
			_board[j][i].isFlagged = !_board[j][i].isFlagged;
		} else {
			if (_flagsCount < _minesCount) {
				_board[j][i].isFlagged = !_board[j][i].isFlagged;
				_flagsCount++;
			}
		}
	}

	function revealMines() {
		_board.forEach((row) => {
			row.forEach((field) => {
				if (field.value === 9) field.isRevealed = true;
			});
		});
	}

	function onFieldClick(i: number, j: number) {
		if (_clickMode && !_board[j][i].isRevealed) {
			toggleFlag(i, j);
		} else {
			revealField(i, j);
		}
	}

	return {
		get board() {
			return _board;
		},
		get clickMode() {
			return _clickMode;
		},
		set clickMode(value: boolean) {
			_clickMode = value;
		},
		get gameState() {
			return _gameState;
		},
		get width() {
			return _width;
		},
		get height() {
			return _height;
		},
		get timeElapsed() {
			return _timeElapsed;
		},
		get flagsCount() {
			return _flagsCount;
		},
		get minesCount() {
			return _minesCount;
		},
		onFieldClick,
		resetGame,
		toggleFlag
	};
}
