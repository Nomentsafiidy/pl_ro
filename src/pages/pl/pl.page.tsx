import { Component } from "react";
import { Constraint } from "src/models/constraint";

//components imports
import { ConstraintComponent } from "src/components/constraint/constraint.component";
import { VariableComponent } from "src/components/variable/variable.component";
import { Variables } from "src/models/pl.type";

type PlPageSate = {
  variables: Variables;
  constraints: Constraint[];
};

export class PLPage extends Component<any, PlPageSate> {
  constructor(props: any) {
    super(props);
    this.state = {
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

  setConstraintsState(constraint: Constraint[]) {
    this.setState({
      constraints: constraint,
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
        </div>
        <div>{this.constraintsValidations() ? "okay" : "tsy okay"}</div>
      </div>
    );
  }
}
