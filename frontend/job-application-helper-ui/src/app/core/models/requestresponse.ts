export class RequestResponse<T>{
    readonly success: boolean;
    readonly value?: T | null;
    readonly error: string | null;

    constructor(success: boolean, value: any = null, error: string | null = null) {
        this.success = success;
        this.value = value;
        this.error = error;
    }
}