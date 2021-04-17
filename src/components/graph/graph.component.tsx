import { Constraint } from "src/models/constraint";
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
  margin?: number;
  pointSpace?: number;
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

export function GraphComponent(props: GraphProps) {
  let margin = props.margin ? props.margin : 50;
  let pointSpace = props.pointSpace ? props.pointSpace : 50;
  let width: number = calculateWidth(pointSpace, margin, props.max);
  let heigth: number = calculateHeigth(pointSpace, margin, props.max);
  return (
    <>
      <svg style={{ width: width, height: heigth }}>
        <rect style={{ fill: "red", width: width, height: heigth }}></rect>
        <g>
          <path
            className="g_axe"
            d={getAxeXPath(pointSpace, margin, props.max)}
          ></path>
          <path
            className="g_axe"
            d={getAxeYPath(pointSpace, margin, props.max)}
          ></path>
        </g>
        {/* <path
          className="g_axes"
          d={getAxesPath(svgWidth, svgHeigth, margin)}
        ></path>
        <g>
          <text
            x={margin - 16}
            y={svgHeigth - 50 + 16}
            className="g_axes_point_origin"
          >
            0
          </text>
        </g>
        <g className="g_y_point">
          {numbersArray(props.maxY).map((n) => (
            <text
              x={margin - 16}
              y={svgHeigth - 50 - 50 * n}
              className="g_axes_point"
            >
              {n}
            </text>
          ))}
        </g>
        <g className="g_y_point">
          {numbersArray(props.maxX).map((n) => (
            <text
              x={margin + 50 * n}
              y={svgHeigth - 50 + 16}
              className="g_axes_point"
            >
              {n}
            </text>
          ))}
        </g>
        {props.constraints.map((constraint, id) => (
          <g>
            <path
              key={id}
              className="g_function"
              d={getPointPath(
                svgHeigth,
                margin,
                pointSpace,
                props.maxX,
                props.maxY,
                constraint.getPoints()
              )}
            ></path>
            {
              <path
                className="g_fill"
                d={getPointPath(
                  svgHeigth,
                  margin,
                  pointSpace,
                  props.maxX,
                  props.maxY,
                  constraint.getNotSolutionsPoints()
                )}
              ></path>
            }
          </g>
        ))} */}
        {/* {<path
              className='g_function'
              d={getPointPath(svgHeigth, margin, pointSpace, [
                  { x: 0, y: 3 },
                  { x: 3, y: 0 },
              ])}
          ></path>} */}

        {
          //not solution
          /* <path
          className='g_fill'
          d={getPointPath(svgHeigth, margin, pointSpace, [
              { x: 0, y: 3 },
              { x: 3, y: 0 },
              { x: 5, y: 0 },
              { x: 5, y: 5 },
              { x: 0, y: 5 },
              { x: 0, y: 3 },
          ])}
      ></path> */
        }
      </svg>
    </>
  );
}
