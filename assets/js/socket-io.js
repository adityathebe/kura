var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('user-change', function(data) {
    jQuery('#online-user-field').html(data.onlineuser - 1)
})