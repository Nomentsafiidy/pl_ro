import {
  Variables,
  FunctionAffine,
  ArithOper,
  CondiOper,
  Point,
} from "src/models/pl.type";
//fonction affine
// ax+ by = c
export class Constraint {
  private id: number;
  private static variables: Variables;
  private static funcRegExp: RegExp;
  private funcString: string;
  private funcAffine!: FunctionAffine;

  constructor(id: number, func: string) {
    this.id = id;
    this.funcString = func;
    Constraint.funcRegExp = new RegExp("");
  }

  public static setVariables = (variables: Variables) => {
    Constraint.variables = variables;
    Constraint.funcRegExp = new RegExp(
      `^([\+|\-]?)([0-9]{0,})(${Constraint.variables.x})([\+|\-|\*|\/]{1,1})([\+|\-]?)([0-9]{0,})(${Constraint.variables.y})((\=)|(\<\=)|(\>\=)){1,1}([\+|\-]?)([0-9]{1,})$`
    );
  };

  public static getVariables = () => {
    return Constraint.variables;
  };

  public getId = (): number => {
    return this.id;
  };

  public setId = (id: number): void => {
    this.id = id;
  };

  public getFuncString = (): string => {
    return this.funcString;
  };

  public setFuncString = (func: string): void => {
    this.funcString = func;
    if (this.isContrainte()) {
      this.setFunctionAffine(Constraint.funcRegExp, this.funcString);
    }
  };

  public isContrainte = (): boolean => {
    if (Constraint.funcRegExp.test(this.funcString)) {
      return true;
    } else {
      return false;
    }
  };

  private setFunctionAffine(reg: RegExp, func: string) {
    let tmp = func.match(reg);
    console.log(" *** func *** ", tmp);
    if (tmp) {
      let tmpC: number, tmpCY: number, tmpCX: number;
      tmpCX =
        tmp[1] === "-"
          ? tmp[2]
            ? -1 * parseFloat(tmp[2])
            : -1 * 1
          : parseFloat(tmp[2] ? tmp[2] : "1");
      tmpCY =
        tmp[5] === "-"
          ? tmp[6]
            ? -1 * parseFloat(tmp[6])
            : -1 * 1
          : parseFloat(tmp[6] ? tmp[6] : "1");
      tmpC = tmp[12] === "-" ? -1 * parseFloat(tmp[13]) : parseFloat(tmp[13]);
      this.funcAffine = {
        x: {
          constant: tmpCX,
          parameter: tmp[3],
        },
        y: {
          constant: tmpCY,
          parameter: tmp[7],
        },
        arithOper: tmp[4] as ArithOper,
        condiOper: tmp[8] as CondiOper,
        c: tmpC,
      };
      console.log("this.funcAffine", this.funcAffine);
    }
  }

  public getFuncAffine(): FunctionAffine {
    return this.funcAffine;
  }

  getGraphPoints(): Point[] {
    let points: Point[] = [];
    let tmpAffin = this.getFuncAffine();
    if (tmpAffin) {
      if (tmpAffin.x.constant === 0 && tmpAffin.y.constant === 0) {
        console.log(" [ Error : Constant null ] all value is solution or not");
      } else if (tmpAffin.x.constant === 0) {
        points = [
          {
            x: Number.NEGATIVE_INFINITY,
            y: tmpAffin.c / tmpAffin.y.constant,
          },
          {
            x: Number.POSITIVE_INFINITY,
            y: tmpAffin.c / tmpAffin.y.constant,
          },
        ];
      } else if (tmpAffin.y.constant === 0) {
        points = [
          {
            x: tmpAffin.c / tmpAffin.x.constant,
            y: Number.NEGATIVE_INFINITY,
          },
          {
            x: tmpAffin.c / tmpAffin.x.constant,
            y: Number.POSITIVE_INFINITY,
          },
        ];
      } else {
        console.log("else");
        points.push(this.getPointByX(tmpAffin, Number.NEGATIVE_INFINITY));
        points.push(this.getPointByX(tmpAffin, Number.POSITIVE_INFINITY));
      }
    }

    console.log("points", points);
    return points;
  }

  getXYIntersectionPoints(): Point[] {
    let points: Point[] = [];
    points.push(this.getPointByX(this.getFuncAffine(), 0));
    points.push(this.getPointByY(this.getFuncAffine(), 0));
    return points;
  }

  getNotSolutionsPoints(maxX: number, maxY: number): Point[] {
    let notSolution: Point[] = [];
    let points: Point[] = this.getXYIntersectionPoints();
    let possibleSolutions: Point[] = [];
    if (
      points[0].x >= 0 &&
      points[0].y >= 0 &&
      points[1].x >= 0 &&
      points[1].y >= 0
    ) {
      possibleSolutions = [
        {
          x: 0,
          y: maxY,
        },
        {
          x: points[0].x,
          y: points[0].y,
        },
        {
          x: 0,
          y: 0,
        },
        {
          x: points[1].x,
          y: points[1].y,
        },
        {
          x: maxX,
          y: 0,
        },
        {
          x: maxX,
          y: maxY,
        },
      ];

      console.log("three" + 1, possibleSolutions);
    } else if (
      points[0].x >= 0 &&
      points[0].y >= 0 &&
      (points[1].x <= 0 || points[1].y <= 0)
    ) {
      possibleSolutions = [
        {
          x: 0,
          y: maxY,
        },
        {
          x: points[0].x,
          y: points[0].y,
        },
        {
          x: 0,
          y: 0,
        },
        {
          ...this.getPointByY(this.funcAffine, maxY),
        },
        {
          x: maxX,
          y: 0,
        },
        {
          x: maxX,
          y: maxY,
        },
      ];

      console.log("three" + 2, possibleSolutions);
    } else if (
      (points[0].x <= 0 || points[0].y <= 0) &&
      points[1].x >= 0 &&
      points[1].y >= 0
    ) {
      possibleSolutions = [
        {
          x: 0,
          y: maxY,
        },
        {
          x: 0,
          y: 0,
        },
        {
          ...this.getPointByY(this.funcAffine, 0),
        },
        {
          x: maxX,
          y: 0,
        },
        {
          x: maxX,
          y: maxY,
        },
      ];

      console.log("three" + 3, possibleSolutions);
    } else {
      possibleSolutions = [
        {
          x: 0,
          y: maxY,
        },
        {
          x: 0,
          y: 0,
        },
        {
          x: maxX,
          y: 0,
        },
        {
          x: maxX,
          y: maxY,
        },
      ];

      console.log("three" + 4, possibleSolutions);
    }
    if (this.getFuncAffine()) {
      possibleSolutions.forEach((ps) => {
        switch (this.getFuncAffine().condiOper) {
          case "=":
            notSolution.push(ps);
            break;
          case "<=":
            console.log("case <= || < ");

            if (
              this.calculate(this.getFuncAffine(), ps.x, ps.y) >=
              this.getFuncAffine().c
            ) {
              notSolution.push(ps);
            }
            break;
          case ">=":
            console.log("case >= || > ");
            if (
              this.calculate(this.getFuncAffine(), ps.x, ps.y) <=
              this.getFuncAffine().c
            ) {
              notSolution.push(ps);
            }
            break;
          default:
            console.log("default", this.getFuncAffine().condiOper);

            break;
        }
      });
    }
    return notSolution;
  }

  getPointByX(func: FunctionAffine, x: number): Point {
    let tmpPoint: Point = {
      x: x,
      y: 0,
    };
    if (func) {
      switch (func.arithOper) {
        case "+":
          tmpPoint.y = (func.c + -1 * func.x.constant * x) / func.y.constant;
          console.log("tmpPoint.y", tmpPoint.y);
          break;
        case "-":
          tmpPoint.y =
            (func.c + -1 * func.x.constant * x) / (-1 * func.y.constant);
          break;
      }
    }
    return tmpPoint;
  }

  getPointByY(func: FunctionAffine, y: number): Point {
    let tmpPoint: Point = {
      x: 0,
      y: y,
    };
    if (func) {
      switch (func.arithOper) {
        case "+":
          tmpPoint.x = (func.c + -1 * func.y.constant * y) / func.x.constant;
          console.log("tmpPoint.y", tmpPoint.y);
          break;
        case "-":
          tmpPoint.y =
            (func.c + -1 * func.y.constant * y) / (-1 * func.x.constant);
          break;
      }
    }
    return tmpPoint;
  }

  private calculate(func: FunctionAffine, x: number, y: number): number {
    let result: number = 0;
    if (x === Number.POSITIVE_INFINITY && y === Number.NEGATIVE_INFINITY) {
      return Number.POSITIVE_INFINITY;
    } else {
      switch (func.arithOper) {
        case "+":
          result = func.x.constant * x + func.y.constant * y;
          break;
        case "-":
          result = func.x.constant * x + -1 * func.y.constant * y;
          break;
      }
    }
    return result;
  }
}
