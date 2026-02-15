<script lang="ts">
  import * as THREE from 'three'

  let container: HTMLDivElement | undefined = $state()

  $effect(() => {
    if (!container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 300

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const cols = 80
    const rows = 50
    const spacing = 20
    const count = cols * rows
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const idx = (i * cols + j) * 3
        const x = (j - cols / 2) * spacing
        const y = (i - rows / 2) * spacing
        positions[idx] = x
        positions[idx + 1] = y
        positions[idx + 2] = 0
        basePositions[idx] = x
        basePositions[idx + 1] = y
        basePositions[idx + 2] = 0
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const vertexShader = `
      uniform vec2 uMouse;
      uniform float uInfluenceRadius;
      uniform float uMaxDisplacement;
      varying float vDisplacement;

      void main() {
        vec3 pos = position;
        float dist = distance(pos.xy, uMouse);
        float influence = exp(-dist * dist / (2.0 * uInfluenceRadius * uInfluenceRadius));
        float displacement = influence * uMaxDisplacement;
        pos.z += displacement;
        vDisplacement = displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = mix(1.5, 3.0, influence);
      }
    `

    const fragmentShader = `
      varying float vDisplacement;
      uniform float uMaxDisplacement;

      void main() {
        float t = clamp(vDisplacement / uMaxDisplacement, 0.0, 1.0);
        float alpha = mix(0.15, 0.6, t);
        vec3 color = vec3(0.133, 0.827, 0.933);
        gl_FragColor = vec4(color, alpha);
      }
    `

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMouse: { value: new THREE.Vector2(9999, 9999) },
        uInfluenceRadius: { value: 150.0 },
        uMaxDisplacement: { value: 15.0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let mouseX = 9999
    let mouseY = 9999

    const onMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return
      const rect = container!.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * cols * spacing
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * rows * spacing
    }

    const onTouchMove = (e: TouchEvent) => {
      if (reducedMotion || !e.touches[0]) return
      const rect = container!.getBoundingClientRect()
      mouseX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * cols * spacing
      mouseY = -((e.touches[0].clientY - rect.top) / rect.height - 0.5) * rows * spacing
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let rafId = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      material.uniforms.uMouse.value.set(mouseX, mouseY)
      renderer.render(scene, camera)
    }

    if (reducedMotion) {
      material.uniforms.uMouse.value.set(9999, 9999)
      renderer.render(scene, camera)
    } else {
      animate()
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width === 0 || height === 0) continue
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        if (reducedMotion) {
          renderer.render(scene, camera)
        }
      }
    })
    observer.observe(container)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      observer.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  })
</script>

<div bind:this={container} class="absolute inset-0 pointer-events-none"></div>
