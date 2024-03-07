export interface ResponseAPI<T> {
    success: boolean;
    status: string;
    message: any;
    data: T;
}