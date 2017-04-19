const URLS = {
    LIST: '/service/scm/select/getOrderList',
    DETAIL: '/service/scm/select/getOrderDetailList',
    CONFIRM: '/service/scm/select/confirmOrders'
};

module.exports = {
    loadOrders(filter) {
        return $http({
            url: URLS.LIST,
            type: 'POST',
            data: filter
        });
    },
    loadDetail(filter) {
        return $http({
            url: URLS.DETAIL,
            type: 'POST',
            data: filter
        }).then(res => {
            if (res) {
                var totalCount = 0,
                    totalPrice = 0;
                res.list = res.list || [];
                res.list.forEach(item => {
                    totalCount += item.ORDERQTY;
                    totalPrice += item.TLCOST;
                });
                res.list.push({
                    SUNSET_APPEND_LABEL: true,
                    GDNAME: '<span style="float:right;">总计：</span>',
                    ORDERQTY: totalCount,
                    TLCOST: totalPrice
                })
            }
            return res;
        });
    }
}