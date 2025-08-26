// Force demo mode in tests (no real API)
process.env.REACT_APP_API_URL = '';

// jsdom link click support mocks
// @ts-ignore
if (!HTMLAnchorElement.prototype.click) {
  // @ts-ignore
  HTMLAnchorElement.prototype.click = function () {};
}


