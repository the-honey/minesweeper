<script lang="ts">
	import { createMinesweeper } from '../lib/minesweeper.svelte';
	import MineIcon from '~icons/mdi/mine';
	import FlagIcon from '~icons/mdi/flag';
	import ShovelIcon from '~icons/mdi/shovel';
	import SettingsIcon from '~icons/mdi/settings';
	import ResetIcon from '~icons/pajamas/retry';

	let width = 10;
	let height = 10;
	let mines = 10;

	const minesweeper = createMinesweeper(width, height, mines);

	let settingsModal: HTMLDialogElement;
</script>

<div class="content-center h-full space-y-6 p-6">
	<div class="w-fit mx-auto flex items-center gap-12">
		<button onclick={() => settingsModal.showModal()} class="btn btn-ghost btn-circle">
			<SettingsIcon class="h-8 w-8 fill-current" />
		</button>
		<span class="font-mono text-4xl">
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

		<label class="swap">
			<input type="checkbox" bind:checked={minesweeper.clickMode} />
			<ShovelIcon class="swap-on w-12 h-12 fill-current" />
			<FlagIcon class="swap-off w-12 h-12 fill-current" />
		</label>
		<span class="text-4xl">{minesweeper.minesCount - minesweeper.flagsCount}</span>
		<button
			onclick={() => minesweeper.resetGame(width, height, mines)}
			class="btn btn-ghost btn-circle"
		>
			<ResetIcon class="h-8 w-8 fill-current" />
		</button>
	</div>
	<div>
		{#if minesweeper}
			{#each minesweeper.board as row, rowIndex}
				<div class="flex justify-center">
					{#each row as cell, cellIndex}
						{#if cell.isRevealed}
							{#if cell.value === 9}
								<button
									onclick={() => minesweeper.onFieldClick(cellIndex, rowIndex)}
									class="btn btn-info m-1 btn-square text-xl"
								>
									<MineIcon class="fill-current" />
								</button>
							{:else}
								<button
									onclick={() => minesweeper.onFieldClick(cellIndex, rowIndex)}
									class="btn btn-secondary m-1 btn-square text-xl"
								>
									{cell.value !== 0 ? cell.value : ''}
								</button>
							{/if}
						{:else if cell.isFlagged}
							<button
								onclick={() => minesweeper.onFieldClick(cellIndex, rowIndex)}
								class="btn btn-neutral m-1 btn-square text-xl"
							>
								<FlagIcon class="fill-current" />
							</button>
						{:else}
							<button
								onclick={() => minesweeper.onFieldClick(cellIndex, rowIndex)}
								class="btn btn-neutral m-1 btn-square text-lg"
							>
							</button>
						{/if}
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
		<p class="space-y-3">
			<input
				type="number"
				placeholder="Width"
				class="input input-bordered w-full max-w-xs"
				bind:value={width}
			/>
			<input
				type="number"
				placeholder="Height"
				class="input input-bordered w-full max-w-xs"
				bind:value={height}
			/>
			<input
				type="number"
				placeholder="Mines"
				class="input input-bordered w-full max-w-xs"
				bind:value={mines}
			/>
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Save</button>
				<button class="btn btn-error">Cancel</button>
			</form>
		</div>
	</div>
</dialog>
