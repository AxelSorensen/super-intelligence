<template>
    <div v-if="!play" class="w-screen h-screen grid grid-rows-[auto,1fr,1fr] relative">
        <div>
            <div @click="play = !play; currentIndex = startIndex;"
                class="bg-blue-500 top-0 flex items-center justify-center sticky p-2 text-center hover:bg-blue-400 cursor-pointer">
                {{ play ? 'Build' : 'Play' }}
            </div>
            <div class="bg-blue-300 p-2 cursor-pointer flex justify-center items-center" @click="nodes = {}">clear
                cookies
            </div>
            <div class="bg-blue-200 p-2 cursor-pointer flex justify-center items-center"
                @click="download(nodes, 'nodes', 'application/json')">Export nodes
            </div>
            <div class="bg-blue-200 p-2 cursor-pointer flex justify-center items-center" @click="importJSON">Import
                nodes
            </div>
        </div>

        <div class="p-8 justify-center items-center flex-col gap-4 flex h-full">
            <div :class="{ 'hover:border-2 border-blue-500': isLinking && key != linkFrom.node }" @click="endLink(key)"
                class="bg-gray-200 flex-col w-fit p-2 gap-2 flex" v-for="(node, key) in nodes">
                <div class="flex justify-between">
                    <p>Id: {{ key }}</p>
                    <div class="cursor-pointer" @click="play = true; currentIndex = key">Play ></div>
                    <div @click="delete nodes[key]" class="text-red-500 cursor-pointer">X</div>

                </div>
                Text: <textarea v-model="node.text" type="text"></textarea>
                <p>Choices:</p>
                <div class="cursor-pointer" @click="addChoice(key)">+ Add choice</div>

                <div class="flex gap-2 justify-between" v-for="(choice, index) in node.choices">
                    <span>Choice {{ index }}</span>
                    <input v-model="choice.text" type="text"> <span v-if="!choice.link" class="cursor-pointer"
                        @click.stop="startLink(key, index)">Link</span> <span v-else>-> {{ choice.link
                        }}</span><span @click="node.choices.pop(index)" class="text-red-500 cursor-pointer">X</span>
                </div>
                <div v-if="!node.callback" class="cursor-pointer" @click="addCallback(key)">+ Add callback</div>
                <div class="flex gap-2 justify-between" v-else>
                    Delay
                    <input v-model="node.callback.delay" type="text"> <span v-if="!node.callback.link"
                        class="cursor-pointer" @click.stop="startLink(key, index)">Link</span> <span v-else>-> {{
                            node.callback.link }}</span><span @click="node.callback = null"
                        class="text-red-500 cursor-pointer">X</span>
                </div>
            </div>
            <div class="cursor-pointer" @click="addNode">+ Add node</div>
        </div>
    </div>

    <div v-else>
        <div
            class="w-screen h-screen grid grid-rows-[1fr,100px] relative grid-cols-1 bg-neutral-900 flex-col p-4  gap-4 ">


            <div class="text-[#4AF626] flex items-center justify-center p-8">
                <div class="flex gap-2 w-[40ch]">
                    <span>></span>
                    <div class="font-mono">{{ typed_text }}<span
                            class="animate-[blink-caret_1s_infinite] border-neutral-900 border h-5 w-0 ml-[2px]">
                        </span>
                    </div>
                </div>



            </div>
            <div class="flex items-center justify-evenly">
                <div v-if="!isTyping"
                    class="p-1 z-10 cursor-pointer text-purple-500 hover:ring-2 ring-purple-500 rounded-md"
                    @click="currentIndex = choice.link" v-for="(choice, index) in nodes?.[currentIndex]?.choices">
                    {{ choice.text }}
                </div>
                <!-- <div class="cursor-pointer right-2 bottom-2 text-white"
                    @click="currentIndex = startIndex; restartType()">
                    Restart
                </div> -->


            </div>

            <div class="absolute w-screen h-screen ">
                <Paperclip ref="paperclip" class="z-[8] top-0  absolute" />

                <button v-if="(11 < currentIndex && currentIndex < 14 || currentIndex == 16) && !isTyping"
                    @click="addClip" class=" text-[#4AF626]  w-full absolute bottom-20 cursor-pointer p-2 z-10">Make
                    paperclips</button>
                <button @click="stopClips" v-if="currentIndex == 30"
                    class=" text-red-500 w-full absolute bottom-20 cursor-pointer p-2 z-10">EMERGENCY
                    STOP</button>
            </div>
            <div v-if="currentIndex == 31"
                class="absolute w-screen h-screen flex justify-center items-center z-10 bg-black">
                <div class="text-red-500">I'm afraid I can't do that</div>
            </div>



        </div>


    </div>


    <div>

    </div>


</template>

<script setup>
import node_file from '../nodes.json'
import { ref } from 'vue'
const paperclip = ref(null)
const play = ref(false)
const nodes = ref(node_file)
//const nodes = ref(useCookie('nodes', { default: () => ref({}) }))
const currentIndex = ref(null)
const paperclip_count = ref(0)

function addClip() {
    paperclip.value.addClip()
    paperclip_count.value++
}


function stopClips() {
    clearInterval(clip_interval.value)
    currentIndex.value++
}

function progressiveInterval(initialTime, decreaseFactor, callbackFunction, stopCondition) {
    let currentInterval = initialTime;
    let ratio = 1
    function intervalFunction() {
        // Check the stop condition
        // if (stopCondition()) {
        //     console.log('Interval stopped');
        //     return; // Exit the function and stop further execution
        // }
        // Execute the passed callback function
        callbackFunction();

        // Decrease the interval time
        currentInterval = currentInterval - decreaseFactor / ratio;
        ratio += 0.01
        // Set a new interval with the smaller time
        clip_interval.value = setTimeout(intervalFunction, currentInterval);
    }

    // Start the first interval
    clip_interval.value = setTimeout(intervalFunction, currentInterval);
}

function addNode() {
    nodes.value[Object.keys(nodes.value).length] = {
        text: '',
        choices: [],
        callback: null
    }
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
    return 60
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
runCallback(currentIndex.value)

// Type text when entering new node
watch(currentIndex, async (newIndex, oldIndex) => {
    restartType()
    typeText()
    if (currentIndex.value == 24) {
        paperclip_count.value = 0
        botClips()
    }
})

const clip_interval = ref(null)

function botClips() {
    progressiveInterval(500, 10, () => {
        addClip()

    })
}

watch(paperclip_count, async (newCount, oldIndex) => {
    if (currentIndex.value < 18) {
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
    const response = await fetch('/api/save-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nodes.value)
    });
}

// Run callback after text has been typed
watch(isTyping, (newValue) => {
    if (!newValue) {
        runCallback(currentIndex.value)
    }
});

function addCallback(key) {
    nodes.value[key].callback = {
        delay: null,
        link: '',
    }
}

function addChoice(key) {
    nodes.value[key].choices.push({
        text: '',
        link: ''
    })
}

function startLink(node, choice) {
    isLinking.value = true
    linkFrom.value.node = node
    linkFrom.value.choice = choice

}

function endLink(node) {

    if (isLinking.value) {
        if (linkFrom.value.choice != null) {
            nodes.value[linkFrom.value.node].choices[parseInt(linkFrom.value.choice)].link = node

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
