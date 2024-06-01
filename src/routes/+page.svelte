<script lang="ts">
	import { GameState, createMinesweeper } from '../lib/minesweeper.svelte';
	import MineIcon from '~icons/mdi/mine';
	import FlagIcon from '~icons/mdi/flag';
	import ShovelIcon from '~icons/mdi/shovel';
	import SettingsIcon from '~icons/mdi/settings';
	import ResetIcon from '~icons/mdi/restart';
	import HeightIcon from '~icons/material-symbols/height';
	import WidthIcon from '~icons/material-symbols/width';
	import { press } from 'svelte-gestures';

	import fireConfetti from '$lib/confetti';

	const INITIAL_WIDTH = 10;
	const INITIAL_HEIGHT = 16;
	const INITIAL_MINES = 20;

	const MAX_WIDTH = 100;
	const MIN_WIDTH = 5;
	const MAX_HEIGHT = 100;
	const MIN_HEIGHT = 5;

	let newWidth = $state(0);
	let newHeight = $state(0);
	let newMines = $state(0);

	const minesweeper = createMinesweeper(INITIAL_WIDTH, INITIAL_HEIGHT, INITIAL_MINES);

	let settingsModal: HTMLDialogElement;

	$effect(() => {
		if (minesweeper.gameState === GameState.Won) {
			fireConfetti();
		}
	});
</script>

<div class="h-fit space-y-6 p-3 w-fit mx-auto">
	<div class="mx-auto max-w-fit space-x-3 lg:space-x-6 justify-between flex items-center">
		<button
			on:click={() => {
				newWidth = minesweeper.width;
				newHeight = minesweeper.height;
				newMines = minesweeper.minesCount;
				settingsModal.showModal();
			}}
			class="btn btn-ghost btn-circle"
		>
			<SettingsIcon class="h-8 w-8 fill-current" />
		</button>
		<span
			class="font-mono text-4xl"
			class:text-success={minesweeper.gameState === GameState.Won}
			class:text-error={minesweeper.gameState === GameState.Lost}
		>
			<span
				>{Math.floor(minesweeper.timeElapsed / 60) < 10
					? '0' + Math.floor(minesweeper.timeElapsed / 60).toString()
					: Math.floor(minesweeper.timeElapsed / 60).toString()}</span
			>:<span
				>{Math.floor(minesweeper.timeElapsed % 60) < 10
					? '0' + Math.floor(minesweeper.timeElapsed % 60).toString()
					: Math.floor(minesweeper.timeElapsed % 60).toString()}</span
			>
		</span>

		<button
			on:click={() => {
				minesweeper.clickMode = !minesweeper.clickMode;
			}}
			class="btn btn-ghost btn-circle"
		>
			{#if minesweeper.clickMode}
				<ShovelIcon class="w-10 h-10 fill-current" />
			{:else}
				<FlagIcon class="w-10 h-10 fill-current" />
			{/if}
		</button>

		<span class="text-4xl">{minesweeper.minesCount - minesweeper.flagsCount}</span>
		<button
			on:click={() =>
				minesweeper.resetGame(minesweeper.width, minesweeper.height, minesweeper.minesCount)}
			class="btn btn-ghost btn-circle"
		>
			<ResetIcon class="h-10 w-10 fill-current" />
		</button>
	</div>
	<div class="mx-auto">
		{#if minesweeper}
			{#each minesweeper.board as row, rowIndex}
				<div class="flex justify-center">
					{#each row as cell, cellIndex}
						<button
							use:press={{ timeframe: 300, triggerBeforeFinished: true }}
							on:press={() => minesweeper.toggleFlag(cellIndex, rowIndex)}
							on:click={() => minesweeper.onFieldClick(cellIndex, rowIndex)}
							class="btn lg:btn-md btn-sm m-0.5 btn-square text-lg lg:text-2xl"
							class:btn-info={minesweeper.gameState === GameState.Lost &&
								!cell.isRevealed &&
								cell.value === 9}
							class:btn-warning={minesweeper.gameState === GameState.Lost &&
								cell.isRevealed &&
								cell.value === 9}
							class:btn-secondary={cell.isRevealed && cell.value !== 9}
							class:btn-neutral={!cell.isRevealed || cell.isFlagged}
							class:btn-success={minesweeper.gameState === GameState.Lost &&
								cell.value === 9 &&
								cell.isFlagged}
						>
							{#if minesweeper.gameState === GameState.Lost && cell.value === 9}
								<MineIcon class="fill-current" />
							{:else if cell.isRevealed}
								{cell.value !== 0 ? cell.value : ''}
							{:else if cell.isFlagged}
								<FlagIcon class="lg:text-3xl sm:text-xl fill-current" />
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>

<!-- settings modal -->
<dialog bind:this={settingsModal} class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-6">Settings</h3>

		<div class="space-y-3">
			<label class="form-control w-full">
				<div
					class="input input-bordered flex items-center gap-2"
					class:input-error={newWidth > MAX_WIDTH || newWidth < MIN_WIDTH}
				>
					<WidthIcon />
					Width
					<input type="number" class="grow" bind:value={newWidth} />
				</div>
				<!-- <div class="label">
					<span
						class="label-text-alt text-error"
						class:invisible={!(newWidth > MAX_WIDTH || newWidth < MIN_WIDTH)}
					>
						Width must be between {MIN_WIDTH} and {MAX_WIDTH}
					</span>
				</div> -->
			</label>

			<label class="form-control w-full">
				<div
					class="input input-bordered flex items-center gap-2"
					class:input-error={newHeight > MAX_HEIGHT || newHeight < MIN_HEIGHT}
				>
					<HeightIcon />
					Height
					<input type="number" class="grow" bind:value={newHeight} />
				</div>
				<!-- <div class="label">
					<span
						class="label-text-alt text-error"
						class:invisible={!(newHeight > MAX_HEIGHT || newHeight < MIN_HEIGHT)}
					>
						Height must be between {MIN_HEIGHT} and {MAX_HEIGHT}
					</span>
				</div> -->
			</label>

			<label class="form-control w-full">
				<div
					class="input input-bordered flex items-center gap-2"
					class:input-error={newWidth * newHeight < newMines + 1}
				>
					<MineIcon />
					Mines
					<input type="number" class="grow" bind:value={newMines} />
				</div>
				<!-- <div class="label">
					<span
						class="label-text-alt text-error"
						class:invisible={!(newWidth * newHeight < newMines + 1)}
					>
						Mines count must be less than width * height
					</span>
				</div> -->
			</label>
		</div>
		<div class="modal-action">
			<form method="dialog">
				<button
					on:click={() => {
						minesweeper.resetGame(newWidth, newHeight, newMines);
					}}
					class="btn btn-primary"
					disabled={newWidth * newHeight < newMines + 1 ||
						newWidth > MAX_WIDTH ||
						newWidth < MIN_WIDTH ||
						newHeight > MAX_HEIGHT ||
						newHeight < MIN_HEIGHT}>Save</button
				>
				<button class="btn btn-error">Cancel</button>
			</form>
		</div>
	</div>
</dialog>
