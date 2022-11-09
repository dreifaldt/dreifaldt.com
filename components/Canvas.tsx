import React, { Suspense, useEffect, useState } from 'react'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model } from '../public/assets/Model'

export const Canvas = () => {
  return (
    <ThreeCanvas
      camera={{ position: [5, 12, 22.25], fov: 15 }}
      style={{
        position: 'absolute',
        backgroundColor: 'black',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
      }}
    >
      <ambientLight intensity={1.25} />
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.4} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </ThreeCanvas>
  )
}
