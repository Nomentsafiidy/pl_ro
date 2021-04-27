import { MouseEvent } from 'react';

export type RemoveConstraint = (event: MouseEvent, id: number) => void;
export type HandleChange = (event: any, id: number) => void;

type ConstraintProps = {
    id: number;
    funcString: string;
    placeholder: string;
    onClick: RemoveConstraint;
    onChange: HandleChange;
};

export const ConstraintComponent = (props: ConstraintProps) => {
    return (
        <div>
            <input
                className='pl_input'
                type='text'
                value={props.funcString}
                onChange={(e) => {
                    props.onChange(e, props.id);
                }}
                placeholder={props.placeholder}
            />
            <button
                onClick={(e) => {
                    props.onClick(e, props.id);
                }}
            >
                Remove
            </button>
        </div>
    );
};
