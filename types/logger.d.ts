export interface DefaultLogger {
  silly(): void;
  debug(): void;
  notice(): void;
  info(): void;
  warning(): void;
  error(): void;
}