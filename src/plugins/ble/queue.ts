import throat from 'throat';

type Queue = <T>(fn: () => Promise<T>) => Promise<T>;

/**
 * Returns either serially configured or generic queue.
 *
 * @param enabled
 */
export function getQueue(enabled: boolean): Queue {
  if (enabled) {
    return throat(1);
  } else {
    return (fn) => fn();
  }
}
