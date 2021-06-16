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
    },
    async add({ commit }, { user, orders, total, invoice_code, account, category }) {
        try {
            let { account: account_name, id, name, tenantid } = user;
            let { items, layout } = ordersToInvoice(orders);
            let created = this.$fireModule.firestore.FieldValue.serverTimestamp();
            let date = this.$fireModule.firestore.Timestamp.fromDate(new Date());

            let _invoice = {
                active: true,
                agent: { account: account_name, id, name },
                customer: {
                    account: 'Walk In',
                    account_type: 'generated'
                },
                date, //this format is set date from server side
                dateDue: date, //this format is set date from server
                invoice_code,
                items,
                layout,
                remarks: '',
                created,
                tenant: tenantid,
                total
            }
            console.log(_invoice);

            let _payment = {
                account,
                amount: total,
                created,
                date,
                method: 'Cash'
            }
            console.log(_payment);

            let _transaction = {
                account,
                category,
                amount: total,
                created_by: {
                    name,
                    userid: id
                },
                created,
                date,
                description: `Sales Invoice - Cash`,
                notes: '',
                tenantid,
                type: 'Deposit'
            }

            let batch = this.$fire.firestore.batch();

            let invoiceRef = this.$fire.firestore.collection('invoices').doc();
            batch.set(invoiceRef, _invoice);

            let paymentRef = this.$fire.firestore.collection('invoices').doc(invoiceRef.id).collection('payments').doc();
            batch.set(paymentRef, _payment);

            let transactionRef = this.$fire.firestore.collection('transactions').doc(paymentRef.id);
            batch.set(transactionRef, _transaction);

            await batch.commit();
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export const mutations = {
    setList: (state, accounts) => (state.list = accounts)
}

function ordersToInvoice(orders) {
    let _items = {};
    let _layout = [];

    orders.forEach((elem, key) => {
        let { id, _uniqueIdentifier, productNumber, name, calculatedPrice, quantity, media } = elem;
        _items[`0_${key}`] = { id, _uniqueIdentifier, productNumber, name, currency: { code: 'Php', name: 'PHP (Php) - Philippine Peso', symbol: '₱' }, price: calculatedPrice.unitPrice, quantity, media };
        _layout.push({
            children: [],
            key: (key + 1),
            source: { origin: `items/entry/0_${key}` }
        });
    });

    return { items: { entry: _items }, layout: _layout };
}