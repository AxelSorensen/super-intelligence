<template>
    <div class="w-screen h-screen grid grid-rows-[60px,40px,1fr,1fr]">
        <div @click="play = !play; currentIndex = 0;"
            class="bg-blue-500 top-0 flex items-center justify-center sticky p-2 text-center hover:bg-blue-400 cursor-pointer">
            {{ play ? 'Build' : 'Play' }}
        </div>
        <div class="bg-blue-300 cursor-pointer flex justify-center items-center" @click="nodes = {}">clear cookies</div>

        <div v-if="!play" class="p-8 justify-center items-center flex-col gap-4 flex h-full">
            <div :class="{ 'hover:border-2 border-blue-500': isLinking && key != linkFrom.node }" @click="endLink(key)"
                class="bg-gray-200 flex-col w-fit p-2 gap-2 flex" v-for="(node, key) in nodes">
                <p>Id: {{ key }}</p>
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

        <div class="w-screen flex justify-between bg-neutral-900 flex-col p-4  gap-4 " v-else>


            <div class="text-[#4AF626;]">
                <div class="font-mono max-w-[40ch]">{{ typed_text }}<span
                        class="animate-[blink-caret_1s_infinite] border-neutral-900 border h-5 w-0 ml-[2px]">
                    </span>
                </div>



            </div>
            <div class="flex relative items-center gap-2">
                <div v-if="!isTyping" class="p-1 cursor-pointer text-purple-500 hover:ring-2 ring-purple-500 rounded-md"
                    @click="currentIndex = choice.link" v-for="(choice, index) in nodes?.[currentIndex]?.choices">
                    {{ choice.text }}
                </div>
                <div class="cursor-pointer absolute right-2 bottom-2 text-white"
                    @click="currentIndex = 0; restartType()">
                    Restart
                </div>
                <img src="../public/paperclip.png" alt="" class="absolute size-5 fly" />
            </div>


        </div>

    </div>


    <div>

    </div>



</template>

<script setup>
import { ref } from 'vue'

const play = ref(false)
const nodes = ref(useCookie('nodes', { default: () => ref({}) }))
const currentIndex = ref(null)

function addNode() {
    nodes.value[Object.keys(nodes.value).length] = {
        text: '',
        choices: [],
        callback: null
    }
}

const typed_text = ref('')

const isTyping = ref(false)


const charIndex = ref(0)


function restartType() {
    charIndex.value = 0
    typed_text.value = ''
    setTimeout(() => typeText(), 100)
}

function typeText() {

    if (charIndex.value < nodes.value[currentIndex.value].text.length) {
        isTyping.value = true
        setTimeout(typeText, 100 + ((Math.random() - 0.5) * 50));
        typed_text.value += nodes.value[currentIndex.value].text[charIndex.value];
        charIndex.value++;
    } else {
        setTimeout(() => isTyping.value = false, 200)

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
})

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





const isLinking = ref(false)

</script>

<style lang="scss" scoped></style>