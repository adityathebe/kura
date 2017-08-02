$(document).ready(() => {
    $('.delete-question').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log(id);
        // $.ajax({
        //     type: 'DELETE',
        //     url: '/questions/'+id,
        //     success : function(response) {
        //         window.location.href='/';
        //     },
        //     err: function(err) {
        //         console.log(err);
        //     }
        // });
    });
});