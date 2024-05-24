<script lang="ts">
	import { createMinesweeper } from '../lib/minesweeper.svelte';

	let width = 10;
	let height = 10;
	let mines = 10;

	const minesweeper = createMinesweeper(width, height, mines);

	let settingsModal: HTMLDialogElement;
</script>

<div class="content-center h-full">
	<div class="flex">
		<button onclick={() => settingsModal.showModal()} class="btn btn-primary">Settings</button>

		<button onclick={() => minesweeper.resetGame(width, height, mines)} class="btn btn-warning"
			>Reset</button
		>
	</div>
	<div>
		{#if minesweeper}
			{#each minesweeper.board as row, rowIndex}
				<div class="flex justify-center">
					{#each row as cell, cellIndex}
						{#if cell.isRevealed}
							{#if cell.value === 9}
								<button
									onclick={() => minesweeper.revealField(cellIndex, rowIndex)}
									class="btn btn-info m-1 btn-square text-lg"
								>
									💣
								</button>
							{:else}
								<button
									onclick={() => minesweeper.revealField(cellIndex, rowIndex)}
									class="btn btn-secondary m-1 btn-square text-lg"
								>
									{cell.value !== 0 ? cell.value : ''}
								</button>
							{/if}
						{:else if cell.isFlagged}
							<button
								onclick={() => minesweeper.revealField(cellIndex, rowIndex)}
								class="btn btn-neutral m-1 btn-square text-lg"
							>
								🚩
							</button>
						{:else}
							<button
								onclick={() => minesweeper.revealField(cellIndex, rowIndex)}
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
