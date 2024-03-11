window.$ = require('jquery')
window._ = require('lodash');

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const options = {
    broadcaster: 'pusher',
    key: '991a49d0e1a6f91f5440',
    wsHost: window.location.hostname,
    wsPort: 6001,
    wssPort: 6001,
    disableStats: true,
    forceTLS: false,
    encrypted: true,
}

window.Pusher = Pusher;
window.Echo   = new Echo({
    ...options,
    client: new Pusher(options.key, options)
});
