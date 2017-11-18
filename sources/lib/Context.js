export class Context {

    constructor(context = null) {

        this.registers = context ? Object.create(context.registers) : Object.create(null);
        this.stack = context ? context.stack.slice() : [];

    }

    isEmpty() {

        return this.stack.length === 0;

    }

    top() {

        if (this.isEmpty())
            throw new Error(`Cannot fetch data from an empty stack`);

        return this.stack[this.stack.length - 1];

    }

    at(n) {

        n = Number(n);

        if (n >= this.stack.length)
            throw new Error(`Cannot fetch element #${n} of a stack of size ${this.stack.length}`);

        return this.stack[this.stack.length - 1 - n];

    }

    push(value) {

        let context = this.clone();
        context.stack.push(value);

        return context;

    }

    pop() {

        if (this.isEmpty())
            throw new Error(`Cannot pop data from an empty stack`);

        let context = this.clone();
        context.stack.pop();

        return context;

    }

    declareRegisters(registers) {

        let context = this.clone();

        for (let name of Reflect.ownKeys(registers)) {

            let value = registers[name];

            Reflect.defineProperty(context.registers, name, {

                enumerable: true,

                get: () => value,
                set: newValue => value = newValue

            });

        }

        return context;

    }

    setRegisters(registers) {

        for (let name of Object.keys(registers))
            if (!Reflect.has(this.registers, name))
                throw new Error(`Undeclared variable "${name}"`);

        let context = this.clone();
        Object.assign(this.registers, registers);

        return context;

    }

    clone() {

        return new Context(this);

    }

}

export let ContextSymbols = {

    networkManager: Symbol(),
    progressManager: Symbol(),
    storageManager: Symbol(),

    enableParallelProcessing: Symbol()

};
