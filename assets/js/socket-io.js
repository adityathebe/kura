var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updated-stats', function(data) {
    jQuery('#online-user-field').html(data - 1);
});

var visitorData = {
    referringSite: document.referrer,
    page: location.pathname,
    device : navigator.userAgent
}
socket.emit('visitor-data', visitorData);