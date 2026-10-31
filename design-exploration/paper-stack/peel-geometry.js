/** A sheet is clipped at the crease; its lifted portion reflects across that same crease. */
export function clipHalfPlane(points, normal, distance, keepFront) {
  const signed = point => (point.x * normal.x + point.y * normal.y - distance) * (keepFront ? 1 : -1);
  const result = [];
  for (let i = 0; i < points.length; i += 1) {
    const start = points[i], end = points[(i + 1) % points.length];
    const a = signed(start), b = signed(end);
    if (a >= 0) result.push(start);
    if ((a >= 0) !== (b >= 0)) {
      const ratio = a / (a - b);
      result.push({ x:start.x + (end.x - start.x) * ratio, y:start.y + (end.y - start.y) * ratio });
    }
  }
  return result;
}

export function curvedOutline(points, radius, fixedPoints=[]) {
  if (points.length < 3) return '';
  const round = (point, toward) => {
    if (fixedPoints.includes(point)) return point;
    const length = Math.hypot(toward.x - point.x, toward.y - point.y);
    const ratio = Math.min(radius / Math.max(1, length), .2);
    return { x:point.x + (toward.x - point.x) * ratio, y:point.y + (toward.y - point.y) * ratio };
  };
  const edges = points.map((point, i) => ({
    point,
    before:round(point, points[(i + points.length - 1) % points.length]),
    after:round(point, points[(i + 1) % points.length])
  }));
  return edges.map((edge, i) => `${i ? 'L' : 'M'}${edge.before.x},${edge.before.y} Q${edge.point.x},${edge.point.y} ${edge.after.x},${edge.after.y}`).join(' ') + ' Z';
}

export function peelGeometry(width, height, pointer, scrollY=0) {
  const length = Math.hypot(pointer.x, pointer.y);
  const normal = length > .01 ? { x:pointer.x / length, y:pointer.y / length } : { x:Math.SQRT1_2, y:Math.SQRT1_2 };
  const distance = length / 2;
  const rectangle = [{ x:0,y:0 },{ x:width,y:0 },{ x:width,y:height },{ x:0,y:height }];
  const viewport = rectangle.map(point => ({ x:point.x,y:point.y + scrollY }));
  const remaining = clipHalfPlane(viewport, normal, distance, true).map(point => ({ x:point.x,y:point.y - scrollY }));
  const lifted = clipHalfPlane(rectangle, normal, distance, false);
  const folded = lifted.map(point => {
    const offset = 2 * (distance - point.x * normal.x - point.y * normal.y);
    return { x:point.x + normal.x * offset, y:point.y + normal.y * offset };
  });
  // A barely lifted corner stands up off the page, so seen from above it is foreshortened toward
  // the crease; a long drag pulls it flat. The shadow falls where the flat flap would land.
  const flatness = Math.min(1, Math.max(0, (length - 90) / 330));
  const reach = .62 + .38 * flatness * flatness * (3 - 2 * flatness);
  const curled = lifted.map((point, i) => {
    const offset = (1 + reach) * (distance - point.x * normal.x - point.y * normal.y);
    if (Math.abs(offset) < 1e-6) return folded[i];
    return { x:point.x + normal.x * offset, y:point.y + normal.y * offset };
  });
  // The crease endpoints are attached to the sheet; only free corners can curl.
  const contacts = curled.filter(point => Math.abs(point.x * normal.x + point.y * normal.y - distance) < .01);
  const radius = Math.min(18, length * .07);
  return {
    normal, distance, remaining, folded, reach,
    clip:remaining.length > 2 ? `polygon(${remaining.map(point => `${point.x}px ${point.y}px`).join(',')})` : 'polygon(0 0,0 0,0 0)',
    path:length < 1 ? '' : curvedOutline(curled, radius, contacts),
    shadowPath:length < 1 ? '' : curvedOutline(folded, radius * 1.6, folded.filter(point => contacts.some(contact => Math.hypot(contact.x - point.x, contact.y - point.y) < .01))),
    tip:{ x:normal.x * distance * (1 + reach), y:normal.y * distance * (1 + reach) },
    center:{ x:normal.x * distance, y:normal.y * distance }
  };
}
