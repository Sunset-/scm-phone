<template>
    <div>
        <mt-header :title="isDetail?'对账单明细':'对账单'">
            <mt-button v-if="isDetail" icon="back" slot="left" @click="back">返回</mt-button>
        </mt-header>
        <div class="content-container">
            <div v-show="!isDetail">
                <sunset-filter style="margin-bottom:10px;" v-ref:filter :options="filterOptions" @filter="loadStatements"></sunset-filter>
                <sunset-table v-ref:table :options="tableOptions"></sunset-table>
            </div>
            <div v-show="isDetail">
                <statement-detail :statement="currentStatement" @refresh="refresh"></statement-detail>
            </div>
        </div>
    </div>
</template>
<script>
    import SignStore from '../SignStore.js';
    import StatementStore from './StatementStore';
    import StatementDetail from './StatementDetail.vue';

    export default {
        components: {
            StatementDetail
        },
        computed: {
            isDetail() {
                var path = this.$route.path;
                return path.substring(0, path.indexOf('?') >= 0 ? path.indexOf('?') : path.length) == '/statement/detail';
            }
        },
        data() {
            return {
                currentStatement: null,
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
                        title: '日期',
                        name: 'WORKDATE',
                        link: (item) => {
                            Router.go('/statement/detail');
                            this.currentStatement = item;
                        },
                        align: 'center'
                    }, {
                        title: '类型',
                        name: 'WLTYPE',
                        format(v) {
                            return {
                                'BY': '收货',
                                'RT': '退货',
                                'SL': '销售',
                                'AJ': '销售调整',
                                'FE': '供应商费用'
                            }[v];
                        }
                    }, {
                        title: '金额',
                        name: 'PAYAMT',
                        format: 'MONEY'
                    }, {
                        title: '账期',
                        name: 'JSDATENO',
                        align: 'center',
                        link: (item) => {
                            Router.go('/statement/detail');
                            this.currentStatement = item;
                        }
                    }, {
                        title: '是否确认',
                        name: 'CHKTAG',
                        align: 'center',
                        format(v) {
                            return {
                                '0': '<span style="color:red;">未确认</span>',
                                '1': '<span>已确认</span>'
                            }[v];
                        }
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
                        filter.begdate = Sunset.Dates.format(filter.begdate, 'yyyyMMdd');
                        filter.enddate = Sunset.Dates.format(filter.enddate, 'yyyyMMdd');
                        return filter;
                    },
                    method: 'loadStatements',
                    store: StatementStore
                }
            };
        },
        methods: {
            loadStatements(filter) {
                this.$refs.table.search(filter);
            },
            back() {
                Router.go('/statement');
            },
            refresh() {
                this.$refs.table.refresh();
            }
        },
        ready() {
            document.title = '对账单';
        }
    }
</script>