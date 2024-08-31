<template>
  <div class="flex flex-col w-full gap-2 max-w-[600px]">
    <div class="text-purple-500 pb-4">{{ survey?.[survey_index]?.question }}</div>
    <div @click="submitAnswer(index); $emit('answered')" :style="{ animationDelay: `${index * 200}ms` }"
      :key="survey_index + '-' + index"
      class="text-purple-500 hover:ring-2 animate-[fade-in_1s_forwards] opacity-0  ring-purple-500 bg-neutral-800 p-4 rounded-md cursor-pointer z-10"
      v-for="(answer, index) in survey?.[survey_index]?.answers">
      {{ answer }}
    </div>
  </div>
</template>

<script setup>
const q_list = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
import { useFirestore } from 'vuefire'
import { getDoc, doc, setDoc } from 'firebase/firestore';
const db = useFirestore()
const props = defineProps({
  survey: Array,
  survey_index: Number
})

const { survey_index } = toRefs(props)


async function submitAnswer(index) {
  const docRef = doc(db, "survey", q_list[survey_index.value]);
  console.log('submitting answer', index, q_list[survey_index.value])
  const answers = (await getDoc(docRef)).data().answers;
  answers[index]++
  setDoc(docRef, { answers: answers }, { merge: true })
}


</script>




<style></style>