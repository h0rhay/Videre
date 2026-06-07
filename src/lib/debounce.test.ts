import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces multiple rapid calls into one invocation', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('a');
    debounced('b');
    debounced('c');

    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('fires with the args from the last call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('first');
    debounced('second');
    debounced('last');

    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledWith('last');
  });

  it('does not fire before the delay has elapsed', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('x');
    vi.advanceTimersByTime(499);

    expect(fn).not.toHaveBeenCalled();
  });

  it('cancel() prevents a pending call from firing', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('x');
    debounced.cancel();
    vi.advanceTimersByTime(500);

    expect(fn).not.toHaveBeenCalled();
  });
});
