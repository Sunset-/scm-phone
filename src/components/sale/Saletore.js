const URLS = {
    LIST: '/service/scm/select/getSaleSumList'
};

module.exports = {
    loadSales(filter) {
        return $http({
            url: URLS.LIST,
            type: 'POST',
            data: filter
        });
    }
}