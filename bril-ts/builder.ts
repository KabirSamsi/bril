import * as bril from './bril';

/**
 * A utility for building up Bril programs.
 */
export class Builder {
  /**
   * The program we have built so far.
   */
  public program: bril.Program = { functions: [] };

  private curFunction: bril.Function | null = null;
  private nextFresh: number = 0;

  /**
   * Create a new, empty function into which further code will be generated.
   */
  buildFunction(name: string) {
    let func: bril.Function = { name, instrs: [] };
    this.program.functions.push(func);
    this.curFunction = func;
    this.nextFresh = 0;
    return func;
  }

  /**
   * Build an operation instruction that produces a result. If the name is
   * omitted, a fresh variable is chosen automatically.
   */
  buildValue(op: bril.ValueOpCode, args: string[], dest?: string) {
    dest = dest || this.fresh();
    let instr: bril.ValueOperation = { op, args, dest };
    this.insert(instr);
    return instr;
  }

  /**
   * Build a non-value-producing (side-effecting) operation instruction.
   */
  buildEffect(op: bril.EffectOpCode, args: string[]) {
    let instr: bril.EffectOperation = { op, args };
    this.insert(instr);
    return instr;
  }

  /**
   * Build a constant instruction. As above, the destination name is optional.
   */
  buildConst(value: bril.Value, dest?: string) {
    dest = dest || this.fresh();
    let instr: bril.Const = { op: "const", value, dest };
    this.insert(instr);
    return instr;
  }

  /**
   * Add a label to the function at the current position.
   */
  buildLabel(name: string) {
    let label = {label: name};
    this.insert(label);
  }

  /**
   * Insert an instruction at the end of the current function.
   */
  private insert(instr: bril.Instruction | bril.Label) {
    if (!this.curFunction) {
      throw "cannot build instruction/label without a function";
    }
    this.curFunction.instrs.push(instr);
  }

  /**
   * Generate an unused variable name.
   */
  private fresh() {
    let out = 'v' + this.nextFresh.toString();
    this.nextFresh += 1;
    return out;
  }
}

