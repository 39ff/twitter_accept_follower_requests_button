$(function(){
    $('.ProfileHeading-toggle').append('<button type="button" class="btn small acceptall">AcceptAll</button>/<button type="button" class="btn small denyall">DenyAll</button>');
    console.log("Loaded");
    var token = $('#authenticity_token').val();
    console.log($('.GridTimeline-items').attr('data-min-position'));

    $(".acceptall").on("click", function(){
        if (!confirm('Accept all follow-request?')) {
            return false;
        }
        var min_position = $('.GridTimeline-items').attr('data-min-position');
        exec(min_position,token,'accept');
    });
    $('.denyall').on('click',function(){
        if (!confirm('Deny all follow-request?')) {
            return false;
        }
        var min_position = $('.GridTimeline-items').attr('data-min-position');
        exec(min_position,token,'deny');
    });

});


function exec(id,token,action){
    $.getJSON("https://twitter.com/follower_requests/users",
        {

            "include_available_features": 1,
            "include_entities": 1,
            "max_position": id,
            "reset_error_state": false

        },
        function(data){
            var exchange = $(data['items_html']);
            var res = $(exchange).find('.ProfileCard-acceptDeclineActions');
            for(var i = 0; i< res.length; i++){
                $.ajax({
                    url: '/i/user/'+action,
                    type: 'POST',
                    data: {
                        "authenticity_token":token,
                        "user_id":$(res[i]).children('div').attr('data-user-id')
                    },
                    dataType: 'json',
                    success: function(data, status, xhr) {
                        if (xhr.status === 200) {
                            $.notify(action+" Successfully","success");
                        } else {
                            $.notify("Failed to request:"+status, "error");
                        }
                    }
                });
            }
        
            if(data['has_more_items'] === true){
                exec(data['min_position'],token,action);
            }

        }
    );
}