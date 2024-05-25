<script lang="ts">
	import { GameState, createMinesweeper } from '../lib/minesweeper.svelte';
	import MineIcon from '~icons/mdi/mine';
	import FlagIcon from '~icons/mdi/flag';
	import ShovelIcon from '~icons/mdi/shovel';
	import SettingsIcon from '~icons/mdi/settings';
	import ResetIcon from '~icons/mdi/restart';

	import fireConfetti from '$lib/confetti';

	const INITIAL_WIDTH = 10;
	const INITIAL_HEIGHT = 16;
	const INITIAL_MINES = 20;

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
			onclick={() => {
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
					? '0' + (minesweeper.timeElapsed / 60).toFixed()
					: (minesweeper.timeElapsed / 60).toFixed()}</span
			>:<span
				>{Math.floor(minesweeper.timeElapsed % 60) < 10
					? '0' + (minesweeper.timeElapsed % 60).toFixed()
					: (minesweeper.timeElapsed % 60).toFixed()}</span
			>
		</span>

		<!-- <label class="swap">
			<input type="checkbox" bind:checked={minesweeper.clickMode} />
			<ShovelIcon class="swap-on w-12 h-12 fill-current" />
			<FlagIcon class="swap-off w-12 h-12 fill-current" />
		</label> -->

		<button
			onclick={() => {
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
			onclick={() =>
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
							onclick={() => minesweeper.onFieldClick(cellIndex, rowIndex)}
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
	<div class="space-y-3 modal-box">
		<h3 class="font-bold text-lg">Settings</h3>
		<p class="space-y-5">
			<input
				type="number"
				placeholder="Width"
				min="5"
				class="input input-bordered w-full"
				bind:value={newWidth}
			/>
			<input
				type="number"
				placeholder="Height"
				min="5"
				class="input input-bordered w-full"
				bind:value={newHeight}
			/>
			<input
				type="number"
				placeholder="Mines"
				min="1"
				class="input input-bordered w-full"
				bind:value={newMines}
			/>
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button
					onclick={() => minesweeper.resetGame(newWidth, newHeight, newMines)}
					class="btn btn-primary">Save</button
				>
				<button class="btn btn-error">Cancel</button>
			</form>
		</div>
	</div>
</dialog>
