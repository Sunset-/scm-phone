import DataTable from './DataTable.vue';
import Pagination from './Pagination.vue';
import Filter from './filter/Filter.vue';

exports.install = function (Vue) {
    Vue.component(`SunsetTable`, DataTable);
    Vue.component(`SunsetPage`, Pagination);
    Vue.component(`SunsetFilter`, Filter);
}