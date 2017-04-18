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
    }
}