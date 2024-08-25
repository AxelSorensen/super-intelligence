<template>
  <div class="flex flex-col w-full gap-2 max-w-[600px]">
    <div class="text-purple-500 pb-4">{{ question }}</div>
    <div @click="$emit('answered')" :style="{ animationDelay: `${index * 200}ms` }"
      class="text-purple-500 hover:ring-2 animate-[fade-in_1s_forwards] opacity-0  ring-purple-500 bg-neutral-800 p-4 rounded-md cursor-pointer z-10"
      v-for="(answer, index) in answers">
      {{ answer }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: String,
  answers: Array
})

</script>




<style></style>