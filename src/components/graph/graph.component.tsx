import { render } from "@testing-library/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Constraint } from "src/models/constraint";
import { EconomicFunction } from "src/models/economic_function";
import { Point } from "src/models/pl.type";
import "./graph.css";
type Max = {
  posX: number;
  posY: number;
  negX: number;
  negY: number;
};

type GraphProps = {
  max: Max;
  constraints: Constraint[];
  ecoFunc: EconomicFunction;
  margin?: number;
  pointSpace?: number;
  ref: any;
};

function calculateWidth(space: number, margin: number, max: Max) {
  return margin * 2 + max.posX * space + space * (-1 * max.negX);
}

function calculateHeigth(space: number, margin: number, max: Max) {
  return margin * 2 + max.posY * space + space * (-1 * max.negY);
}

// svg function
function getAxeXPath(space: number, margin: number, max: Max): string {
  return `M ${margin} ${margin + max.posY * space} l ${
    max.posX * space + space * (-1 * max.negX)
  } 0 `;
}

function getAxeYPath(space: number, margin: number, max: Max): string {
  return `M ${margin + space * (-1 * max.negX)} ${margin} l 0 ${
    max.posY * space + space * (-1 * max.negY)
  } `;
}

function getOriginX(space: number, margin: number, max: Max): number {
  return margin + space * (-1 * max.negX);
}

function getOriginY(space: number, margin: number, max: Max): number {
  return margin + space * max.posY;
}

function numbersArray(i: number, n: number): number[] {
  let tmp: number[] = [];
  while (i <= n) {
    tmp.push(i);
    i++;
  }
  return tmp;
}

function getPointPath(
  margin: number,
  space: number,
  max: Max,
  constraint: Constraint,
  func: string
): string {
  let path = "";
  let o = {
    x: getOriginX(margin, space, max),
    y: getOriginY(margin, space, max),
  };
  let tmpPoints: Point[] = [];
  if (func === "getGraphPoints") {
    tmpPoints = constraint.getGraphPoints();
  } else if (func === "getNotSolutionsPoints") {
    tmpPoints = constraint.getNotSolutionsPoints(max.posX, max.posY);
  }
  let tmpP: Point;
  if (tmpPoints.length !== 0) {
    path += "M ";
    tmpPoints.forEach((point, index) => {
      // console.log("true point", point);

      if (
        point.y === Number.NEGATIVE_INFINITY ||
        point.y === Number.POSITIVE_INFINITY
      ) {
        tmpP = constraint.getPointByY(
          constraint.getFuncAffine(),
          point.y === Number.NEGATIVE_INFINITY ? max.negY : max.posY
        );
      } else if (
        point.x === Number.NEGATIVE_INFINITY ||
        point.x === Number.POSITIVE_INFINITY
      ) {
        tmpP = constraint.getPointByX(
          constraint.getFuncAffine(),
          point.x === Number.NEGATIVE_INFINITY ? max.negX : max.posX
        );
      } else {
        tmpP = point;
      }
      path += `${o.x + space * tmpP.x} ${o.y + -1 * space * tmpP.y}`;
      if (index !== tmpPoints.length - 1) {
        path += " L ";
      }
    });
  }
  return path;
}
function getZPath(
  margin: number,
  space: number,
  max: Max,
  z: EconomicFunction
): string {
  let path = "";
  let o = {
    x: getOriginX(margin, space, max),
    y: getOriginY(margin, space, max),
  };
  let tmpPoints: Point[] = [];
  tmpPoints = z.getGraphPoints(max);
  if (tmpPoints.length !== 0) {
    path += "M ";
    tmpPoints.forEach((point, index) => {
      path += `${o.x + space * point.x} ${o.y + -1 * space * point.y}`;
      if (index !== tmpPoints.length - 1) {
        path += " L ";
      }
    });
  }
  return path;
}

export const GraphComponent = forwardRef((props: GraphProps, ref) => {
  let margin = props.margin ? props.margin : 50;
  let pointSpace = props.pointSpace ? props.pointSpace : 50;
  let width: number = calculateWidth(pointSpace, margin, props.max);
  let heigth: number = calculateHeigth(pointSpace, margin, props.max);

  let zLine = useRef(null);

  const [solution, setSolutionState] = useState({ cx: -1, cy: -1 });

  useImperativeHandle(ref, () => ({
    resolve() {
      let possibleSolution: Point[] = [
        {
          x: 0,
          y: 0,
        },
        {
          x: 0,
          y: Number.POSITIVE_INFINITY,
        },
        {
          x: Number.POSITIVE_INFINITY,
          y: 0,
        },
        {
          x: Number.POSITIVE_INFINITY,
          y: Number.POSITIVE_INFINITY,
        },
      ];
      props.constraints.forEach((constraint) => {
        if (constraint.isContrainte()) {
          possibleSolution = constraint.getPossibleSolution(possibleSolution);
        }
      });
      // props.constraints.forEach((constraint) => {
      //   if (constraint.isContrainte()) {
      //     possibleSolution = constraint.getPossibleSolution(possibleSolution);
      //   }
      // });
      console.log("possibleSolution", possibleSolution);
      let c: number = 0;
      let solution: Point[] = [];
      if (possibleSolution.length !== 0) {
        possibleSolution.forEach((point) => {
          if (props.ecoFunc.calculate(point.x, point.y) > c) {
            c = props.ecoFunc.calculate(point.x, point.y);
            solution = [point];
          } else if (props.ecoFunc.calculate(point.x, point.y) === c) {
            solution.push(point);
          }
        });
      } else {
        alert("Pas de solution");
      }
      //many solution
      if (solution.length > 1) {
        alert("Pusieur solution");
      } else {
        //get path
        // let path = "";
        let o = {
          x: getOriginX(margin, pointSpace, props.max),
          y: getOriginY(margin, pointSpace, props.max),
        };
        // let tmpPoints: Point[] = [];
        // tmpPoints = z.getGraphPoints(max);
        // if (tmpPoints.length !== 0) {
        //   path += "M ";
        //   tmpPoints.forEach((point, index) => {
        //     path += `${o.x + space * point.x} ${o.y + -1 * space * point.y}`;
        //     if (index !== tmpPoints.length - 1) {
        //       path += " L ";
        //     }
        //   });
        // }
        let current = zLine.current;

        console.log("ref", current);
        // debugger;
        if (current) {
          setSolutionState({
            cx: o.x * solution[0].x,
            cy: o.y * solution[0].y,
          });
          console.log("set state");

          // (current as any).setAttribute("x", o.x * solution[0].x);
          // (current as any).setAttribute("y", o.y * solution[0].y);
        }
      }
      console.log("solution", solution);
      console.log("ref", zLine);
    },
  }));

  return (
    <>
      <svg style={{ width: width, height: heigth }}>
        <g>
          <path
            key={"axeX"}
            className="g_axe"
            d={getAxeXPath(pointSpace, margin, props.max)}
          ></path>
          <path
            key={"axeY"}
            className="g_axe"
            d={getAxeYPath(pointSpace, margin, props.max)}
          ></path>
        </g>
        <g>
          <g>
            <text
              key={"axe0"}
              x={getOriginX(pointSpace, margin, props.max)}
              y={getOriginY(pointSpace, margin, props.max)}
              className="g_axes_point"
            >
              0
            </text>
          </g>
          <g className="g_y_point">
            {numbersArray(1, props.max.posY).map((n, i) => (
              <text
                key={"posy" + i.toString()}
                x={getOriginX(pointSpace, margin, props.max)}
                y={getOriginY(pointSpace, margin, props.max) - pointSpace * n}
                className="g_axes_point"
              >
                {n}
              </text>
            ))}
            {numbersArray(props.max.negY, -1).map((n, i) => (
              <text
                key={"negy" + i.toString()}
                x={getOriginX(pointSpace, margin, props.max)}
                y={
                  getOriginY(pointSpace, margin, props.max) +
                  pointSpace * -1 * n
                }
                className="g_axes_point"
              >
                {n}
              </text>
            ))}
          </g>
          <g className="g_x_point">
            {numbersArray(1, props.max.posX).map((n, i) => (
              <text
                key={"posx" + i.toString()}
                x={getOriginX(pointSpace, margin, props.max) + pointSpace * n}
                y={getOriginY(pointSpace, margin, props.max)}
                className="g_axes_point"
              >
                {n}
              </text>
            ))}
            {numbersArray(props.max.negX, -1).map((n, i) => (
              <text
                key={"negx" + i.toString()}
                x={getOriginX(pointSpace, margin, props.max) + pointSpace * n}
                y={getOriginY(pointSpace, margin, props.max)}
                className="g_axes_point"
              >
                {n}
              </text>
            ))}
          </g>
        </g>
        {props.constraints.map((constraint, id) => (
          <g key={"gfs" + id.toString()}>
            <path
              key={"func" + id.toString()}
              className="g_fill"
              d={getPointPath(
                margin,
                pointSpace,
                props.max,
                constraint,
                "getNotSolutionsPoints"
              )}
              fill={constraint.getColor()}
            ></path>
            <path
              key={"fl" + id.toString()}
              className="g_function"
              d={getPointPath(
                margin,
                pointSpace,
                props.max,
                constraint,
                "getGraphPoints"
              )}
              stroke={constraint.getColor()}
            ></path>
          </g>
        ))}
        <g>
          <path
            dx={solution.cx !== -1 ? solution.cx : undefined}
            dy={solution.cy !== -1 ? solution.cy : undefined}
            ref={zLine}
            className="g_function"
            d={getZPath(margin, pointSpace, props.max, props.ecoFunc)}
            stroke={props.ecoFunc.getColor()}
          ></path>
        </g>
      </svg>
    </>
  );
});
