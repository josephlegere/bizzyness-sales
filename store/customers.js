export const state = () => ({
    list: []
});

export const actions = {
    async get({ commit }, tenant) {
        let _list = [];

        await this.$fire.firestore
            .collection("tenant_customers")
            .doc(tenant)
            .collection("customers")
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    //console.log(doc.id, "=>", doc.data());
                    let { account, group, account_type } = doc.data();
                    let id = '';

                    if (account_type === 'tenant') id = `tenants/${doc.id}`;
                    else id = `customers/${doc.id}`;

                    _list.push({
                        name: account,
                        group,
                        customer: {
                            account,
                            id,
                            account_type
                        },
                        id: doc.id
                    });
                });
            })
            .catch(err => {
                console.log("Error getting documents", err);
            });

        commit("setList", _list);
    },
    async add({ commit }, { tenant, customer}) {
        try {
            let { name, group } = customer;
            let customer_details = {};
            console.log(customer);
            let customerRef = await this.$fire.firestore.collection('tenant_customers').doc(tenant).collection('customers').add({
                account: name,
                account_type: 'non-tenant',
                created: this.$fireModule.firestore.FieldValue.serverTimestamp(),
                group
            });

            commit('insert', {
                name,
                group,
                customer: {
                    account: name,
                    id: `customers/${customerRef.id}`,
                    account_type: 'non-tenant'
                },
                id: customerRef.id
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    async delete({ commit }, { tenant, customer }) {
        try {
            let { id } = customer;
            await this.$fire.firestore.collection('tenant_customers').doc(tenant).collection('customers').doc(id).delete();
            commit('stripList', customer);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
};

export const mutations = {
    setList: (state, customers) => (state.list = customers),
    stripList: (state, customer) => state.list = _.difference(state.list, [customer]),
    insert: (state, customer) => (state.list.push(customer))
};
