export type Point = {
  x: number;
  y: number;
};

export type Variables = {
  x: string;
  y: string;
};

export enum Sign {
  PLUS = "+",
  MINUS = "-",
}

export enum ArithOper {
  PLUS = "+",
  MINUS = "-",
  MULT = "*",
  DIV = "/",
}

export enum CondiOper {
  EQUAL = "=",
  INF = "<",
  SUP = ">",
  INFOREQUAL = "<=",
  SUPOREQUAL = ">=",
}

export type Operand = {
  sign: Sign;
  constant: number;
  parameter: string;
};

export type FunctionAffineConstant = {
  value: number;
  sign: Sign;
};

export type FunctionAffine = {
  x: Operand; //x
  y: Operand; //y
  arithOper: ArithOper; // arithmeticOperator
  condiOper: CondiOper; // conditionalOperator
  c: FunctionAffineConstant; //constant
};
