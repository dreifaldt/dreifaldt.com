<script lang="ts">
  let count = $state(0)
</script>

<div class="flex flex-col items-center gap-4 mt-8">
  <p class="text-2xl">Count: {count}</p>
  <div class="flex gap-2">
    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick={() => count--}>-</button>
    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick={() => count++}>+</button>
  </div>
</div>
