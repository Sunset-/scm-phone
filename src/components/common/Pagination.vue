<style lang="sass">
    .sunset-pagination {
        text-align: center;
        .current-page-number {
            display: inline-block;
            padding: 0px 10px;
            font-size: 14px;
        }
    }
</style>
<template>
    <div class="sunset-pagination">
        <mt-button size="small" type="primary" @click="go(-1)" :disabled="pageNumber==1">上一页</mt-button>
        <div class="current-page-number">
            {{pageNumber}} / {{totalPage}}
        </div>
        <mt-button size="small" type="primary" @click="go(1)" :disabled="pageNumber==totalPage">下一页</mt-button>
    </div>
</template>
<script>
    export default {
        props: {
            pageNumber: {

            },
            pageSize: {

            },
            total: {

            }
        },
        computed: {
            totalPage() {
                return this.total % this.pageSize == 0 ? (this.total / this.pageSize) : parseInt(this.total / this.pageSize +
                    1);
            }
        },
        methods: {
            go(diff) {
                var currentPage = this.pageNumber,
                    nextPage = currentPage + diff;
                if (nextPage >= 1 && nextPage < this.total) {
                    this.$emit('change', nextPage);
                }
            }
        }
    }
</script>