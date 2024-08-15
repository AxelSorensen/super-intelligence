<template>
    <div class="flex flex-col">
        <canvas id="canvas"></canvas>
        <button class="text-white absolute hover:bg-blue-900 font-thin bg-blue-950 p-2" @click="addClip">Make
            Paperclip</button>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import Matter from 'matter-js';
import "pathseg";
import decomp from "poly-decomp"
import clone from 'clone'
import { useWindowSize } from '@vueuse/core';
const scene = ref(null);
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Vertices = Matter.Vertices,
    Svg = Matter.Svg,
    Common = Matter.Common,
    World = Matter.World

window.decomp = decomp;
const { width, height } = useWindowSize()
// create an engine
// var ground = Bodies.rectangle(400, 400, 810, 60, { isStatic: true });
var engine = Engine.create();
// ground.render.visible = false;

const world = engine.world
// create two boxes and a ground
const paths = [
    "M289.05,84.63L98.225,308.136c-6.35,7.44-9.126,17.291-7.594,26.954l10.514,66.144c1.32,8.312,8.484,14.441,16.901,14.44h66.971c9.785,0,19.079-4.283,25.434-11.725l206.015-241.29c5.93-6.943,5.104-17.379-1.841-23.305l-42.83-36.57c-6.946-5.928-17.38-5.104-23.31,1.837l-152.4,178.477c-3.312,3.872-1.941,7.557-0.754,15.562c0.647,4.358,4.409,7.572,8.817,7.528c8.201-0.082,11.959,0.677,15.254-3.186l104.745-122.653l30.031,25.641l-108.396,126.93c-5.823,6.821-14.307,10.795-23.272,10.904h-40.639c-10.349,0.124-19.191-6.943-20.691-17.18l-5.896-40.215c-1.304-8.875,1.292-17.878,7.118-24.697L321.757,75.111c18.261-21.39,50.409-23.929,71.803-5.664l50.576,43.18c21.395,18.265,23.932,50.414,5.666,71.806L235.457,435.479c-10.447,12.243-25.735,19.284-41.83,19.271h-89.321c-19.688-0.012-36.449-14.382-39.549-33.821l-14.072-88.213c-2.53-15.89,2.027-32.097,12.479-44.339L259.017,58.988L289.05,84.63z"
];

var vertexSets = []

const clip = paths.map((path, i) => {
    var newElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    newElement.setAttribute("d", path);

    var points = Svg.pathToVertices(newElement, 30);
    vertexSets.push(Vertices.scale(points, 0.1, 0.1));

    return Bodies.fromVertices(
        width.value / 2 + i * 150,
        height.value / 2 + i * 50,
        vertexSets,
        {

            isSensor: true,
            render: {
                fillStyle: "#4AF626",
                strokeStyle: "#4AF626",

            }
        },
        true
    )
})


import paperclipImage from '../assets/paperclip.png';

function addClip() {

    // const new_clip = clone(clip)
    const new_clip = Bodies.circle(width.value / 2, height.value / 2, 10, {
        render: {
            sprite: {
                texture: paperclipImage,
                xScale: .04,
                yScale: .04,
            }
        },
        isSensor: true,
    })
    World.add(
        world,
        new_clip
    )


    Body.applyForce(new_clip, { x: new_clip.position.x, y: new_clip.position.y }, { x: Math.random() * 0.005 - 0.0025, y: Math.random() * - 0.001 - 0.01 })
    Body.setAngularVelocity(new_clip, Math.random() * 0.2 - 0.1);
}


// add all of the bodies to the world

// Set collision filters for the ground
// ground.collisionFilter = {
//   group: 0,
//   category: GROUND_CATEGORY,
//   mask: BOX_CATEGORY
// };

// Set collision filters for the boxes

onMounted(() => {
    // Create an engine
    const { width, height } = useWindowSize()
    var canvas = document.getElementById('canvas');
    // create a renderer

    var render = Render.create({
        element: document.body,
        canvas: canvas,
        engine: engine,
        options: {
            background: 'transparent',

            // pixelRatio: 'auto',
            wireframes: false,

        },
    });

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // run the engine
    Runner.run(runner, engine);
});








</script>

<style></style>