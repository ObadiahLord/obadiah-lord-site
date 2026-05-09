'use client'

import { useEffect, useRef } from 'react'

/**
 * Original WebGL2 water simulation that gave the "moving through water" look.
 * Restored with two fixes:
 *   1. gl.disable(BLEND) before every FBO write so splat / update / decay
 *      outputs replace the texture instead of accumulating into it.
 *   2. When the mouse has been idle for ~60ms, the wave equation step is
 *      replaced with a pure decay pass so existing waves fade in place
 *      without continuing to propagate and accumulate.
 */
export default function RippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true })
    if (!gl) return
    if (!gl.getExtension('EXT_color_buffer_float')) return

    const SIM_SCALE = 0.5
    let simW = 1, simH = 1, viewW = 1, viewH = 1
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
      return s
    }
    const program = (vs: string, fs: string) => {
      const p = gl.createProgram()!
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs))
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs))
      gl.linkProgram(p)
      return p
    }

    const vsrc = `#version 300 es
      in vec2 a;
      out vec2 v;
      void main() { v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }
    `

    // Wave equation: h_new = (N + S + E + W) * 0.5 - h_prev, then damp.
    const updateFs = `#version 300 es
      precision highp float;
      in vec2 v;
      out vec4 outColor;
      uniform sampler2D u_state;
      uniform vec2 u_texel;
      uniform float u_damp;
      void main() {
        vec4 c = texture(u_state, v);
        float n = texture(u_state, v + vec2(0.0,  u_texel.y)).r;
        float s = texture(u_state, v + vec2(0.0, -u_texel.y)).r;
        float e = texture(u_state, v + vec2( u_texel.x, 0.0)).r;
        float w = texture(u_state, v + vec2(-u_texel.x, 0.0)).r;
        float newH = (n + s + e + w) * 0.5 - c.g;
        newH *= u_damp;
        outColor = vec4(newH, c.r, 0.0, 1.0);
      }
    `

    // Splat: gaussian impulse scaled by mouse velocity, added on top of state.
    const splatFs = `#version 300 es
      precision highp float;
      in vec2 v;
      out vec4 outColor;
      uniform sampler2D u_state;
      uniform vec2 u_pos;
      uniform float u_radius;
      uniform float u_force;
      uniform vec2 u_aspect;
      void main() {
        vec4 c = texture(u_state, v);
        vec2 d = (v - u_pos) * u_aspect;
        float falloff = exp(-dot(d, d) / (u_radius * u_radius));
        c.r += u_force * falloff;
        outColor = c;
      }
    `

    // Pure decay: no spatial sampling, multiply state down. Used when idle so
    // waves fade in place instead of propagating outward forever.
    const decayFs = `#version 300 es
      precision highp float;
      in vec2 v;
      out vec4 outColor;
      uniform sampler2D u_state;
      uniform float u_k;
      void main() {
        vec4 c = texture(u_state, v);
        outColor = c * u_k;
      }
    `

    // Render: heightmap normal lit on near white paper, premultiplied alpha
    // so the canvas is fully transparent when the heightmap is at rest.
    const renderFs = `#version 300 es
      precision highp float;
      in vec2 v;
      out vec4 outColor;
      uniform sampler2D u_state;
      uniform vec2 u_texel;
      void main() {
        float l  = texture(u_state, v - vec2(u_texel.x, 0.0)).r;
        float r  = texture(u_state, v + vec2(u_texel.x, 0.0)).r;
        float dn = texture(u_state, v - vec2(0.0, u_texel.y)).r;
        float up = texture(u_state, v + vec2(0.0, u_texel.y)).r;
        vec3 normal = normalize(vec3((l - r) * 6.0, (dn - up) * 6.0, 1.0));

        vec3 light = normalize(vec3(0.4, 0.55, 0.85));
        float diff = clamp(dot(normal, light), 0.0, 1.0);
        float spec = pow(clamp(dot(normal, normalize(light + vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 22.0);

        float h = texture(u_state, v).r;
        float energy = clamp(abs(h) * 5.0 + spec * 0.5, 0.0, 1.0);

        float shade = 1.0 - abs(h) * 0.45 + (diff - 0.78) * 0.10 + spec * 0.20;
        shade = clamp(shade, 0.82, 1.10);

        float a = energy * 0.55;
        outColor = vec4(vec3(shade) * a, a);
      }
    `

    const updateProg = program(vsrc, updateFs)
    const splatProg = program(vsrc, splatFs)
    const decayProg = program(vsrc, decayFs)
    const renderProg = program(vsrc, renderFs)

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const bindAttr = (prog: WebGLProgram) => {
      gl.useProgram(prog)
      const a = gl.getAttribLocation(prog, 'a')
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(a)
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
    }

    type FBO = { fb: WebGLFramebuffer; tex: WebGLTexture }
    let fboA: FBO, fboB: FBO

    const makeTex = (w: number, h: number) => {
      const t = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      return t
    }
    const makeFBO = (w: number, h: number): FBO => {
      const tex = makeTex(w, h)
      const fb = gl.createFramebuffer()!
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      gl.viewport(0, 0, w, h)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      return { fb, tex }
    }

    const resize = () => {
      viewW = Math.floor(canvas.clientWidth * dpr)
      viewH = Math.floor(canvas.clientHeight * dpr)
      canvas.width = viewW
      canvas.height = viewH
      simW = Math.max(1, Math.floor(viewW * SIM_SCALE))
      simH = Math.max(1, Math.floor(viewH * SIM_SCALE))
      fboA = makeFBO(simW, simH)
      fboB = makeFBO(simW, simH)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false }
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1 - e.clientY / window.innerHeight
      mouse.moved = true
    }
    window.addEventListener('mousemove', onMove)

    const splat = (x: number, y: number, force: number) => {
      bindAttr(splatProg)
      gl.disable(gl.BLEND)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fb)
      gl.viewport(0, 0, simW, simH)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fboA.tex)
      gl.uniform1i(gl.getUniformLocation(splatProg, 'u_state'), 0)
      gl.uniform2f(gl.getUniformLocation(splatProg, 'u_pos'), x, y)
      gl.uniform1f(gl.getUniformLocation(splatProg, 'u_radius'), 0.014)
      gl.uniform1f(gl.getUniformLocation(splatProg, 'u_force'), force)
      gl.uniform2f(gl.getUniformLocation(splatProg, 'u_aspect'), simW / simH, 1.0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      ;[fboA, fboB] = [fboB, fboA]
    }

    const update = () => {
      bindAttr(updateProg)
      gl.disable(gl.BLEND)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fb)
      gl.viewport(0, 0, simW, simH)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fboA.tex)
      gl.uniform1i(gl.getUniformLocation(updateProg, 'u_state'), 0)
      gl.uniform2f(gl.getUniformLocation(updateProg, 'u_texel'), 1 / simW, 1 / simH)
      gl.uniform1f(gl.getUniformLocation(updateProg, 'u_damp'), 0.992)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      ;[fboA, fboB] = [fboB, fboA]
    }

    const decay = () => {
      bindAttr(decayProg)
      gl.disable(gl.BLEND)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fb)
      gl.viewport(0, 0, simW, simH)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fboA.tex)
      gl.uniform1i(gl.getUniformLocation(decayProg, 'u_state'), 0)
      gl.uniform1f(gl.getUniformLocation(decayProg, 'u_k'), 0.55)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      ;[fboA, fboB] = [fboB, fboA]
    }

    // Hard reset of the heightmap. Called when the cursor wakes up after a
    // long idle so a new splash starts on a clean surface instead of stacking
    // onto the leftover state from the previous interaction.
    const clearState = () => {
      gl.disable(gl.BLEND)
      for (const f of [fboA, fboB]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fb)
        gl.viewport(0, 0, simW, simH)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
    }

    const render = () => {
      bindAttr(renderProg)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, viewW, viewH)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fboA.tex)
      gl.uniform1i(gl.getUniformLocation(renderProg, 'u_state'), 0)
      gl.uniform2f(gl.getUniformLocation(renderProg, 'u_texel'), 1 / simW, 1 / simH)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    let raf = 0
    let lastMoveAt = -Infinity
    const tick = () => {
      const dx = mouse.x - mouse.px
      const dy = mouse.y - mouse.py
      const speed = Math.hypot(dx, dy)
      const now = performance.now()
      if (mouse.moved && speed > 0.0006) {
        // If the cursor has been idle long enough that previous waves should
        // be gone, clear the surface so the new splash starts fresh and does
        // not stack onto leftover state from the previous interaction.
        if (now - lastMoveAt > 350) clearState()
        // Original force curve: speed * 80, capped at 1.4. Rich organic swirls.
        const force = -Math.min(speed * 80.0, 1.4)
        splat(mouse.x, mouse.y, force)
        lastMoveAt = now
      }
      mouse.px = mouse.x
      mouse.py = mouse.y
      mouse.moved = false

      const idle = now - lastMoveAt > 60
      if (idle) {
        decay()
        decay()
      } else {
        update()
        update()
      }
      render()
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9999, mixBlendMode: 'multiply' }}
    />
  )
}
