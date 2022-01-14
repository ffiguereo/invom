
export abstract class Command {
  commandName(): string {
    return this.constructor.name;
  }
}
