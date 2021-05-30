import _ from 'lodash';

export const state = () => ({
	list: [],
	new: {}
});

export const actions = {
	async get({ commit }, tenant) {
		let _list = {};

		await this.$fire.firestore
			.collection("tenant_accounts")
			.doc(tenant)
			.collection("accounts")
			.where('archive', '==', false)
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					//console.log(doc.id, "=>", doc.data());
					let { account_category, account_type, currency, description, name, set_date } = doc.data();

					_list[doc.id] = {
						account_category,
						account_type,
						currency,
						name,
						set_date
					};

					if (description) _list[doc.id].description = description;
				});
			})
			.catch(err => {
				console.log("Error getting documents", err);
			});

		commit("setList", _list);
	},
	async add({}, { newAccount, tenant }) {
		console.log(newAccount);
		console.log(tenant);
		// commit("insert", newAccount);

		return await this.$fire.firestore.collection('tenant_accounts').doc(tenant).collection('accounts').add(newAccount);
	},
	async edit({}, { tenant, account, updates }) {
		return await this.$fire.firestore.collection('tenant_accounts').doc(tenant).collection('accounts').doc(account).update(updates);
	},
	async archive({}, { tenant, account }) {
		return await this.$fire.firestore.collection('tenant_accounts').doc(tenant).collection('accounts').doc(account).update({ archive: true });
	}
};

export const mutations = {
    setList: (state, accounts) => (state.list = accounts),
	insert: (state, newAccount) => (state.list = { ...state.list, ...newAccount }),
	update: (state, account) => {
		let { key, updates } = account;
		let _account = _.cloneDeep(state.list[key]);

		Object.entries(updates).forEach(elem => {
			_account[elem[0]] = elem[1];
		});

		state.list[key] = _account;
	},
	archive: (state, account) => (state.list = Object.filter(state.list, _key => _key !== account.key))
};

Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(key) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );