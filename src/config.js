//DEPENDENTS
import FontAwesome from 'font-awesome';
import $ from 'jquery';

window.$http = function (...args) {

    var promise = jQuery.Deferred();

    jQuery.ajax.apply(jQuery, args).then((res) => {
        if (typeof res == 'object' && res.code) {
            if (res.code == 200) {
                promise.resolve(res.data);
            } else if (res.code == 40000) {
                try {
                    promise.reject(res);
                } catch (e) {}
                Sunset.goLogin && Sunset.goLogin();
            } else {
                Base.Toast && Base.Toast(res.message || '服务异常')
            }
        }
        promise.reject(res);
    }, (err) => {
        console.log(err.message || err);
        promise.reject(err);
    });

    return promise;
}

window.jQuery = $;
window.$ = $;