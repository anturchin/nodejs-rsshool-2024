import { colors } from './constants';

export class Logger {
    constructor(private readonly name: string) {
        this.name = name;
    }

    warn(msg: string): void {
        console.log(
            `${colors.warn}${this.getTime()} WARN [${this.getName()}]: ${colors.reset}${msg}`
        );
    }
    error(msg: string): void {
        console.log(
            `${colors.error}${this.getTime()} ERROR [${this.getName()}]: ${colors.reset}${msg}`
        );
    }
    info(msg: string): void {
        console.log(
            `${colors.info}${this.getTime()} INFO [${this.getName()}]: ${colors.reset}${msg}`
        );
    }

    getName(): string {
        return this.name;
    }

    private getTime(): string {
        const now = new Date();
        return now.toLocaleTimeString('en-GB', { hour12: false });
    }
}
