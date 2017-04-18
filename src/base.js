import Vue from 'vue';
/**
 * 时间格式化
 */
Vue.filter('time',function(value,format){
	format = format||'yyyy-MM-dd HH:mm:ss'
	return Sunset.Dates.format(parseInt(value),format);
});
