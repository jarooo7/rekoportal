import { ErrorCodes } from '../enums/error-code';

export class ErrorRequest {
    code: ErrorCodes;
    message: string;
}
