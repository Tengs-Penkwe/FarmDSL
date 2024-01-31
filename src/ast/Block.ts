import {ASTNode} from "./Ast";
import {Result} from "vm/Eval";
import {Context} from 'vm/Context'
import {Statement} from "./Statement";

export class Block implements ASTNode { 
    stmts : Statement[];

    constructor() { this.stmts = []; }
    addStatement(stmt: Statement) { this.stmts.push(stmt); }
    addStatements(stmts: Statement[]) { this.stmts.push(...stmts); }

    eval(ctx: Context): Result {
        let lastResult = new Result("Null");

        this.stmts.forEach(
            stmt => {
                lastResult = stmt.eval(ctx);
            }
        )

        return lastResult;
    }
}
