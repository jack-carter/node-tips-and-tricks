# node-tips-and-tricks

In Javascript programming, be it for an in-browser web application or a back-end API, there are times when we need to be very specific about handling the various events our application and back-end rely upon.

For in-browser web applications it is common to:

* Debounce user operations so we only perform them once
* Throttle calls to an event handler or API by only invoking them when it's appropriate
* Regulate calls to a function, event handler, or API to ensure they occur on a specific time boundary