import {sheetMesh,meshTriangles} from './paper-flex.js?v=polish-20261030-1';
import {materialSVG} from './paper-materials.js?v=polish-20261030-1';

const vertex=`attribute vec3 position;attribute vec2 uv;attribute float facing;
uniform vec2 viewport;uniform float perspective;varying vec2 texcoord;varying float normal;
void main(){float w=1.0-position.z/perspective;gl_Position=vec4(position.x*2.0/viewport.x-1.0,1.0-position.y*2.0/viewport.y,-position.z/3000.0,w);texcoord=uv;normal=facing;}`;
const fragment=`precision mediump float;uniform sampler2D front;uniform sampler2D back;uniform vec2 repeats;varying vec2 texcoord;varying float normal;
void main(){vec4 ink=normal<0.0?texture2D(front,vec2(1.0-texcoord.x,texcoord.y)):texture2D(back,fract(texcoord*repeats));float light=0.77+0.23*abs(normal);gl_FragColor=vec4(ink.rgb*light,1.0);}`;

function shader(gl,type,source) {
  const value=gl.createShader(type);gl.shaderSource(value,source);gl.compileShader(value);
  if(!gl.getShaderParameter(value,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(value));
  return value;
}

async function reversePicture(theme) {
  const image=new Image();image.src='data:image/svg+xml,'+encodeURIComponent(materialSVG(theme));await image.decode();
  const tile=document.createElement('canvas');tile.width=tile.height=theme.unit;
  const ctx=tile.getContext('2d');ctx.fillStyle=theme.paper;ctx.fillRect(0,0,tile.width,tile.height);ctx.globalAlpha=theme.opacity;ctx.drawImage(image,0,0);
  return tile;
}

/** A connected mesh, so content bends with the surface rather than rotating as one rectangle. */
export async function flexiblePaper(picture,theme,pose) {
  const width=innerWidth,height=innerHeight;
  const canvas=document.createElement('canvas');canvas.className='paper-flex';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl) throw Error('WebGL unavailable');
  const scale=Math.min(devicePixelRatio,1.5,2048/width,2048/height);canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
  const program=gl.createProgram(),vs=shader(gl,gl.VERTEX_SHADER,vertex),fs=shader(gl,gl.FRAGMENT_SHADER,fragment);
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);gl.viewport(0,0,canvas.width,canvas.height);gl.enable(gl.DEPTH_TEST);
  const vertices=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertices);gl.bufferData(gl.ARRAY_BUFFER,65*17*24,gl.DYNAMIC_DRAW);
  for(const [name,size,offset]of[['position',3,0],['uv',2,12],['facing',1,20]]) {
    const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,24,offset);
  }
  const indices=meshTriangles(),elements=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elements);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
  const textures=[];
  for(const [unit,name,source]of[[0,'front',picture],[1,'back',await reversePicture(theme)]]) {
    const texture=gl.createTexture();textures.push(texture);gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);gl.uniform1i(gl.getUniformLocation(program,name),unit);
  }
  gl.uniform2f(gl.getUniformLocation(program,'viewport'),width,height);gl.uniform1f(gl.getUniformLocation(program,'perspective'),Math.max(1800,width*2.4));
  gl.uniform2f(gl.getUniformLocation(program,'repeats'),width/(theme.unit*pose.printScale),height/(theme.unit*pose.printScale));
  document.body.append(canvas);
  const duration=1650,started=performance.now();let raf=0;
  function draw(progress) {
    const mesh=sheetMesh(width,height,pose,progress);canvas.dataset.progress=progress.toFixed(3);canvas.dataset.bend=mesh.bend.toFixed(3);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.bindBuffer(gl.ARRAY_BUFFER,vertices);gl.bufferSubData(gl.ARRAY_BUFFER,0,mesh.vertices);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
  }
  function finish() {
    cancelAnimationFrame(raf);canvas.remove();textures.forEach(texture=>gl.deleteTexture(texture));gl.deleteBuffer(vertices);gl.deleteBuffer(elements);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
  }
  // Pausable clock for deterministic browser capture; ordinary playback uses requestAnimationFrame.
  canvas.paperClock={time:null,draw};
  try {
    await new Promise((resolve,reject)=>{
      const tick=now=>{
        try {
          const interrupted=innerWidth!==width||innerHeight!==height||matchMedia('(prefers-reduced-motion: reduce)').matches;
          const progress=interrupted ? 1 : canvas.paperClock.time??Math.min(1,(now-started)/duration);draw(progress);
          if(progress<1)raf=requestAnimationFrame(tick);else resolve();
        }catch(error){reject(error);}
      };
      raf=requestAnimationFrame(tick);
    });
  }catch(error){finish();throw error;}
  return finish;
}
