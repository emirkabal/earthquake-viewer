<script>
import { createEventDispatcher } from 'svelte'
import IconNext from './icons/next.svelte'
import IconPrevious from './icons/previous.svelte'
import generateNavigationOptions from '../functions/generateNavigationOptions'
import {
  PREVIOUS_PAGE,
  NEXT_PAGE,
  ELLIPSIS
} from '../functions/symbolTypes'

const dispatch = createEventDispatcher()

export let totalItems = 0
export let pageSize = 1
export let currentPage = 1
export let limit = null
export let showStepOptions = false

$: options = generateNavigationOptions({
  totalItems,
  pageSize,
  currentPage,
  limit,
  showStepOptions
})

$: totalPages = Math.ceil(totalItems / pageSize)

const handleOptionClick = (option) => {
  dispatch('setPage', { page: option.value })
}
</script>

<div class="pagination">
  {#each options as option}
    <span
      class="option"
      class:number="{option.type === 'number'}"
      class:prev="{option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}"
      class:next="{option.type === 'symbol' && option.symbol === NEXT_PAGE}"
      class:ellipsis="{option.type === 'symbol' && option.symbol === ELLIPSIS}"
      class:active="{option.type === 'number' && option.value === currentPage 
      || (option.type === 'symbol' && option.symbol === NEXT_PAGE && currentPage >= totalPages) 
      || (option.type === 'symbol' && option.symbol === PREVIOUS_PAGE && currentPage <= 1)}"
      on:click="{() => handleOptionClick(option)}"
    >
      {#if option.type === 'number'}
        <slot name="number" value="{option.value}">
          <span>{option.value}</span>
        </slot>
      {:else if option.type === 'symbol' && option.symbol === ELLIPSIS}
        <slot name="ellipsis">
          <span>...</span>
        </slot>
      {:else if option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}
        <IconPrevious/>
      {:else if option.type === 'symbol' && option.symbol === NEXT_PAGE}
        <IconNext/>
      {/if}
    </span>
  {/each}
</div>