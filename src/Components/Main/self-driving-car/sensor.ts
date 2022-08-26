import { Car } from './car';
import { Point } from './types';
import { getIntersection, lerp } from './utils';

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: Point[][];
  readings: any;
  constructor(car: Car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Point[][]) {
    this._castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this._getReading(this.rays[i], roadBorders));
    }
  }

  private _getReading(ray: Point[], roadBorders: Point[][]) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) touches.push(touch);
    }

    if (!touches.length) return null;
    else {
      // const offsets = touches.map((t) => t.offset);
      // const minOffset = Math.min(...offsets);
      // return touches.find((t) => t.offset === minOffset);
      return touches.reduce((prevT, currT) =>
        currT.offset < prevT.offset ? currT : prevT
      );
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) end = this.readings[i];

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  private _castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }
}
