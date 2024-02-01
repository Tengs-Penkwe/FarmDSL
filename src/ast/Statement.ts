import {Result} from "./Type";
import {Context} from "vm/Context";
import {ASTNode} from "./Ast";
import {Variable} from "vm/Variable";
import {Type, TypeStr} from "./Type";

import {Expression} from "./Expression";
import {Pairs} from "./Pairs";
import {Block} from "./Block";
import {Farm} from "backend/Farm";
import {Crop} from "backend/Crop";

import { assert } from "console";

export class ExprStatement implements ASTNode {
    expr : Expression;

    constructor(expr: Expression) { this.expr = expr; }

    eval(vm: Context): Result {
        return this.expr.eval(vm);
    }
}

export class DeclStatment implements ASTNode {
    type : TypeStr;
    name : string;    
    initValue : Expression | Pairs;  // Initialization value, can be EmptyExpression

    constructor(type: TypeStr, name: string, expr: Expression | Pairs) { this.type = type; this.name = name; this.initValue = expr; }
    
    eval(ctx: Context): Result {
        let value : Type;
        if (this.initValue instanceof Pairs) {
            switch(this.name) {
            case "farm":
                value = this.initValue.eval("Farm").value;
                break;
            case "crop":
                value = this.initValue.eval("Crop").value;
                break;
            default:
                throw new Error("Unkown type of variable");
            }
        } else {
            assert(this.initValue instanceof Expression, "Initialization value should be an expression");
            value = this.initValue.eval(ctx);
        }
        
        const variable: Variable = {
            type: this.type,
            value: value,
        };
        ctx.newVariable(this.name, variable);

        // It is totally a side effect to create a new variable in the VM
        return new Result("Null"); 
    }
}

export class AssignStatement implements ASTNode {
    name: string;
    expr: Expression;

    constructor(name: string, expr: Expression) { this.name = name; this.expr = expr; }

    eval(ctx: Context): Result {
        const exprResult = this.expr.eval(ctx);
        const newValue = exprResult.value;
        ctx.updateVariable(this.name, newValue);

        // Update the variable in the VM is a side effect
        return new Result("Null");
    }
}

export class IfStatement implements ASTNode {
    cond: Expression;
    if_block: Block;
    else_block: Block;

    constructor(cond: Expression, if_block: Block, else_block: Block) { this.cond = cond; this.if_block = if_block; this.else_block = else_block; }

    eval(vm: Context): Result {
        const exprResult = this.cond.eval(vm);
        if (exprResult.type !== "Bool") {
            throw new Error("Condition expression should be a boolean");
        }

        //TODO: here we face a choice, should we make the change in the block global ?
        if (exprResult.value) {
            this.if_block.eval(vm);
        } else {
            this.else_block.eval(vm);
        }

        return new Result("Null");
    }
}

export type Tstatement = ExprStatement | DeclStatment | AssignStatement | IfStatement;

export class Statement implements ASTNode {
    stmt : Tstatement;
    setStatement(stmt: Tstatement) { this.stmt = stmt; }

    eval(ctx: Context): Result {
        return this.stmt.eval(ctx);
    }
}
