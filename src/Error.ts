
export class ExprError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class VariableError extends Error {
    constructor(message: string) {
        super(message);
    }
}