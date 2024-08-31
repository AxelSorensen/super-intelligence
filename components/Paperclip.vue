<template>
  <div class="relative w-dvw h-dvh overflow-hidden">
    <canvas id="canvas" :class="[currentIndex < 19 ? 'hidden' : 'absolute']" class="top-0 pointer-events-none"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Matter from 'matter-js';
import "pathseg";
import decomp from "poly-decomp";
import clone from 'clone';
import { useWindowSize } from '@vueuse/core';
defineProps({
  currentIndex: Number,
});



const { width, height } = useWindowSize();
const engine = Matter.Engine.create();
const world = engine.world;

let render;
let runner;
let resizeListener;

const paths = [
  // Your SVG paths here
];



const vertexSets = paths.map((path) => {
  const newElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  newElement.setAttribute("d", path);
  const points = Matter.Svg.pathToVertices(newElement, 30);
  return Matter.Vertices.scale(points, 0.1, 0.1);
});

const clip = vertexSets.map((vertices, i) => {
  return Matter.Bodies.fromVertices(
    width.value / 2 + i * 150,
    height.value / 2 + i * 50,
    vertices,
    {
      isSensor: true,
      render: {
        fillStyle: "#4AF626",
        strokeStyle: "#4AF626",
      },
    },
    true
  );
});

import paperclipImage from '../assets/paperclip.png';

function clearWorld() {
  Matter.Composite.clear(world, true, true);
}

function addClip() {
  const newClip = Matter.Bodies.circle(width.value / 2, height.value / 1.5, 10, {
    render: {
      sprite: {
        texture: paperclipImage,
        xScale: .04,
        yScale: .04,
      }
    },
    isSensor: true,
  });

  Matter.World.add(world, newClip);

  setTimeout(() => {
    Matter.World.remove(world, newClip);
  }, 3000);

  Matter.Body.applyForce(newClip, { x: newClip.position.x, y: newClip.position.y }, { x: Math.random() * 0.01 - 0.005, y: Math.random() * -0.001 - 0.015 });
  Matter.Body.setAngularVelocity(newClip, Math.random() * 0.2 - 0.1);
}

function initializeMatter() {
  if (!render) {
    const canvas = document.getElementById('canvas');

    render = Matter.Render.create({
      element: document.body,
      engine: engine,
      canvas: canvas,
      options: {
        background: 'transparent',
        width: width.value,
        height: height.value,
        wireframes: false,
      },
    });
    Matter.Render.run(render);

    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    resizeListener = () => {
      render.canvas.width = width.value;
      render.canvas.height = height.value;
    };
    window.addEventListener("resize", resizeListener);
  }
}

onMounted(() => {
  initializeMatter();
});

onBeforeUnmount(() => {
  if (render) {
    Matter.Render.stop(render);
    Matter.Runner.stop(runner);
    window.removeEventListener("resize", resizeListener);
    render.canvas.remove();
  }
});

defineExpose({
  addClip,
})
</script>

<style scoped>
/* Add any styles you need */
</style>