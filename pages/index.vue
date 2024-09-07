<template>
    <!-- Audio source for triggering audio in safari -->
    <audio ref="audio" preload="auto">
        <source src="../assets/silence.mp3" type="audio/mpeg">
    </audio>
    <div @click="showGoTo = !showGoTo" class="absolute top-0 w-8 h-8 right-0 cursor-pointer"></div>
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
            <div class="flex flex-col gap-4 w-full items-center justify-center">
                <button @click="page = 'game'; currentIndex = startIndex; startSound()"
                    class="p-4 z-10 cursor-pointer max-w-[200px] bg-neutral-800 flex items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-md">{{
                        indexCookie
                            ? 'Restart' : 'Start' }}</button>
                <button v-if="indexCookie" @click="resumeGame"
                    class="p-4 z-10 cursor-pointer max-w-[200px] bg-neutral-800 flex items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-md">Resume</button>
                <button @click="page = 'end';"
                    class="p-4 z-10 cursor-pointer max-w-[200px] flex items-center justify-center w-full text-center text-purple-500 ring-2 hover:bg-purple-500 hover:bg-opacity-15 ring-purple-500 ring-opacity-20 rounded-md">Resources
                    and Survey</button>
                <div v-if="showGoTo" class="flex gap-2 items-center">
                    <div class="text-purple-500">Go to</div>
                    <input v-model="go_to_num" type="text" class="w-12 bg-neutral-700 rounded-sm px-1 outline-none">
                    <div @click="page = 'game'; currentIndex = go_to_num;"
                        class="text-purple-500 rounded-sm cursor-pointer">->
                    </div>
                </div>
            </div>
        </div>
        <div v-if="page == 'game'"
            class="w-dvw h-dvh grid grid-rows-[1fr,100px] relative grid-cols-1 bg-neutral-900 flex-col p-4  gap-4 ">

            <!-- Main text -->
            <div :class="[hasTag('bad_guy') ? 'text-red-500  w-full text-base z-10 absolute break-words bottom-10' : 'text-[#4AF626]']"
                class="flex items-center justify-center p-8">
                <div class="flex gap-2 w-[40ch]" :class="[hasTag('bad_guy') ? 'bg-black p-2 rounded-md' : '']">
                    <span>> </span>
                    <div class=" font-mono">{{ typed_text }}<span
                            :class="[hasTag('bad_guy') ? 'border-red-500 z-10' : 'border-[#4AF626]']"
                            class="animate-[blink-caret_1s_infinite] border h-5 w-0 ml-[2px]">
                        </span>
                    </div>
                </div>
            </div>
            <!-- Choices -->
            <div class="flex items-end items  pb-4 gap-4 justify-evenly">
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
                        <Home class="text-2xl" />
                    </div>
                    <!-- <div class="cursor-pointer  text-neutral-500 hover:text-neutral-400"
                                @click="restartGame(); currentIndex = 0; restartType()">
                                Restart
                            </div> -->
                    <div class="flex flex-grow items-center gap-4">
                        <div class="w-full overflow-hidden bg-neutral-700 rounded-full">
                            <div class="h-2 bg-neutral-500 rounded-full select-none"
                                :style="{ width: `${Math.round((currentIndex / nodes.length) * 100)}%` }">
                            </div>
                        </div>
                        <div class="text-neutral-500">{{ Math.round((currentIndex / nodes.length) * 100) }}%
                        </div>
                    </div>

                    <SoundOn @click="soundOn = !soundOn" v-if="soundOn"
                        class="cursor-pointer text-neutral-500 text-2xl hover:text-neutral-400" />
                    <SoundOff @click="soundOn = !soundOn" v-else
                        class="cursor-pointer text-neutral-500 text-2xl hover:text-neutral-400" />
                </div>


            </div>
            <!-- Survey -->
            <div class=" flex justify-center">
                <Survey class="absolute bottom-4 p-4" v-if="hasTag('survey') && !isTyping" @answered="surveyAnswered"
                    :survey="survey" :survey_index="survey_index" />
            </div>
            <!-- Extra buttons -->
            <div class="absolute  flex p-10 text-center justify-center items-center w-dvw h-dvh">

                <div v-show="hasTag('pro_climate') && !isTyping" class=" text-[#4AF626] mt-20 text-1xl font-mono">
                    Historic Green
                    Legislation
                    will Combat Climate
                    Change and Protect Future Generations</div>
                <div v-show="hasTag('stay_climate')" class=" text-[#4AF626] mt-20 text-1xl font-mono">Historic
                    Green
                    Legislation
                    will Combat Climate
                    Change and Protect Future Generations</div>

                <h1 v-show="hasTag('anti_climate')" class=" text-red-500 mt-20 text-1xl font-mono">Radical Green
                    Agenda
                    Threatens Economic Stability
                    and Personal
                    Freedom
                </h1>
                <button @click="rephrase"
                    class=" text-white hover:bg-blue-600 bg-blue-700 w-auto absolute cursor-pointer p-4 z-10 bottom-40"
                    v-if="hasTag('rephrase')">REPHRASE WITH AI</button>
            </div>

            <!-- Paper clip -->
            <div class="absolute w-dvw h-dvh flex justify-center">
                <!-- Hardcoded values -->
                <Paperclip :currentIndex="currentIndex" v-if="currentIndex > 16 && currentIndex < 41" ref="paperclip"
                    class="top-0  absolute" />
                <img v-show="currentIndex > 26 && currentIndex < 40" src="../assets/Clippy9000.png"
                    class="w-32 select-none h-32 absolute bottom-[180px] animate-[fade-in_.5s_forwards] z-10 " alt="">
                <button v-if="hasTag('clip_button') && !isTyping" @click="addClip"
                    class=" text-purple-500 hover:ring-2 select-none  ring-purple-500 bg-neutral-800 w-[120px] h-[120px] p-4 rounded-full absolute bottom-20 cursor-pointer z-10">Make
                    Paperclip</button>
                <button @click="stopClips" v-if="hasTag('stop_button') && !isTyping"
                    :class="{ 'bottom-20': hasTag('stop_bottom'), 'top-20': hasTag('stop_top'), 'top-[100px] left-6': hasTag('stop_left'), 'bottom-[320px]': hasTag('stop_works') }"
                    class=" text-white hover:bg-red-600  select-none bg-red-700 w-auto absolute cursor-pointer p-4 z-10">EMERGENCY
                    STOP</button>
                <div class="bg-black absolute w-dvw h-dvh animate-[fade_4s_forwards]"
                    v-if="(currentIndex == 106 || currentIndex == 107) && !isTyping">
                </div>
                <video playsinline webkit-playsinline ref="bomb" v-show="hasTag('bomb')" @ended="currentIndex++">

                    <source src="../assets/bomb.mp4" type="video/mp4">

                </video>

                <!-- Video -->
                <div class="w-dvw max-w-[600px] flex-col h-dvh rounded-md overflow-hidden items-center flex justify-center p-8"
                    v-show="hasTag('video')">

                    <div class="overflow-hidden">
                        <video playsinline webkit-playsinline ref="oppenheimer" class="h-30%" @ended="currentIndex++">

                            <source src="../assets/oppenheimer.mp4" type="video/mp4">

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
                                class="text-center text-gray-500 hover:text-gray-400 cursor-pointer z-[20]">Skip ->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="page == 'end'" class="z-[20]">
            <div class="absolute  z-10 top-0 p-4 gap-8 flex w-screen items-center">
                <div class="cursor-pointer flex hover:text-neutral-400 text-neutral-500"
                    @click="page = 'home'; restartGame()">
                    <Home class="text-2xl" />
                </div>



            </div>
            <div
                class="w-dvw h-dvh scale-[100vh] flex justify-center items-center bg-neutral-900 flex-col p-4  gap-8 text-white">
                <div class="font-mono text-[#4AF626] text-2xl">The End</div>
                <div class="flex flex-col gap-2 w-full items-center">
                    <div class="font-mono text-[#4AF626] text-sm">Pause powerful AI training</div>
                    <a href="https://futureoflife.org/open-letter/pause-giant-ai-experiments/" target="_blank"
                        class="bg-[#4AF626] hover:bg-[#2b8a18] cursor-pointer hover:text-white w-full max-w-[400px] text-center text-black p-2 rounded-sm">Sign
                        open
                        letter</a>
                </div>
                <div class="flex flex-col gap-4 w-full items-center">
                    <div class="font-mono text-[#4AF626] text-sm">More resources on AI safety</div>

                    <a href="https://www.youtube.com/watch?v=3Om9ssTm194" target="_blank"
                        class="bg-[#4AF626] hover:bg-[#2b8a18] w-full truncate cursor-pointer max-w-[600px] hover:text-white text-center text-black p-2 rounded-sm">Myths
                        and Facts About Superintelligent AI (video)</a>
                    <a href="https://www.safe.ai/ai-risk" target="_blank"
                        class="bg-[#4AF626] hover:bg-[#2b8a18] w-full truncate cursor-pointer max-w-[600px] hover:text-white text-center text-black p-2 rounded-sm">An
                        Overview of Catastrophic AI Risks (article)</a>
                    <a href="https://aiimpacts.org/counterarguments-to-the-basic-ai-x-risk-case/" target="_blank"
                        class="bg-[#4AF626] truncate hover:bg-[#2b8a18] cursor-pointer max-w-[600px] hover:text-white w-full  text-center text-black p-2 rounded-sm">An
                        Counterarguments to the basic AI x-risk case (article)</a>

                </div>
                <div class="flex flex-col w-full max-w-[600px] gap-4">
                    <div @click="page = 'take_survey'; take_survey_index = 0"
                        class="p-2 z-10 cursor-pointer  bg-neutral-800 flex  items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-sm">
                        Take survey</div>
                    <div @click="page = 'survey'"
                        class="p-2 z-10 cursor-pointer  bg-neutral-800 flex max-w-[600px] items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-sm">
                        View Survey Results</div>
                </div>

                <div class="flex flex-col gap-2 w-full items-center">
                    <div class="font-mono text-[#4AF626] text-sm">Written and created by:</div>
                    <div class="font-mono text-[#4AF626] text-lg">Axel Sorensen</div>
                    <div class="font-mono short:hidden text-neutral-400 text-sm">Reach out at: </div>
                    <a href="mailto:axelsorensenwork@gmail.com"
                        class="hover:text-purple-500 short:hidden text-gray-500 allow-select">axelsorensenwork@gmail.com</a>
                    <a href="https://www.linkedin.com/in/axel-sorensen/" target="_blank"
                        class="hover:text-purple-500 short:hidden text-gray-500  allow-select">www.linkedin.com/in/axel-sorensen/</a>
                </div>

            </div>
        </div>


    </div>
    <div class="h-dvh w-dvh flex flex-col" v-if="page == 'take_survey'">
        <div
            class="cursor-pointer p-4 sticky top-0 text-neutral-500 bg-neutral-900 w-full z-20 flex justify-center items-center">
            <div class="absolute flex gap-4 items-center left-4">
                <div @click="page = 'end'" class="text-2xl cursor-pointer text-neutral-400 hover:text-neutral-300">
                    <ChevronLeft />
                </div>


            </div>


            <div>Survey</div>

        </div>
        <div class="flex flex-col mt-40 p-4 w-full justify-center">
            <div class="text-neutral-300 text-center pb-8">*All responses are anonymous</div>
            <div class="flex justify-center">
                <Survey v-show="take_survey_index < 6" @answered="takeSurveyAnswered" :survey="survey"
                    :survey_index="take_survey_index" />
                <div class="text-white text-center items-center justify-center pb-8 gap-10 flex flex-col"
                    v-if="take_survey_index > 5">
                    <div class="text-purple-500 text-2xl">Thank you for your participation</div>
                    <div @click="page = 'end'" :style="{ animationDelay: `1000ms` }"
                        class="p-4 z-10 opacity-0 cursor-pointer animate-[fade-in_1s_forwards]  bg-neutral-800 w-[200px] text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-md">
                        Return</div>
                </div>
            </div>

        </div>
    </div>

    <div class="relative" v-if="page == 'survey'">
        <div
            class="cursor-pointer p-4 sticky top-0 text-neutral-500 bg-neutral-900 w-full z-20 flex justify-center items-center">
            <div class="absolute flex gap-4 items-center left-4">
                <div @click="page = 'end'" class="text-2xl cursor-pointer text-neutral-400 hover:text-neutral-300">
                    <ChevronLeft />
                </div>


            </div>


            <div>Survey Results</div>

        </div>

        <div class="p-4 gap-4 overflow-scroll justify-center items-center flex flex-col">

            <SurveyResults :survey="survey" />
            <div @click="page = 'end'"
                class="font-light pb-4 text-center cursor-pointer text-neutral-400 hover:text-neutral-300">
                < Go back</div>
            </div>
        </div>



</template>

<script setup>
import { ref } from 'vue'
import type_1 from '../assets/type_1.mp3'
import type_2 from '../assets/type_2.mp3'
import type_3 from '../assets/type_3.mp3'
import type_4 from '../assets/type_4.mp3'
import type_5 from '../assets/type_5.mp3'
import clip from '../assets/clip.mp3'
import error from '../assets/error.mp3'
import { useSound } from '@vueuse/sound'
const survey_index = ref(0)
const take_survey_index = ref(0)

import node_file from '../nodes_1.json'
import survey_file from '../survey.json'
const nodes = ref(node_file)
const survey = ref(survey_file)
const oppenheimer = ref(null)
const bomb = ref(null)
const audio = ref(null)

import SoundOn from '~icons/heroicons/speaker-wave-16-solid'
import SoundOff from '~icons/heroicons/speaker-x-mark-16-solid'
import Home from '~icons/heroicons/home-16-solid'
import ChevronLeft from '~icons/heroicons/chevron-left-16-solid'
const paperclip = ref(null)
const play = ref(false)
//const nodes = ref(useCookie('nodes', { default: () => ref({}) }))
const currentIndex = ref(null)
const indexCookie = useCookie('indexCookie', { default: () => ref(0) })
const showGoTo = ref(false)
const page = ref('home')
const paperclip_count = ref(0)
const go_to_num = ref(0)
const sounds = [useSound(type_1, { volume: 0.5 }), useSound(type_2, { volume: 0.5 }), useSound(type_3, { volume: 0.5 }), useSound(type_4, { volume: 0.5 }), useSound(type_5, { volume: 0.5 })];
const clip_sound = useSound(clip, { volume: 0.5 });
const error_sound = useSound(error, { volume: 1 });
const soundOn = ref(true)

function resumeGame() {
    page.value = 'game';
    startSound();
    if (indexCookie.value > 18 && indexCookie.value < 26) {
        currentIndex.value = 18

    } else if (indexCookie.value > 28 && indexCookie.value < 40) {
        currentIndex.value = 28

    } else if (indexCookie.value > 105 && indexCookie.value < 109) {
        currentIndex.value = 105

    } else {
        currentIndex.value = indexCookie.value
    }


}

function restartGame() {
    currentIndex.value = null
    paperclip_count.value = 0
    clearAllTypeTimeouts()
}

function surveyAnswered() {
    currentIndex.value++

}

function takeSurveyAnswered() {
    const buffer = take_survey_index.value
    take_survey_index.value == null;
    take_survey_index.value = buffer + 1

}

function startSound() {

    audio.value.play()
}

function rephrase() {
    currentIndex.value++
}

const cooldownPeriod = 100; // 1000ms = 1 second
let lastPlayTime = 0;

function addClip() {
    const now = Date.now();

    // Check if enough time has passed since the last sound was played
    if (now - lastPlayTime >= cooldownPeriod) {
        // Play the clip sound
        if (soundOn.value) {
            clip_sound.play();
        }


        // Update the lastPlayTime to the current time
        lastPlayTime = now;
    }

    // Update paperclip count and add clip
    paperclip.value?.addClip();
    paperclip_count.value++;
}


function hasTag(tag_name) {
    if (nodes.value[currentIndex.value]?.tag) {
        return nodes.value[currentIndex.value].tag.split(',').includes(tag_name)
    } else {
        return false
    }

}

function stopClips() {
    if (soundOn.value) {
        error_sound.play()
    }

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
    isTyping.value = false
    charIndex.value = 0
    typed_text.value = ''
    setTimeout(() => typeText(), typingSpeed())
}

function typingSpeed() {
    return 80
}

let typeTimeouts = []

function clearAllTypeTimeouts() {
    // Loop through the array of timeout IDs and clear each one
    typeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));

    // Reset the array
    typeTimeouts = [];
}

function typeText() {

    if (charIndex.value < nodes.value[currentIndex.value]?.text?.length) {
        isTyping.value = true
        if (soundOn.value) {
            const typingSound = sounds[Math.floor(Math.random() * sounds.length)];

            typingSound.volume = 0.5; // rewind to start to handle fast typing
            typingSound.play();
        }
        setTimeout(typeText, typingSpeed());

        typed_text.value += nodes.value[currentIndex.value]?.text[charIndex.value];
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
    console.log(newIndex, oldIndex)
    isTyping.value = false
    if (newIndex == 18) {
        paperclip.value?.addClip();
    }

    if (newIndex != null) {
        indexCookie.value = newIndex.toString()
    }

    if (!isTyping.value) {
        restartType()
    }

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

    if (currentIndex.value == 19) {
        paperclip_count.value = 0
    }

    if (currentIndex.value == 20) {
        paperclip_count.value = 1
    }

    if (currentIndex.value == 23) {
        paperclip_count.value = 5
    }

    if (currentIndex.value == 29) {
        paperclip_count.value = 0
    }


})



const clip_interval = ref(null)

function botClips() {

    progressiveInterval(500, 10, () => {
        addClip();
    }, () => paperclip_count.value > 50000 || currentIndex.value == null);
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
    return nodes.value[currentIndex.value]?.callback
}

// Run callback after text has been typed
watch(isTyping, (newValue) => {
    if (!newValue) {
        if (hasCallback())
            runCallback(currentIndex.value)
    }
});


// onMounted(() => {
//     window.addEventListener("beforeunload", function (e) {
//         e.preventDefault();
//         e.returnValue = "";
//         indexCookie.value = currentIndex.value
//     });
// })

</script>
