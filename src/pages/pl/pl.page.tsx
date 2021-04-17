import { Component } from "react";
import { Constraint } from "src/models/constraint";
//models / type imports
import { Variables, Point } from "src/models/pl.type";
//components imports
import { ConstraintComponent } from "src/components/constraint/constraint.component";
import { VariableComponent } from "src/components/variable/variable.component";
import { GraphComponent } from "src/components/graph/graph.component";

type PlPageSate = {
  max: {
    posX: number;
    posY: number;
    negX: number;
    negY: number;
  };
  variables: Variables;
  constraints: Constraint[];
};

export class PLPage extends Component<any, PlPageSate> {
  constructor(props: any) {
    super(props);
    this.state = {
      max: {
        posX: 0,
        posY: 0,
        negX: 0,
        negY: 0,
      },
      variables: {
        x: "",
        y: "",
      },
      constraints: [new Constraint(0, "")],
    };

    //function reference
    this.handleVarChange = this.handleVarChange.bind(this);
    this.removeConstraint = this.removeConstraint.bind(this);
    this.constraintChange = this.constraintChange.bind(this);
    this.setConstraintsState = this.setConstraintsState.bind(this);
    this.addNewConstraint = this.addNewConstraint.bind(this);
  }

  //logic fonction
  constraintsValidations() {
    let check: boolean = true;
    if (this.state.constraints.length === 0) {
      check = false;
    } else {
      for (let index in this.state.constraints) {
        if (!this.state.constraints[index].isContrainte()) {
          check = false;
        }
      }
    }
    return check;
  }

  //state function
  handleVarChange(e: any, variable: string) {
    this.setState((state, _props) => {
      let tmpVar = state.variables;
      let newVar = {
        ...tmpVar,
        [variable]: e.target.value,
      };
      Constraint.setVariables(newVar);
      // EconomicFunction.setVariables(newVar);
      return {
        variables: newVar,
      };
    });
  }

  setConstraintsState(constraints: Constraint[]) {
    let max = {
      posX: 0,
      posY: 0,
      negX: 0,
      negY: 0,
    };
    let points: Point[] = [];
    constraints.forEach((constraint) => {
      if (constraint.isContrainte()) {
        points = constraint.getXYIntersectionPoints();
        points.forEach((point) => {
          if (point.x > max.posX) {
            max.posX = point.x;
          }
          if (point.y > max.posY) {
            max.posY = point.y;
          }
          if (point.x < max.negX) {
            max.negX = point.x;
          }
          if (point.y < max.negY) {
            max.negY = point.y;
          }
        });
      }
    });
    this.setState({
      constraints: constraints,
      max,
    });
  }

  removeConstraint(e: any, id: number) {
    let tmp: Constraint[] = [];
    for (const index in this.state.constraints) {
      if (
        this.state.constraints[index].getId() !== id &&
        this.state.constraints[index].getId() > id
      ) {
        let constTmp = this.state.constraints[index];
        constTmp.setId(constTmp.getId() - 1);
        tmp.push(constTmp);
      } else if (this.state.constraints[index].getId() !== id) {
        tmp.push(this.state.constraints[index]);
      }
    }
    this.setConstraintsState(tmp);
  }

  constraintChange(e: any, id: number) {
    let tmp: Constraint[] = this.state.constraints.map(
      (constraint): Constraint => {
        if (constraint.getId() === id) {
          constraint.setFuncString(e.target.value);
        }
        return constraint;
      }
    );
    this.setConstraintsState(tmp);
  }

  addNewConstraint = () => {
    let tmp = this.state.constraints;
    tmp.push(new Constraint(tmp.length, ""));
    this.setConstraintsState(tmp);
  };

  render() {
    return (
      <div>
        <div>
          <VariableComponent
            varString={this.state.variables.x}
            label={"variable 1"}
            placeholder={"X"}
            onChange={(e) => {
              this.handleVarChange(e, "x");
            }}
          />
          <VariableComponent
            varString={this.state.variables.y}
            label={"variable 2"}
            placeholder={"Y"}
            onChange={(e) => {
              this.handleVarChange(e, "y");
            }}
          />
        </div>
        <div>
          {this.state.constraints.map((constraint) => (
            <ConstraintComponent
              onClick={this.removeConstraint}
              funcString={constraint.getFuncString()}
              id={constraint.getId()}
              key={constraint.getId()}
              onChange={this.constraintChange}
              placeholder={(() => {
                return (
                  "Ex : 2" +
                  this.state.variables.x +
                  " + 4" +
                  this.state.variables.y +
                  " <= 8"
                );
              })()}
            />
          ))}
          <div onClick={this.addNewConstraint}>
            <button>add</button>
          </div>
        </div>
        <div>
          {this.constraintsValidations() &&
            this.state.constraints.map((constraint) => (
              <div>
                <div>
                  {" "}
                  Graph points{JSON.stringify(constraint.getGraphPoints())}
                </div>
                <br />
                <div>
                  {" "}
                  Graph getXYIntersectionPoints
                  {JSON.stringify(constraint.getXYIntersectionPoints())}
                </div>
                <br />
                <div>
                  {" "}
                  Graph getNotSolutionsPoints
                  {JSON.stringify(
                    constraint.getNotSolutionsPoints(
                      this.state.max.posX,
                      this.state.max.posY
                    )
                  )}
                </div>
              </div>
            ))}
        </div>
        <div>
          {this.constraintsValidations() && (
            <GraphComponent
              max={this.state.max}
              constraints={this.state.constraints}
            />
          )}
        </div>
      </div>
    );
  }
}
