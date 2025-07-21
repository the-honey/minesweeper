import { browser } from '$app/environment';

type SavedGame = {
  width: number;
  height: number;
  minesCount: number;
  board: Field[][];
  timeElapsed: number;
  flagsCount: number;
  revealedCount: number;
  gameState: GameState;
  clickMode: boolean;
};

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
  isReserved: boolean;
};

export function createMinesweeper(width: number, height: number, mines: number) {
  let _width = $state(width);
  let _height = $state(height);
  let _minesCount = $state(mines);
  let _flagsCount = $state(0);

  let _board: Field[][] = $state(initBoard());
  let _revealedCount = $state(0);

  let _timeElapsed = $state(0);
  let _timer: ReturnType<typeof setInterval> | null;

  let _clickMode: boolean = $state(false);

  let _gameState: GameState = $state(GameState.Idle);
  $effect(() => {
    saveGame();
    if (_gameState === GameState.Playing && !_timer) {
      _timer = setInterval(() => {
        _timeElapsed++;
      }, 1000);
    } else if (_gameState !== GameState.Playing && _timer) {
      clearInterval(_timer);
      _timer = null;
    }
  });

  if (browser) {
    loadGame();
  } else {
    resetGame(_width, _height, _minesCount);
  }

  function loadGame() {
    const savedGame = localStorage.getItem('minesweeper');
    if (savedGame) {
      const game: SavedGame = JSON.parse(savedGame);
      _width = game.width;
      _height = game.height;
      _minesCount = game.minesCount;
      _timeElapsed = game.timeElapsed;
      _flagsCount = game.flagsCount;
      _revealedCount = game.revealedCount;
      _gameState = game.gameState;
      _board = game.board;
      _clickMode = game.clickMode;
    }
  }

  function saveGame() {
    const game: SavedGame = {
      width: _width,
      height: _height,
      minesCount: _minesCount,
      board: _board,
      timeElapsed: _timeElapsed,
      flagsCount: _flagsCount,
      revealedCount: _revealedCount,
      gameState: _gameState,
      clickMode: _clickMode
    };
    localStorage.setItem('minesweeper', JSON.stringify(game));
  }

  function initBoard() {
    return Array.from({ length: _height }, () =>
      Array.from(
        { length: _width },
        () => ({ value: 0, isRevealed: false, isFlagged: false, isReserved: false }) as Field
      )
    );
  }

  function placeMines() {
    for (let i = 0; i < _minesCount; i++) {
      const x = Math.floor(Math.random() * _width);
      const y = Math.floor(Math.random() * _height);
      if (_board[y][x].value === 9 || _board[y][x].isRevealed || _board[y][x].isReserved) {
        i--;
      } else {
        _board[y][x].value = 9;
      }
    }

    // calculate numbers
    for (let i = 0; i < _width; i++)
      for (let j = 0; j < _height; j++)
        if (_board[j][i].value === 9)
          for (let k = 0; k < 3; k++)
            for (let l = 0; l < 3; l++)
              if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height)
                if (_board[j + l - 1][i + k - 1].value !== 9) _board[j + l - 1][i + k - 1].value++;
  }

  function quickReveal(i: number, j: number) {
    if (
      i < 0 ||
      j < 0 ||
      i >= _width ||
      j >= _height ||
      (_gameState != GameState.Playing && _gameState != GameState.Idle)
    )
      return;

    let flags = 0;
    let isLost = false;
    for (let k = 0; k < 3; k++) {
      for (let l = 0; l < 3; l++) {
        if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height) {
          if (!_board[j + l - 1][i + k - 1].isFlagged && _board[j + l - 1][i + k - 1].value === 9) {
            isLost = true;
          }
          if (_board[j + l - 1][i + k - 1].isFlagged) {
            flags++;
          }
        }
      }
    }

    if (flags >= _board[j][i].value) {
      if (isLost) gameLost();
      else
        for (let k = 0; k < 3; k++)
          for (let l = 0; l < 3; l++)
            if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height)
              if (
                !_board[j + l - 1][i + k - 1].isRevealed &&
                !_board[j + l - 1][i + k - 1].isFlagged
              )
                revealField(i + k - 1, j + l - 1);
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

    _board[j][i].isRevealed = true;

    if (_revealedCount === 0) {
      _gameState = GameState.Playing;
      for (let k = 0; k < 3; k++)
        for (let l = 0; l < 3; l++)
          if (i + k - 1 >= 0 && i + k - 1 < _width && j + l - 1 >= 0 && j + l - 1 < _height)
            _board[j + l - 1][i + k - 1].isReserved = true;
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
      gameLost();
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

  function gameLost() {
    _gameState = GameState.Lost;
    // revealMines();
  }

  function onFieldClick(i: number, j: number) {
    if (_clickMode && !_board[j][i].isRevealed) {
      toggleFlag(i, j);
    } else if (_board[j][i].isRevealed && _board[j][i].value > 0) {
      quickReveal(i, j);
    } else {
      revealField(i, j);
    }
  }

  function onFieldPress(i: number, j: number) {
    if (_clickMode && !_board[j][i].isRevealed) {
      revealField(i, j);
    } else if (_board[j][i].isRevealed && _board[j][i].value > 0) {
      quickReveal(i, j);
    } else {
      toggleFlag(i, j);
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
    onFieldPress,
    onFieldClick,
    resetGame
  };
}
