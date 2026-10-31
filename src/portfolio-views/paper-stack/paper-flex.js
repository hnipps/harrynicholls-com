const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};

/** Inextensible strips with a travelling bend. Each row integrates its own tangent angle. */
export function sheetMesh(width,height,pose,time,columns=64,rows=16) {
  const t=Math.max(0,Math.min(1,time));
  const travel=1-(1-smooth(t/.8))**3,turn=-Math.PI*smooth((t-.08)/.8);
  const envelope=Math.sin(Math.PI*smooth(t));
  const bend=1.65*envelope;
  const lift=Math.min(width*.22,180)*envelope;
  const rz=pose.angle*Math.PI/180*(1-travel)-.08*envelope;
  const ca=Math.cos(rz),sa=Math.sin(rz);
  const startAngle=pose.angle*Math.PI/180;
  const startX=pose.x+Math.cos(startAngle)*width/2-Math.sin(startAngle)*height/2;
  const startY=pose.y+Math.sin(startAngle)*width/2+Math.cos(startAngle)*height/2;
  const cx=startX+(width/2-startX)*travel,cy=startY+(height/2-startY)*travel;
  const data=new Float32Array((columns+1)*(rows+1)*6);
  for(let row=0;row<=rows;row++) {
    const v=row/rows,curve=[];
    let x=0,z=0;
    for(let col=0;col<=columns;col++) {
      const u=col/columns;
      const theta=turn+bend*(2*u-1)+envelope*.45*(v-.5)*Math.sin(Math.PI*u);
      curve.push({x,z,theta});
      const tangent=turn+bend*(2*(u+.5/columns)-1)+envelope*.45*(v-.5)*Math.sin(Math.PI*(u+.5/columns));
      x+=Math.cos(tangent)*width/columns;z+=Math.sin(tangent)*width/columns;
    }
    const middle=curve[columns/2];
    curve.forEach((point,col)=>{
      const u=col/columns,px=point.x-middle.x;
      const py=(v-.5)*height+envelope*Math.min(55,height*.055)*Math.sin(Math.PI*u)*(v-.5);
      const at=(row*(columns+1)+col)*6;
      data.set([cx+ca*px-sa*py,cy+sa*px+ca*py,point.z-middle.z+lift,u,v,Math.cos(point.theta)],at);
    });
  }
  return {vertices:data,bend};
}

export function meshTriangles(columns=64,rows=16) {
  const indices=[];
  for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
    const a=row*(columns+1)+col,b=a+columns+1;
    indices.push(a,b,a+1,a+1,b,b+1);
  }
  return new Uint16Array(indices);
}
