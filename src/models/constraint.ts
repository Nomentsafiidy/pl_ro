import { Variables, FunctionAffine, Sign } from "src/models/pl.type";
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
      `^([\+|\-]?)([0-9]{1,})(${Constraint.variables.x})([\+|\-|\*|\/]{1,1})([\+|\-]?)([0-9]{1,})(${Constraint.variables.y})((\=)|(\<\=)|(\>\=)|(\<)|(\>)){1,1}([0-9]{1,})$`
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
    // if (tmp) {
    //   this.funcAffine = {
    //     x: {
    //       sign: tmp[1] !== "" ? tmp[1] : "+",
    //       constant: tmp[2] ? parseFloat(tmp[2]) : 0,
    //       parameter: tmp[3],
    //     },
    //     y: {
    //       sign: tmp[5] !== "" ? tmp[5] : "+",
    //       constant: tmp[6] ? parseFloat(tmp[6]) : 0,
    //       parameter: tmp[7],
    //     },
    //     arithOper: tmp[4],
    //     condiOper: tmp[8],
    //     c: parseFloat(tmp[14]),
    //   };
    //   console.log(this.funcAffine);
    // }
  }

  public getFuncAffine(): FunctionAffine {
    return this.funcAffine;
  }

  //   getPoints(): Point[] {
  //     let points: Point[] = [];
  //     points.push(this.getPointByX(this.getFuncAffine(), 0));
  //     points.push(this.getPointByY(this.getFuncAffine(), 0));
  //     return points;
  //   }

  //   getNotSolutionsPoints(): Point[] {
  //     let notSolution: Point[] = [];
  //     let points: Point[] = this.getPoints();
  //     let possibleSolutions = [
  //       {
  //         x: 0,
  //         y: Number.POSITIVE_INFINITY,
  //       },
  //       {
  //         ...points[0],
  //       },
  //       {
  //         x: 0,
  //         y: 0,
  //       },
  //       {
  //         ...points[1],
  //       },
  //       {
  //         x: Number.POSITIVE_INFINITY,
  //         y: 0,
  //       },
  //       {
  //         x: Number.POSITIVE_INFINITY,
  //         y: Number.POSITIVE_INFINITY,
  //       },
  //     ];
  //     if (this.getFuncAffine()) {
  //       possibleSolutions.forEach((ps) => {
  //         switch (this.getFuncAffine().condiOper) {
  //           case "=":
  //             if (
  //               this.calculate(this.getFuncAffine(), ps.x, ps.y) !==
  //               this.getFuncAffine().c
  //             ) {
  //               notSolution.push(ps);
  //             }
  //             break;
  //           case "<=":
  //             if (
  //               this.calculate(this.getFuncAffine(), ps.x, ps.y) >=
  //               this.getFuncAffine().c
  //             ) {
  //               notSolution.push(ps);
  //             }
  //             break;
  //           case ">=":
  //             if (
  //               this.calculate(this.getFuncAffine(), ps.x, ps.y) <=
  //               this.getFuncAffine().c
  //             ) {
  //               notSolution.push(ps);
  //             }
  //             break;
  //           case "<":
  //             if (
  //               this.calculate(this.getFuncAffine(), ps.x, ps.y) >=
  //               this.getFuncAffine().c
  //             ) {
  //               notSolution.push(ps);
  //             }
  //             break;
  //           case ">":
  //             if (
  //               this.calculate(this.getFuncAffine(), ps.x, ps.y) <=
  //               this.getFuncAffine().c
  //             ) {
  //               notSolution.push(ps);
  //             }
  //             break;
  //         }
  //       });
  //     }
  //     return notSolution;
  //   }

  //   getPointByX(func: FunctionAffine, x: number): Point {
  //     let tmpPoint: Point = {
  //       x: x,
  //       y: 0,
  //     };
  //     if (func) {
  //       if (func.x.sign === "-") {
  //         func.x.constant = -1 * func.x.constant;
  //       }
  //       if (func.y.sign === "-") {
  //         func.y.constant = -1 * func.y.constant;
  //       }
  //       if (func.y.constant !== 0) {
  //         switch (func.arithOper) {
  //           case "+":
  //             tmpPoint.y = (func.c - func.x.constant * x) / func.y.constant;
  //             break;
  //           case "*":
  //             tmpPoint.y = func.c / (func.y.constant * func.x.constant * x);
  //             break;
  //           case "-":
  //             tmpPoint.y = (func.c + func.x.constant * x) / func.y.constant;
  //             break;
  //           case "/":
  //             tmpPoint.y = (func.c * func.x.constant * x) / func.y.constant;
  //             break;
  //         }
  //       }
  //     }
  //     return tmpPoint;
  //   }

  //   getPointByY(func: FunctionAffine, y: number): Point {
  //     let tmpPoint: Point = {
  //       x: 0,
  //       y: y,
  //     };
  //     if (func) {
  //       if (func.x.sign === "-") {
  //         func.x.constant = -1 * func.x.constant;
  //       }
  //       if (func.y.sign === "-") {
  //         func.y.constant = -1 * func.y.constant;
  //       }
  //       if (func.x.constant !== 0) {
  //         switch (func.arithOper) {
  //           case "+":
  //             tmpPoint.x = (func.c - func.y.constant * y) / func.x.constant;
  //             break;
  //           case "*":
  //             tmpPoint.x = func.c / (func.x.constant * func.y.constant * y);
  //             break;
  //           case "-":
  //             tmpPoint.x = (func.c + func.y.constant * y) / func.x.constant;
  //             break;
  //           case "/":
  //             tmpPoint.x = (func.c * func.y.constant * y) / func.x.constant;
  //             break;
  //         }
  //       }
  //     }
  //     return tmpPoint;
  //   }

  //   private calculate(func: FunctionAffine, x: number, y: number): number {
  //     let tmpX: number = func.x.sign === "+" ? x : -1 * x;
  //     let tmpY: number = func.y.sign === "+" ? y : -1 * y;
  //     let result: number = 0;
  //     switch (func.arithOper) {
  //       case "+":
  //         result = func.x.constant * tmpX + func.y.constant * tmpY;
  //         break;
  //       case "*":
  //         result = func.x.constant * tmpX * (func.y.constant * tmpY);
  //         break;
  //       case "-":
  //         result = func.x.constant * tmpX - func.y.constant * tmpY;
  //         break;
  //       case "/":
  //         result = (func.x.constant * tmpX) / (func.y.constant * tmpY);
  //         break;
  //     }
  //     return result;
  //   }
}
