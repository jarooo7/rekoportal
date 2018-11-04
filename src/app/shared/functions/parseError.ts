import { HttpErrorResponse } from '@angular/common/http';
import { ResponseError } from '../models/responseError.model';

export function parseError(response: HttpErrorResponse): ResponseError {
  return response.error as ResponseError;
}
