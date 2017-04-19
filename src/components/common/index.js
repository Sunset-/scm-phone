import {
    Indicator,
    MessageBox,
    Toast
} from 'mint-ui';

import DataTable from './DataTable.vue';
import Pagination from './Pagination.vue';
import Filter from './filter/Filter.vue';
import picker from 'vue-3d-picker';

exports.install = function (Vue) {
    Vue.component(`SunsetTable`, DataTable);
    Vue.component(`SunsetPage`, Pagination);
    Vue.component(`SunsetFilter`, Filter);
    // Vue.component(`SunsetPicker`, picker);
    Vue.component(picker.name, picker);

    /**
     * 取值
     */
    Vue.filter('sunset_namespace', function (obj, namespace) {
        return Sunset.getAttribute(obj, namespace, '');
    });

    /**
     * 时间格式化
     */
    Vue.filter('time', function (value, format) {
        format = format || 'yyyy-MM-dd HH:mm:ss'
        return Sunset.Dates.format(value, format);
    });

    /**
     * 枚举转码
     */
    Vue.filter('enum', function (value, enumType) {
        return Sunset.Service.Dictionary.transcode(enumType, value);
    });


    //全局提示
    var tipType = {
        info: 'info',
        success: 'success',
        warning: 'warning',
        error: 'error',
        loading: 'loading'
    };
    Sunset.tip = function (message, type, duration) {
        return Toast({
            message: message,
            position: 'middle',
            duration: 2000
        });
    };
    Sunset.confirm = function (option) {
        return MessageBox({
            title: option.title,
            message: option.message,
            showCancelButton: true
        });
    };
    Sunset.loading = function (flag) {
        Indicator[flag ? 'open' : 'close']();
    };

}