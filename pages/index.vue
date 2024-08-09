<template>
  <div class="flex flex-col">
    <div ref="scene">

    </div>
    <button class="text-white hover:bg-blue-900 font-thin bg-blue-950 p-2" @click="addForce">Make
      Paperclip</button>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Matter from 'matter-js';
import { useWindowSize } from '@vueuse/core'
const scene = ref(null);
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Body = Matter.Body

// create an engine

// create two boxes and a ground

// var ground = Bodies.rectangle(400, 400, 810, 60, { isStatic: true });
var engine = Engine.create();
// ground.render.visible = false;
const { width, height } = useWindowSize()

function addForce() {
  var box = Bodies.circle(width.value / 2, height.value / 2, 5);
  box.collisionFilter = {
    group: 0,
    category: BOX_CATEGORY,
    mask: GROUND_CATEGORY
  };
  Composite.add(engine.world, [box]);
  Body.applyForce(box, { x: box.position.x, y: box.position.y }, { x: Math.random() * 0.001 - 0.0005, y: Math.random() * - 0.001 - 0.002 })
}
// add all of the bodies to the world
const BOX_CATEGORY = 0x0001;
const GROUND_CATEGORY = 0x0002;

// Set collision filters for the ground
// ground.collisionFilter = {
//   group: 0,
//   category: GROUND_CATEGORY,
//   mask: BOX_CATEGORY
// };

// Set collision filters for the boxes


onMounted(() => {
  // Create an engine


  // create a renderer
  var render = Render.create({
    element: scene.value,
    engine: engine,
    options: {
      pixelRatio: 2,
      width: window.innerWidth,
      height: window.innerHeight - 40,
      wireframes: false,
    },
  });


  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
});


</script>

<style></style>