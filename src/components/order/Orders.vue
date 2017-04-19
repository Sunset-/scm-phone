<template>
    <div>
        <mt-header :title="isDetail?'订单明细':'订单查询'">
            <mt-button v-if="isDetail" icon="back" slot="left" @click="back">返回</mt-button>
        </mt-header>
        <div class="content-container">
            <div v-show="!isDetail">
                <sunset-filter style="margin-bottom:10px;" v-ref:filter :options="filterOptions" @filter="loadOrders"></sunset-filter>
                <sunset-table v-ref:table :options="tableOptions"></sunset-table>
            </div>
            <div v-show="isDetail">
                <order-detail :order="currentOrder"></order-detail>
            </div>
        </div>
    </div>
</template>
<script>
    import SignStore from '../SignStore.js';
    import OrderStore from './OrderStore';
    import OrderDetail from './OrderDetail.vue';

    export default {
        components: {
            OrderDetail
        },
        computed: {
            isDetail() {
                var path = this.$route.path;
                return path.substring(0, path.indexOf('?') >= 0 ? path.indexOf('?') : path.length) == '/order/detail';
            }
        },
        data() {
            return {
                currentOrder: null,
                filterOptions: {
                    align: 'left',
                    fields: [{
                        label: '分店',
                        name: 'entno',
                        widget: 'select',
                        placeholder: '请选择分店',
                        clearable: false,
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
                        watch: ['entno', (deps, options, filter) => {
                            filter.vdno = null;
                            options.data = SignStore.getCurrentUserSync().shopvdsMap[deps.entno] ||
                                [];
                        }]
                    }), {
                        label: '开始时间',
                        name: 'begdate',
                        widget: 'date',
                        type: 'daterange',
                        newline: true,
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return now;
                        })()
                    }, {
                        label: '结束时间',
                        name: 'enddate',
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
                            return now;
                        })()
                    }],
                    format: function (filter) {
                        filter.oprtno = SignStore.getCurrentUserSync().OPRTNO;
                        return filter;
                    },
                    searchButton: {
                        label: '查询',
                        icon: 'search'
                    }
                },
                tableOptions: {
                    columns: [{
                        title: '单号',
                        name: 'ORDERNO',
                        link: (item) => {
                            Router.go('/order/detail');
                            this.currentOrder = item;
                        },
                        align: 'center'
                    }, {
                        title: '总成本',
                        name: 'TLCOST',
                        format: 'MONEY',
                        align: 'center'
                    }, {
                        title: '送货日期',
                        name: 'DELIVEDATE',
                        format: 'DATE',
                        align: 'center'
                    }, {
                        title: '状态',
                        name: 'STAT'
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
                        return filter;
                    },
                    method: 'loadOrders',
                    store: OrderStore
                }
            };
        },
        methods: {
            loadOrders(filter) {
                this.$refs.table.search(filter);
            },
            back() {
                Router.go('/order');
            }
        },
        ready() {
            document.title = '订单查询';
        }
    }
</script>