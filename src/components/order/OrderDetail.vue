<template>
    <div>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
    </div>
</template>
<script>
    import OrderStore from './OrderStore.js';

    export default {
        props: {
            order: {

            }
        },
        data() {
            return {
                tableOptions: {
                    columns: [{
                        title: '名称',
                        name: 'GDNAME',
                        format(v, record) {
                            return record.SUNSET_APPEND_LABEL ? v :
                                `[${record.GDNO}]${record.GDNAME}`;
                        }
                    }, {
                        title: '数量',
                        name: 'ORDERQTY',
                        align: 'center'
                    }, {
                        title: '成本',
                        name: 'TLCOST',
                        format: 'MONEY'
                    }],
                    showIndex: false,
                    pageSize: 10,
                    localPage: true,
                    multiCheck: true,
                    sortable: false,
                    lazy: true,
                    idKey: 'ORDERNO',
                    format: {
                        list: 'list',
                        count: 'list.length',
                        pageSize: 'count',
                        currentPage: 'pageno'
                    },
                    formatFilter: (filter) => {
                        return filter;
                    },
                    method: 'loadDetail',
                    store: OrderStore
                }
            }
        },
        methods: {
            loadDetail() {
                if (this.order) {
                    this.$refs.table.setData({});
                    this.$refs.table.search({
                        entno: this.order.ENTNO,
                        orderno: this.order.ORDERNO
                    });
                }
            }
        },
        watch: {
            order(v) {
                this.loadDetail();
            }
        }
    }
</script>