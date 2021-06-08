export const state = () => ({
    list: []
});

export const actions = {
    async get({ commit }, tenant) {
        let _list = [];

        let productsRes = await this.$axios.get('https://pntpurethirst.shopware.store/store-api/product',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'sw-access-key': 'SWSCEXNRWJVJC3LBDFU4BWFRUW',
                }
            }
        );
        console.log(productsRes.data);
        let { elements } = productsRes.data;

        _list = elements.map(product => {
            let { id, _uniqueIdentifier, productNumber, name, calculatedPrice, media, stock, keywords } = product;
            return { id, _uniqueIdentifier, productNumber, name, calculatedPrice, media, stock, keywords };
        });

        commit('setList', _list);
    }
}

export const mutations = {
    setList: (state, accounts) => (state.list = accounts)
}