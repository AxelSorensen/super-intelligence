<template>

    <div class="w-screen bg-black p-4  h-screen flex flex-col justify-center items-center">
        <button v-if="!start" @click="start = true" class=" text-white z-20 p-4 rounded-md">
            The beginning</button>
        <!-- <div v-if="start" class="w-screen h-20 bg-black shadow-[0_10px_40px_20px_rgba(0,0,0,1)] z-10"></div> -->
        <div class="overflow-hidden rounded-2xl w-max-[200px]">
            <video v-if="start" class="" autoplay>

                <source src="../assets/oppenheimer-quote.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <!-- <div v-if="start" class="w-screen h-20 bg-black shadow-[0_-10px_40px_20px_rgba(0,0,0,1)] z-10"></div> -->
            <div class="z-10 ">We knew the world would not be the same</div>
        </div>

    </div>

</template>

<script setup>
const start = ref(false)







</script>