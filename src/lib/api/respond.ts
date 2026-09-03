import { NextResponse } from 'next/server';
import type { ApiError, ApiResponse } from './types';

export function requestId() { return crypto.randomUUID(); }

export function ok<T>(data: T, status = 200, id = requestId()) {
  const body: ApiResponse<T> = { data, error: null, requestId: id };
  return NextResponse.json(body, { status, headers: { 'x-request-id': id } });
}

export function fail(code: string, message: string, status = 400, id = requestId()) {
  const error: ApiError = { code, message };
  const body: ApiResponse<null> = { data: null, error, requestId: id };
  return NextResponse.json(body, { status, headers: { 'x-request-id': id } });
}
