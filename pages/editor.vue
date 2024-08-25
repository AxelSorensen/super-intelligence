<template>

    <div v-if="!play" class="w-dvw z-[20] h-dvh grid grid-rows-[auto,1fr,1fr] relative">
        <div class="divide-y gap-2 divide-neutral-800">
            <div @click="play = !play; currentIndex = startIndex;"
                class="bg-neutral-900 text-white  top-0 flex items-center justify-center p-2 text-center hover:bg-neutral-800 cursor-pointer">
                {{ play ? 'Build' : 'Play' }}
            </div>

            <div class="bg-neutral-900 text-white p-2 cursor-pointer hover:bg-neutral-800 flex justify-center items-center"
                @click="download(nodes, 'nodes', 'application/json'); saveFile">Export nodes
            </div>
            <div class="bg-neutral-900 text-white p-2 hover:bg-neutral-800 cursor-pointer flex justify-center items-center"
                @click="importJSON">Import
                nodes
            </div>
        </div>
        <div class="p-8 justify-center gap-4 bg-neutral-900 text-neutral-400 items-center flex-col flex h-full">
            <div v-for="(node, key) in nodes">
                <div v-if="!(node?.group) || groups[node?.group]?.expanded" class="flex flex-col">
                    <div :class="[isLinking && key != linkFrom.node ? 'hover:ring-2 ring-purple-500' : null, isAdded(key) ? 'ring-blue-500 ring' : isDeleted(key) ? 'ring-red-500 ring' : 'bg-neutral-800']"
                        @click="endLink(key)" class="rounded-md flex-col w-[400px] p-4 gap-2 bg-neutral-800 flex">
                        <div class="flex justify-between">
                            <p class="text-neutral-">Id: {{ key }}</p>
                            <div class="cursor-pointer" @click="play = true; currentIndex = key; restartType()">Play >
                            </div>
                            <div @click="deleteNode(key)" class="text-red-500 cursor-pointer hover:text-red-400">X</div>

                        </div>
                        <div class="text-neutral-500">Text:</div> <textarea
                            class="bg-neutral-700 rounded-md resize-none p-2 outline-none text-white"
                            v-model="node.text" type="text"></textarea>
                        <p class="text-neutral-500">Choices:</p>
                        <div class="flex  gap-2 justify-between" v-for="(choice, index) in node.choices">
                            <div class="flex flex-1 items-center gap-2">
                                <div class="w-[4.5rem] ">Choice {{ index }}</div>
                                <input v-model="choice.text" type="text"
                                    class="bg-neutral-700 flex-grow text-white outline-none  p-1 rounded-sm">
                            </div>
                            <div class="flex gap-2 w-16 justify-end items-center">
                                <span v-if="choice.link == null" class="cursor-pointer"
                                    @click.stop="startLink(key, index)">Link</span> <span v-else>->
                                    {{
                                        choice.link
                                    }}</span><span @click="node.choices.splice(index, 1)"
                                    class="text-red-500 cursor-pointer hover:text-red-400">X</span>
                            </div>
                        </div>

                        <div class="cursor-pointer" @click="addChoice(key)">+ Add choice</div>
                        <div v-if="!node.callback" class="cursor-pointer" @click="addCallback(key)">+ Add callback</div>
                        <div class="flex gap-2 items-center justify-between" v-else>
                            Delay
                            <div class="flex flex-1 items-center gap-2">
                                <input v-model="node.callback.delay" type="text"
                                    class="bg-neutral-700 rounded-sm flex-grow text-white outline-none p-1">
                            </div>
                            <div class="flex w-16 justify-end items-center gap-2">
                                <span v-if="node.callback.link == null" class="cursor-pointer "
                                    @click.stop="startLink(key, index)">Link</span> <span v-else>->
                                    {{
                                        node.callback.link }}</span><span @click="node.callback = null"
                                    class="text-red-500 cursor-pointer">X</span>
                            </div>
                        </div>

                        <div v-if="node.tag == null" class="cursor-pointer" @click="addTag(node)">+ Add tag</div>
                        <div class="flex w-full items-center  gap-2 justify-between" v-else>
                            Tags:
                            <input v-model="node.tag" type="text"
                                class="bg-neutral-700 rounded-sm flex-grow text-white outline-none p-1"><span
                                @click="node.tag = null" class="text-red-500 cursor-pointer">X</span>
                        </div>
                    </div>

                    <div class="flex justify-center text-xl cursor-pointer" @click="addNode(key)">
                        <div class=" hover:text-blue-300 text-blue-400">+</div>
                    </div>

                    <div v-if="!nodes.length" class="flex justify-center text-gray-400 text-xl cursor-pointer"
                        @click="addNode(-1)">
                        +
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>

        <div class="w-dvw h-dvh grid grid-rows-[1fr,100px] relative grid-cols-1 bg-neutral-900 flex-col p-4  gap-4 ">
            <!-- Main text -->
            <div :class="[hasTag('bad_guy') ? 'text-red-500 z-10 absolute bottom-40' : 'text-[#4AF626]']"
                class="flex items-center justify-center p-8">
                <div class="flex gap-2 w-[40ch]">
                    <span>></span>
                    <div class="scanline font-mono">{{ typed_text }}<span
                            :class="[hasTag('bad_guy') ? 'border-red-500 z-10' : 'border-[#4AF626]']"
                            class="animate-[blink-caret_1s_infinite] border h-5 w-0 ml-[2px]">
                        </span>
                    </div>
                </div>



            </div>
            <!-- Choices -->
            <div class="flex items-end  pb-4 gap-4 justify-evenly">
                <div class="max-w-[600px] w-full flex gap-4">
                    <div v-if="!isTyping"
                        class="p-4 z-10 cursor-pointer  bg-neutral-800 flex animate-[fade-in_.5s_forwards] items-center justify-center w-full text-center text-purple-500 hover:ring-2 ring-purple-500 rounded-md"
                        @click="currentIndex = choice.link" v-for="(choice, index) in nodes?.[currentIndex]?.choices">
                        {{ choice.text }}
                    </div>
                </div>
                <div class="absolute left-4 z-10 top-4 gap-4 flex">
                    <div class="cursor-pointer  text-white" @click="play = !play;">
                        < Back </div>
                            <div class="cursor-pointer  text-white" @click="currentIndex = 0; restartType()">
                                Restart
                            </div>
                    </div>


                </div>
                <!-- Survey -->
                <div class=" flex justify-center">
                    <Survey class="absolute bottom-4 p-4" v-if="hasTag('survey') && !isTyping"
                        @answered="surveyAnswered" :question="survey[survey_index].question"
                        :answers="survey[survey_index].answers" />
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

                    <button v-if="hasTag('clip_button') && !isTyping" @click="addClip"
                        class=" text-purple-500 hover:ring-2  ring-purple-500 bg-neutral-800 w-[120px] h-[120px] p-4 rounded-full absolute bottom-20 cursor-pointer z-10">Make
                        Paperclip</button>
                    <button @click="stopClips" v-if="hasTag('stop_button') && !isTyping"
                        :class="{ 'bottom-20': hasTag('stop_bottom'), 'top-20': hasTag('stop_top'), 'top-[100px] left-6': hasTag('stop_left'), 'bottom-[100px] right-6': hasTag('stop_works') }"
                        class=" text-white hover:bg-red-600 bg-red-700 w-auto absolute cursor-pointer p-4 z-10">EMERGENCY
                        STOP</button>
                    <div class="bg-black absolute w-dvw h-dvh animate-[fade_4s_forwards]"
                        v-if="(currentIndex == 101 || currentIndex == 102) && !isTyping">
                    </div>
                    <video ref="bomb" v-show="hasTag('bomb')" @ended="currentIndex++">

                        <source src="../assets/bomb.mp4" type="video/mp4">

                    </video>
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


        </div>



        <div>

        </div>


</template>

<script setup>
const survey_index = ref(0)


import node_file from '../nodes_1.json'
import survey_file from '../survey.json'
const nodes = ref(node_file)
const survey = ref(survey_file)

import { ref } from 'vue'
const paperclip = ref(null)
const oppenheimer = ref(null)
const bomb = ref(null)
const play = ref(false)
//const nodes = ref(useCookie('nodes', { default: () => ref({}) }))
const currentIndex = ref(null)
const paperclip_count = ref(0)

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

function createGroup() {
    nodes.value.slice(group.value.from, group.value.to).forEach(node => {
        console.log(node)
        node['group'] = group.value.name
    })
    groups.value[group.value.name] = {
        expanded: false
    }
}

function hasTag(tag_name) {
    if (nodes.value[currentIndex.value].tag) {
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

const group = ref({ from: null, to: null, name: null })
const groups = ref({})

const added_key = ref(null)
const deleted_key = ref(null)

function addNode(key) {
    const new_node = {
        text: '',
        choices: [],
        callback: null
    }
    nodes.value.splice(key + 1, 0, new_node)
    added_key.value = key + 1
    setTimeout(() => {
        added_key.value = null
    }, 500)

    nodes.value.forEach(node => {
        node.choices.forEach(choice => {
            if (choice.link > key) {
                choice.link++
            }

        })
        if (node.callback && node.callback.link > key) {

            node.callback.link++

        }

    })
}



function deleteNode(key) {

    deleted_key.value = key
    setTimeout(() => {
        nodes.value.splice(key, 1)
        deleted_key.value = null

    }, 200)
    nodes.value.forEach(node => {
        node.choices.forEach(choice => {
            if (choice.link > key) {
                choice.link--
            } else if (choice.link == key) {

                choice.link = null
            }

        })
        if (node.callback) {
            if (node.callback.link > key) {
                node.callback.link--
            } else if (node.callback.link == key) {

                node.callback.link = null
            }
        }

    })
}

function isAdded(key) {
    return added_key.value == key
}

function isDeleted(key) {
    return deleted_key.value == key
}

async function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function importJSON() {
    let element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("accept", ".json");
    element.style.display = "none";
    element.multiple = true;
    document.body.appendChild(element);
    element.click();
    element.addEventListener("change", async (e) => {
        let reader = new FileReader();
        reader.addEventListener("loadend", () => {
            nodes.value = JSON.parse(reader.result)

        });
        reader.readAsText(e.target.files[0]);
    });
}

const startIndex = ref(0)

const typed_text = ref('')

const isTyping = ref(false)


const charIndex = ref(0)


function restartType() {
    charIndex.value = 0
    typed_text.value = ''
    setTimeout(() => typeText(), 100)
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

async function saveFile() {
    await fetch('/api/save-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nodes.value)
    });
}

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

function addCallback(key) {
    console.log(key)
    nodes.value[key].callback = {
        delay: null,
        link: null,
    }
}

function addChoice(key) {
    nodes.value[key].choices.push({
        text: '',
        link: null,
    })
}

function addTag(node) {
    node.tag = ''
}

function startLink(node, choice) {
    isLinking.value = true
    linkFrom.value.node = node
    linkFrom.value.choice = choice

}

function endLink(node) {

    if (isLinking.value) {
        if (linkFrom.value.choice != null) {
            nodes.value[linkFrom.value.node].choices[linkFrom.value.choice].link = node

        } else {
            nodes.value[linkFrom.value.node].callback.link = node
        }

    }
    isLinking.value = false
}

const linkFrom = ref({ node: '', choice: '' })

onMounted(() => {
    window.addEventListener('beforeunload', saveFile)
})




const isLinking = ref(false)

</script>
