(function($) {
    let _is_cookie_set = false;
    let cur_url = $(location).attr('href');
    let sub_cur_url = cur_url.substr(cur_url.lastIndexOf("/") -15);
    let like_count_div = '';
    let running = 'requestRunning';

    $( document ).ready(function() {

        if (vote_cookie == 1 && like_count > 0 && readCookie('hasVoted' + sub_cur_url )){
            $('.social-likes').addClass( 'active' );
            _is_cookie_set = true;
        }

        if ( like_count !== undefined){
             if (like_count > 0){
                 like_count_div = like_count_div = '<div class="likes-count">' + like_count + '</div>';
                 $('.social-likes').append(like_count_div);
             }
             else {
                like_count_div = '<div class="likes-count"></div>';
                $('.social-likes').append(like_count_div);
                $('.likes-count').hide();
            }
        }

       $('.social-likes').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();


            var postid;
            var pageid;
            var clicktype;
            var newclicktype;
            var result;
            var disabled;

            var $button = $(this);

            clicktype = $button.attr('clicktype');
            disabled = $(e.target).closest('a');

            if ( disabled.data(running) ) {
                return;
            }

            disabled.data(running, true);

            // on new page load
            if (clicktype ==  0 && vote_cookie == 1){
                $('.social-likes').removeClass( 'active' );
                newclicktype = 2;
            } else if (clicktype ==  0 && vote_cookie == 2) {
                 $('.social-likes').addClass( 'active' );
                  newclicktype = 1;
            } else if(clicktype ==  0 && vote_cookie == 0) {
                 $('.social-likes').addClass( 'active' );
                  newclicktype = 1;
            } else if (clicktype == 1){
               $('.social-likes').removeClass( 'active' );
               newclicktype = 2;
            } else if (clicktype == 2){
                $('.social-likes').addClass( 'active' );
                newclicktype = 1;
            }

            $button.attr('clicktype', newclicktype);

            if (readCookie('hasVoted' + sub_cur_url) === null ){
                createCookie('hasVoted', 1, 60);
             }

            if ( $('body[class*="postid"]').length){
                 postid = $('body[class*="postid"]').attr('class').split('postid-');
                 postid = postid[1].split(" ")[0];
            }

            if ( $('body[class*="page-id"]').length){
                 pageid = $('body[class*="page-id"]').attr('class').split('page-id-');
                 pageid = pageid[1].split(" ")[0];
            }

            var likedata = {
                'action': 'like_handler',
                'content_like_id': postid ? postid : pageid,
            };

            jQuery.ajax({
                url : ajax_object.ajaxurl,
                type : 'POST',
                data : likedata,
                dataType: 'json',
                success : function( response ){
                    if (response == 1) {
                     $('.likes-count').text(response);
                     $('.likes-count').show();
                    } else {
                        $('.likes-count').text(response);
                    }
                },
                complete: function(){
                    disabled.data(running, false);
                }
            });
        });
     });

 function createCookie(name, value, days) {
    var expires = '',
        date = new Date();
    if (days) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + sub_cur_url + '=' + value + expires + '; path=cur_url';
}

function readCookie(name) {
    var nameEQ = name + '=',
        allCookies = document.cookie.split(';'),
        i,
        cookie;
    for (i = 0; i < allCookies.length; i += 1) {
        cookie = allCookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, '', -1);
}

}) (jQuery);
