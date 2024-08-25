<template>
    <div class="bg-neutral-900 overflow-hidden">

        <div v-if="page == 'home'"
            class="w-dvw h-dvh flex justify-center items-center bg-neutral-900 flex-col p-4  gap-16 text-white">
            <div class="flex flex-col gap-4">
                <div class="font-mono text-[#4AF626] text-2xl">Superintelligence? <span
                        :class="[hasTag('bad_guy') ? 'border-red-500 z-10' : 'border-[#4AF626]']"
                        class="animate-[blink-caret_1s_infinite] border h-5 w-0 ml-[5px]">
                    </span></div>
                <div class="font-mono text-[#4AF626] text-sm">By Axel Sorensen</div>
            </div>
            <button @click="page = 'game'; currentIndex = startIndex;"
                class="p-4 z-10 cursor-pointer max-w-[200px] bg-neutral-800 flex items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-md">Begin</button>

        </div>
        <div v-if="page == 'game'"
            class="w-dvw h-dvh grid grid-rows-[1fr,100px] relative grid-cols-1 bg-neutral-900 flex-col p-4  gap-4 ">

            <!-- Main text -->
            <div :class="[hasTag('bad_guy') ? 'text-red-500 w-full text-xl z-10 absolute break-words bottom-10' : 'text-[#4AF626]']"
                class="flex items-center justify-center p-8">
                <div class="flex gap-2 w-[40ch]">
                    <span>></span>
                    <div class="font-mono">{{ typed_text }}<span
                            :class="[hasTag('bad_guy') ? 'border-red-500 z-10' : 'border-[#4AF626]']"
                            class="animate-[blink-caret_1s_infinite] border h-5 w-0 ml-[2px]">
                        </span>
                    </div>
                </div>
            </div>
            <!-- Choices -->
            <div class="flex items-end  pb-4 gap-4 justify-evenly">
                <div class="max-w-[600px] w-full flex gap-4 select-none">
                    <div v-if="!isTyping"
                        class="p-4 z-10 cursor-pointer  bg-neutral-800 flex animate-[fade-in_.5s_forwards] items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-md"
                        @click="currentIndex = choice.link" v-for="(choice, index) in nodes?.[currentIndex]?.choices">
                        {{ choice.text }}
                    </div>
                </div>
                <div class="absolute  z-10 top-0 p-4 gap-8 flex w-screen items-center">
                    <div class="cursor-pointer flex hover:text-neutral-400 text-neutral-500"
                        @click="page = 'home'; restartGame()">
                        Back </div>
                    <div class="cursor-pointer  text-neutral-500 hover:text-neutral-400"
                        @click="restartGame(); currentIndex = 0; restartType()">
                        Restart
                    </div>
                    <div class="flex-grow overflow-hidden bg-neutral-700 rounded-full">
                        <div class="h-2 bg-purple-500 rounded-full"
                            :style="{ width: `${Math.round((currentIndex / nodes.length) * 100)}%` }">
                        </div>
                    </div>

                    <div class="text-neutral-500">{{ Math.round((currentIndex / nodes.length) * 100) }}%</div>
                </div>


            </div>
            <!-- Survey -->
            <div class=" flex justify-center">
                <Survey class="absolute bottom-4 p-4" v-if="hasTag('survey') && !isTyping" @answered="surveyAnswered"
                    :question="survey[survey_index].question" :answers="survey[survey_index].answers" />
            </div>
            <!-- Extra buttons -->
            <div class="absolute  flex p-10 text-center justify-center items-center w-dvw h-dvh">

                <div v-show="hasTag('pro_climate') && !isTyping" class=" text-[#4AF626] mt-20 text-1xl font-mono">
                    Historic Green
                    Legislation
                    Unveiled to Combat Climate
                    Change and Protect Future Generations</div>
                <div v-show="hasTag('stay_climate')" class=" text-[#4AF626] mt-20 text-1xl font-mono">Historic
                    Green
                    Legislation
                    Unveiled to Combat Climate
                    Change and Protect Future Generations</div>

                <h1 v-show="hasTag('anti_climate')" class=" text-red-500 mt-20 text-1xl font-mono">Radical Green
                    Agenda
                    Threatens Economic Stability
                    and Personal
                    Freedoms in the Name of Climate Activism
                </h1>
                <button @click="rephrase"
                    class=" text-white hover:bg-blue-600 bg-blue-700 w-auto absolute cursor-pointer p-4 z-10 bottom-40"
                    v-if="hasTag('rephrase')">REPHRASE WITH AI</button>
            </div>

            <!-- Paper clip -->
            <div class="absolute w-dvw h-dvh flex justify-center">
                <!-- Hardcoded values -->
                <Paperclip v-if="currentIndex > 13 && currentIndex < 37" ref="paperclip"
                    class="z-[8] top-0  absolute" />
                <img v-if="currentIndex > 21 && currentIndex < 35" src="../assets/Clippy3000.png"
                    class="w-32 h-32 absolute bottom-[180px] animate-[fade-in_.5s_forwards] z-10 " alt="">
                <button v-if="hasTag('clip_button') && !isTyping" @click="addClip"
                    class=" text-purple-500 hover:ring-2 select-none  ring-purple-500 bg-neutral-800 w-[120px] h-[120px] p-4 rounded-full absolute bottom-20 cursor-pointer z-10">Make
                    Paperclip</button>
                <button @click="stopClips" v-if="hasTag('stop_button') && !isTyping"
                    :class="{ 'bottom-20': hasTag('stop_bottom'), 'top-20': hasTag('stop_top'), 'top-[100px] left-6': hasTag('stop_left'), 'bottom-[110px]': hasTag('stop_works') }"
                    class=" text-white hover:bg-red-600 select-none bg-red-700 w-auto absolute cursor-pointer p-4 z-10">EMERGENCY
                    STOP</button>
                <div class="bg-black absolute w-dvw h-dvh animate-[fade_4s_forwards]"
                    v-if="(currentIndex == 101 || currentIndex == 102) && !isTyping">
                </div>
                <video ref="bomb" v-show="hasTag('bomb')" @ended="currentIndex++">

                    <source src="../assets/bomb.mp4" type="video/mp4">

                </video>

                <!-- Video -->
                <div class="w-dvw max-w-[600px] flex-col h-dvh rounded-md overflow-hidden items-center flex justify-center p-8"
                    v-show="hasTag('video')">

                    <div class="overflow-hidden">
                        <video ref="oppenheimer" class="h-30%" @ended="currentIndex++">

                            <source src="../assets/oppenheimer-quote.mp4" type="video/mp4">

                        </video>
                        <div class="text-gray-500 text-center p-4">J. Robert Oppenheimer on the aftermath of
                            creation of the first atom bomb</div>
                        <div class="text-white italic text-sm">We knew the world would not be the same. A few
                            people
                            laughed... A
                            few people cried...
                            Most people were silent. I remembered the line from the Hindu scripture the Bhagavad
                            Gita; Vishnu is trying to persuade the prince that he should do his duty, and to
                            impress
                            him takes on his multi-armed form, and says, <span class="text-purple-500">"Now I am
                                become death, the destroyer
                                of
                                worlds."</span> I suppose we all thought that, one way or another.</div>
                        <div>

                            <div @click="currentIndex++"
                                class="text-center text-gray-500 hover:text-gray-400 cursor-pointer">Skip ->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="page == 'end'" class="z-[20]">
            <div class="w-dvw h-dvh flex justify-center items-center bg-neutral-900 flex-col p-4  gap-8 text-white">
                <div class="font-mono text-[#4AF626] text-2xl">The End</div>
                <div class="flex flex-col gap-4 w-full items-center">
                    <div class="font-mono text-[#4AF626] text-sm">Pause powerful AI training</div>
                    <a href="https://futureoflife.org/open-letter/pause-giant-ai-experiments/" target="_blank"
                        class="bg-[#4AF626] hover:bg-[#2b8a18] cursor-pointer hover:text-white w-full max-w-[400px] text-center text-black p-4 rounded-sm">Sign
                        open
                        letter</a>
                </div>
                <div class="flex flex-col gap-4 w-full items-center">
                    <div class="font-mono text-[#4AF626] text-sm">More resources on AI safety</div>

                    <a href="https://www.youtube.com/watch?v=3Om9ssTm194" target="_blank"
                        class="bg-[#4AF626] hover:bg-[#2b8a18] w-full truncate cursor-pointer max-w-[600px] hover:text-white text-center text-black p-4 rounded-sm">Myths
                        and Facts About Superintelligent AI</a>
                    <a href="https://www.safe.ai/ai-risk" target="_blank"
                        class="bg-[#4AF626] hover:bg-[#2b8a18] w-full truncate cursor-pointer max-w-[600px] hover:text-white text-center text-black p-4 rounded-sm">An
                        Overview of Catastrophic AI Risks</a>
                    <a href="https://aiimpacts.org/counterarguments-to-the-basic-ai-x-risk-case/" target="_blank"
                        class="bg-[#4AF626] truncate hover:bg-[#2b8a18] cursor-pointer max-w-[600px] hover:text-white w-full  text-center text-black p-4 rounded-sm">An
                        Counterarguments to the basic AI x-risk case</a>

                </div>
                <div class="flex flex-col gap-4 w-full items-center">
                    <div class="font-mono text-[#4AF626] text-sm">Written and created by:</div>
                    <div class="font-mono text-[#4AF626] text-lg">Axel Sorensen</div>
                    <div class="font-mono text-neutral-400 text-sm">Reach out at: </div>
                    <a href="mailto:axelsorensenwork@gmail.com"
                        class="hover:text-purple-500 text-gray-500 allow-select">axelsorensenwork@gmail.com</a>
                    <a href="https://www.linkedin.com/in/axel-sorensen/" target="_blank"
                        class="hover:text-purple-500 text-gray-500  allow-select">www.linkedin.com/in/axel-sorensen/</a>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref } from 'vue'
const survey_index = ref(0)

import node_file from '../nodes_1.json'
import survey_file from '../survey.json'
const nodes = ref(node_file)
const survey = ref(survey_file)
const oppenheimer = ref(null)
const bomb = ref(null)

const paperclip = ref(null)
const play = ref(false)
//const nodes = ref(useCookie('nodes', { default: () => ref({}) }))
const currentIndex = ref(null)
const page = ref('home')
const paperclip_count = ref(0)

function restartGame() {
    currentIndex.value = null
    paperclip_count.value = 0

}

function surveyAnswered() {
    currentIndex.value++

}

function rephrase() {
    currentIndex.value++
}
function addClip() {
    paperclip.value.addClip()
    paperclip_count.value++
}


function hasTag(tag_name) {
    if (nodes.value[currentIndex.value]?.tag) {
        return nodes.value[currentIndex.value].tag.split(',').includes(tag_name)
    } else {
        return false
    }

}

function stopClips() {
    if (hasTag('stop_works')) {
        clearInterval(clip_interval.value)
    }

    currentIndex.value++
}

function progressiveInterval(initialTime, decreaseFactor, callbackFunction, stopCondition) {
    let currentInterval = initialTime;
    let ratio = 1
    function intervalFunction() {
        // Check the stop condition
        if (stopCondition()) {
            console.log('Interval stopped');
            return; // Exit the function and stop further execution
        }
        // Execute the passed callback function
        callbackFunction();

        // Decrease the interval time
        currentInterval = currentInterval - decreaseFactor / ratio;
        ratio += 0.025
        // Set a new interval with the smaller time
        clip_interval.value = setTimeout(intervalFunction, currentInterval);
    }

    // Start the first interval
    clip_interval.value = setTimeout(intervalFunction, currentInterval);
}


const startIndex = ref(0)

const typed_text = ref('')

const isTyping = ref(false)

const charIndex = ref(0)


function restartType() {
    charIndex.value = 0
    typed_text.value = ''
    setTimeout(() => typeText(), typingSpeed())
}

function typingSpeed() {
    return 80
}

function typeText() {

    if (charIndex.value < nodes.value[currentIndex.value].text.length) {
        isTyping.value = true
        setTimeout(typeText, typingSpeed());
        typed_text.value += nodes.value[currentIndex.value].text[charIndex.value];
        charIndex.value++;
    } else {
        setTimeout(() => isTyping.value = false, typingSpeed())

    }
}

function runCallback(index) {
    if (nodes.value?.[index]?.callback) {
        setTimeout(() => {
            currentIndex.value = nodes.value[index].callback.link
        }, parseInt(nodes.value[index].callback.delay))
    }
}
// Function calls callback on first node


// Type text when entering new node
watch(currentIndex, async (newIndex, oldIndex) => {
    restartType()
    typeText()
    if (hasTag('bot_clips')) {
        paperclip_count.value = 0
        botClips()
    }

    if (hasTag('survey')) {
        survey_index.value = parseInt(nodes.value[newIndex].tag.split('_')[1])
    }

    if (hasTag('end')) {
        setTimeout(() => page.value = 'end', 3000)
    }

    if (hasTag('video')) {

        nextTick(() => {
            oppenheimer.value.play()
        })
    }

    if (hasTag('bomb')) {

        nextTick(() => {
            oppenheimer.value.pause()
            bomb.value.play()
        })
    }


})



const clip_interval = ref(null)

function botClips() {
    progressiveInterval(500, 10, () => {
        addClip()

    }, () => paperclip_count.value > 50000)
}

const video = ref(null)


watch(paperclip_count, async (newCount, oldIndex) => {
    if (hasTag('clip_button')) {
        if (newCount == 1) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 5) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 20) {
            currentIndex.value++
            restartType()
            typeText()
        }
    } else {
        if (newCount == 5) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 10) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 20) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 30) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 40) {
            currentIndex.value++
            restartType()
            typeText()
        }
        if (newCount == 50) {
            currentIndex.value++
            restartType()
            typeText()
        }
    }

})

function hasCallback() {
    return nodes.value[currentIndex.value].callback
}

// Run callback after text has been typed
watch(isTyping, (newValue) => {
    if (!newValue) {
        if (hasCallback())
            runCallback(currentIndex.value)
    }
});


</script>
