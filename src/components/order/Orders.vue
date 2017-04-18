<template>
    <div>
        <sunset-filter v-ref:filter :options="filterOptions"></sunset-filter>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
    </div>
</template>
<script>
    import SignStore from '../../SignStore.js';
    import OrderStore from './OrderStore';

    export default {
        data() {
            return {
                filter: {
                    pageno: 0,
                    count: 10,
                    oprtno: 1,
                    entno: null,
                    begdate: new Date(new Date().getTime() - 86400000 * 60),
                    enddate: new Date()
                },
                filterOptions: {
                    align: 'left',
                    fields: [{
                        label: '分店',
                        name: 'entno',
                        widget: 'select',
                        placeholder: '请选择分店',
                        clearable: false,
                        changeFilter: false,
                        valuePlace: 'SHOPCODE',
                        textPlace: 'SHOPNA',
                        data() {
                            return SignStore.getCurrentUserSync().shoplist || [];
                        }
                    }, (SignStore.getCurrentUserSync().isShopOperator ? {
                        label: '供应商',
                        name: 'vdno',
                        widget: 'input',
                        placeholder: '供应商编号'
                    } : {
                        label: '供应商',
                        name: 'vdno',
                        widget: 'select',
                        placeholder: '供应商编号',
                        watch: ['entno', (deps, options) => {
                            options.data = SignStore.getCurrentUserSync().shopvdsMap[deps.entno] ||
                                [];
                        }]
                    }), {
                        label: '部门',
                        name: 'deptno',
                        widget: 'input',
                        placeholder: '部门编号'
                    }, {
                        label: '',
                        name: 'date',
                        widget: 'date',
                        type: 'daterange',
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return [now, now];
                        })(),
                        changeFilter: true
                    }, {
                        label: '',
                        name: 'date',
                        widget: 'date',
                        type: 'daterange',
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return [now, now];
                        })(),
                        changeFilter: true
                    }],
                    format: function (filter) {
                        return filter;
                    },
                    searchButton: {
                        label: '查询',
                        icon: 'search'
                    },
                    toolbar: [{
                        label: '导出',
                        icon: 'android-download',
                        color: 'success',
                        permission: 'OrderNote_PRINT',
                        operate: () => {
                            var paramsNames = ['oprtno', 'entno', 'vdno', 'deptno', 'begdateStr',
                                'enddateStr'
                            ];
                            var format = {
                                begdateStr: 'begdate',
                                enddateStr: 'enddate'
                            }
                            var params = [];
                            var filter = this.currentFilter;
                            Object.keys(filter).forEach(key => {
                                if (~paramsNames.indexOf(key)) {
                                    params.push(`${format[key]||key}=${filter[key]||''}`);
                                }
                            });
                            window.open('/service/scm/Export/exportOrder?' + params.join('&'));
                        }
                    }]
                },
                tableOptions: {
                    columns: [{
                        title: '单号',
                        name: 'ORDERNO',
                        link: (item) => {},
                        align: 'center'
                    }, {
                        title: '状态',
                        name: 'STAT'
                    }, {
                        title: '送货日期',
                        name: 'DELIVEDATE',
                        format: 'DATE',
                        align: 'center'
                    }, {
                        title: '总成本',
                        name: 'TLCOST',
                        format: 'MONEY',
                        align: 'center'
                    }],
                    showIndex: false,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: true,
                    sortable: false,
                    lazy: true,
                    idKey: 'ORDERNO',
                    format: {
                        list: 'list',
                        count: 'count',
                        pageSize: 'count',
                        currentPage: 'pageno'
                    },
                    formatFilter: (filter) => {
                        // if (filter.date && filter.date[0] && filter.date[1]) {
                        //     filter.begdate = filter.date[0];
                        //     filter.enddate = new Date(filter.date[1].getTime() + 86399999);
                        //     filter.begdateStr = Sunset.Dates.format(filter.date[0], 'yyyy/MM/dd');
                        //     filter.enddateStr = Sunset.Dates.format(new Date(filter.date[1].getTime() +
                        //             86399999),
                        //         'yyyy/MM/dd');
                        // } else {
                        //     filter.begdate = new Date(0);
                        //     filter.enddate = new Date();
                        //     filter.begdateStr = Sunset.Dates.format(new Date(0), 'yyyy/MM/dd');
                        //     filter.enddateStr = Sunset.Dates.format(new Date(), 'yyyy/MM/dd');
                        // }
                        // var currentUser = SignStore.getCurrentUserSync();
                        // filter.oprtno = currentUser.OPRTNO;
                        // this.currentFilter = filter;
                        return filter;
                    },
                    method: 'loadOrders',
                    store: OrderStore
                }
            };
        },
        methods: {
            loadOrders() {
                this.$refs.table.search(this.filter);
            }
        },
        ready() {
            this.loadOrders();
        }
    }
</script>