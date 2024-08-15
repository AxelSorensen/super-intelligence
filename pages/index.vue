<template>
    <div v-if="!play" class="w-dvw h-dvh grid grid-rows-[auto,1fr,1fr] relative">
        <div>
            <div @click="play = !play; currentIndex = startIndex;"
                class="bg-blue-500 top-0 flex items-center justify-center sticky p-2 text-center hover:bg-blue-400 cursor-pointer">
                {{ play ? 'Build' : 'Play' }}
            </div>
            <div class="bg-blue-300 p-2 cursor-pointer flex justify-center items-center" @click="nodes = []">clear
                cookies
            </div>
            <div class="bg-blue-200 p-2 cursor-pointer flex justify-center items-center"
                @click="download(nodes, 'nodes', 'application/json')">Export nodes
            </div>
            <div class="bg-blue-200 p-2 cursor-pointer flex justify-center items-center" @click="importJSON">Import
                nodes
            </div>
        </div>

        <div class="p-8 justify-center items-center flex-col flex h-full">

            <div class="flex flex-col" v-for="(node, key) in nodes">
                <div :class="[isLinking && key != linkFrom.node ? 'hover:border-2 border-blue-500' : null, isAdded(key) ? 'bg-blue-100' : isDeleted(key) ? 'bg-red-100' : 'bg-gray-200']"
                    @click="endLink(key)" class=" flex-col w-fit p-2 gap-2 flex">
                    <div class="flex justify-between">
                        <p>Id: {{ key }}</p>
                        <div class="cursor-pointer" @click="play = true; currentIndex = key; restartType()">Play ></div>
                        <div @click="deleteNode(key)" class="text-red-500 cursor-pointer">X</div>

                    </div>
                    Text: <textarea v-model="node.text" type="text"></textarea>
                    <p>Choices:</p>
                    <div class="flex gap-2 justify-between" v-for="(choice, index) in node.choices">
                        <span>Choice {{ index }}</span>
                        <input v-model="choice.text" type="text"> <span v-if="choice.link == null"
                            class="cursor-pointer" @click.stop="startLink(key, index)">Link</span> <span v-else>-> {{
                                choice.link
                            }}</span><span @click="node.choices.splice(index,1)" class="text-red-500 cursor-pointer">X</span>
                    </div>

                    <div class="cursor-pointer" @click="addChoice(key)">+ Add choice</div>
                    <div v-if="!node.callback" class="cursor-pointer" @click="addCallback(key)">+ Add callback</div>
                    <div class="flex gap-2 justify-between" v-else>
                        Delay
                        <input v-model="node.callback.delay" type="text"> <span v-if="node.callback.link == null"
                            class="cursor-pointer" @click.stop="startLink(key, index)">Link</span> <span v-else>-> {{
                                node.callback.link }}</span><span @click="node.callback = null"
                            class="text-red-500 cursor-pointer">X</span>
                    </div>
                    <div v-if="node.tag == null" class="cursor-pointer" @click="addTag(node)">+ Add tag</div>
                    <div class="flex gap-2 justify-between" v-else>
                        Tag
                        <input v-model="node.tag" type="text"><span @click="node.tag = null"
                            class="text-red-500 cursor-pointer">X</span>
                    </div>

                </div>
                <div class="flex justify-center text-gray-400 text-xl cursor-pointer" @click="addNode(key)">
                    +
                </div>
            </div>
            <div v-if="!nodes.length" class="flex justify-center text-gray-400 text-xl cursor-pointer"
                @click="addNode(-1)">
                +
            </div>
        </div>

    </div>

    <div v-else>
        <div class="w-dvw h-dvh grid grid-rows-[1fr,100px] relative grid-cols-1 bg-neutral-900 flex-col p-4  gap-4 ">


            <div :class="[hasTag('bad_guy') ? 'text-red-500 z-10 absolute bottom-40' : 'text-[#4AF626]']"
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
            <div class="flex items-center justify-evenly">
                <div v-if="!isTyping"
                    class="p-1 z-10 cursor-pointer text-purple-500 hover:ring-2 ring-purple-500 rounded-md"
                    @click="currentIndex = choice.link" v-for="(choice, index) in nodes?.[currentIndex]?.choices">
                    {{ choice.text }}
                </div>
                <div class="absolute left-4 z-10 top-4 gap-4 flex">
                    <div class="cursor-pointer  text-white" @click="play = !play;">
                        < Back </div>
                            <div class="cursor-pointer  text-white" @click="currentIndex = 0; restartType()">
                                Restart
                            </div>
                    </div>


                </div>


                <div class="absolute w-dvw h-dvh flex justify-center">
                    <Paperclip ref="paperclip" class="z-[8] top-0  absolute" />

                    <button v-if="nodes[currentIndex]?.tag == 'clip_button' && !isTyping" @click="addClip"
                        class=" text-[#4AF626]  w-full absolute bottom-20 cursor-pointer p-2 z-10">Make
                        paperclips</button>
                    <button @click="stopClips" v-if="hasTag('stop_button') && !isTyping"
                        :class="{ 'bottom-20': hasTag('stop_bottom'), 'top-20': hasTag('stop_top'), 'top-[100px] left-6': hasTag('stop_left'), 'bottom-[100px] right-6': hasTag('stop_works') }"
                        class=" text-white hover:bg-red-600 bg-red-700 w-auto absolute cursor-pointer p-4 z-10">EMERGENCY
                        STOP</button>
                </div>




            </div>


        </div>



        <div>

        </div>


</template>

<script setup>
import node_file from '../nodes.json'
const nodes = ref(node_file)
import { ref } from 'vue'
const paperclip = ref(null)
const play = ref(false)
//const nodes = ref(useCookie('nodes', { default: () => ref({}) }))
const currentIndex = ref(null)
const paperclip_count = ref(0)

function addClip() {
    paperclip.value.addClip()
    paperclip_count.value++
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
