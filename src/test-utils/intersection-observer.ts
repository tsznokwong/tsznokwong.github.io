// Shared IntersectionObserver polyfill for jsdom tests.
// Polyfilled by TimelineItem (and its consumers) which rely on
// IntersectionObserver for the scroll-based visibility animation.

class MockIntersectionObserver {
  private _callback: (entries: IntersectionObserverEntry[]) => void

  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    this._callback = callback
  }

  observe(): void {
    // Simulate immediate intersection
    this._callback([{ isIntersecting: true } as IntersectionObserverEntry])
  }

  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

export default MockIntersectionObserver
