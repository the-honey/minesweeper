<script lang="ts">
	import { createMinesweeper } from '../lib/minesweeper.svelte';

	const minesweeper = createMinesweeper();

	$inspect(minesweeper.gameState);
</script>

<div class="space-y-12 h-full content-center">
	<div>
		{#if minesweeper}
			{#each minesweeper.board as row, rowIndex}
				<div class="flex justify-center">
					{#each row as cell, cellIndex}
						{#if cell.isRevealed}
							{#if cell.value === 9}
								<button
									onclick={() => minesweeper.revealField(cellIndex, rowIndex)}
									class="btn btn-error m-1 btn-square text-lg"
								>
									💣
								</button>
							{:else}
								<button
									onclick={() => minesweeper.revealField(cellIndex, rowIndex)}
									class="btn btn-accent m-1 btn-square text-lg"
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
