"use client";
import React, { useEffect, useRef } from "react";
import { visibleAnimation } from "@/lib/visible-animation";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2  r  = iResolution.xy;
  float t  = iTime;
  vec3  FC = vec3(fragCoord, t);
  vec4  o  = vec4(0.0);

  vec3 p, a;
  float z = 0.0;
  float d = 0.0;

  for (float i = 0.0; i < 100.0; i++)
  {
    p = z * normalize(FC.rgb * 2.0 - r.xyy);
    a = normalize(cos(vec3(4.0, 2.0, 0.0) + t - d * 10.0));
    p.z += 8.0;
    a = a * dot(a, p) - cross(a, p);
    for (float k = 1.0; k < 5.0; k += 1.0) {
      a += sin(a * k + t).yzx / k;
    }
    d = abs(length(a) - 5.0) / 6.0;
    z += d;
    o += vec4(3.0, 8.0, z, 0.0) / max(d, 1e-4) / 9e4;
  }

  // Tint towards gold (#FFD700)
  vec3 gold = vec3(1.0, 0.84, 0.0);
  vec3 mixed = mix(o.rgb, gold * o.rgb * 1.5, 0.4);

  fragColor = vec4(mixed, 1.0);
}

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function Nucleus() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const glCtx = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!glCtx) return;
    const gl: WebGL2RenderingContext = glCtx;

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) return;

    const program = link(gl, vs, fs);
    if (!program) return;
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    // This is a soft, low-opacity background. More pixels add GPU cost, not detail.
    const pixelBudget = mobile ? 96000 : 240000;
    const applySize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const scale = Math.min(1, Math.sqrt(pixelBudget / (width * height)));
      canvas.width = Math.max(1, Math.floor(width * scale));
      canvas.height = Math.max(1, Math.floor(height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(0);
    };
    function draw(time: number) {
      if (uRes) gl.uniform3f(uRes, canvas.width, canvas.height, 1);
      if (uTime) gl.uniform1f(uTime, time / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const resize = new ResizeObserver(applySize);
    resize.observe(canvas);
    applySize();
    const stopAnimation = visibleAnimation(canvas, draw, mobile ? 12 : 24);

    return () => {
      stopAnimation();
      resize.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ background: "black" }}
    />
  );
}
