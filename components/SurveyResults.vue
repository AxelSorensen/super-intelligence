<template>
  <!-- <div class="text-white">{{ data.answers[0] }}</div> -->
  <div class="flex flex-col items-center pb-4">
    <div class="text-4xl text-purple-500">{{ data[0]?.answers.reduce((partialSum, a) =>
      partialSum + a, 0) || 0 }}</div>
    <div class="font-light text-white">Responses in total</div>
    <div class="font-light text-neutral-500">From all over the world 🌎</div>
  </div>
  <div v-if="data.length == 6" v-for="(question, q_index) in survey" class="flex flex-col w-full gap-2 max-w-[600px]">
    <div class="text-neutral-400 text-sm ">{{ question.question }}</div>

    <div class="flex flex-col gap-2 w-full">
      <div class="flex gap-2 items-center" v-for="(answer, index) in question?.answers">
        <div
          class="text-white flex ring-purple-500 relative overflow-hidden items-center justify-between bg-neutral-800 rounded-md w-full">
          <div
            :style="{ width: `${data[q_index]?.answers[index] / data[q_index]?.answers.reduce((partialSum, a) => partialSum + a, 0) * 100}% ` }"
            class="absolute z-1 bg-purple-500 h-full">

          </div>

          <div class="relative flex p-2 z-10 items-center">{{ answer }}</div>
          <div class="text-white-400 z-10 text-sm p-2">{{ Math.round(data[q_index]?.answers[index] /
            data[q_index]?.answers.reduce((partialSum, a) =>
              partialSum + a, 0)
            *
            100) || 0 }}%</div>
        </div>

      </div>

    </div>


  </div>
  <div class="text-white animate-pulse" v-else>Loading...</div>
  <div class="flex flex-col items-center">


  </div>
</template>

<script setup>
import { useFirestore } from 'vuefire'
import { getDoc, doc, } from 'firebase/firestore';
const db = useFirestore()
const q_list = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
const data = ref([])
q_list.forEach(async (index) => {
  const docRef = doc(db, "survey", index);
  let item = (await getDoc(docRef)).data()
  data.value.push(item);
})


const props = defineProps({
  survey: Array
})

</script>




<style></style>