type Ok<T> = { ok: true; value: T };
type Err<E = unknown> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T = undefined>(value?: T): Ok<T>;
export function ok(value?: unknown): Ok<unknown> {
  return {
    ok: true,
    value,
  };
}

export function err<E>(error: E): Err<E> {
  return {
    ok: false,
    error,
  };
}
