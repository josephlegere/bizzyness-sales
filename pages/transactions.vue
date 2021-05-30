<template>
    <v-row no-gutters="">
        <v-col>
            <v-card>
                <v-card-title>
                    <v-row no-gutters>
                        <v-col cols="12"  md="6" class="pa-2">
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="transactions"
                    :search="search"
                    no-data-text="No Transactions Available"
                    :item-class="itemRowStyle"
                    :sort-by="['priority', 'date']"
                    :sort-desc="[false, true]"
                    multi-sort
                    :expanded.sync="expanded"
                    show-expand
                    single-expand
                >
                    <template v-slot:item.date="{ item }">
                        <v-edit-dialog
                            large
                            @save="saveEdit(item, 'date')"
                            @open="openEdit(item.date, 'date')"
                            @close="closeEdit('date')"
                            persistent
                        >
                            {{ item.date | moment("MMMM Do YYYY") }}
                            <template v-slot:input>
                                <v-text-field
                                    v-model="dateToDisplay"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    @click="showDatepicker"
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    
                    <template v-slot:item.description="{ item }">
                        <v-edit-dialog
                            large
                            @save="saveEdit(item, 'description')"
                            @open="openEdit(item.description, 'description')"
                            @close="closeEdit('description')"
                        >
                            <!-- @close="close" -->
                            <div v-if="item.description !== '' && item.description !== null">{{ item.description }}</div>
                            <div v-else class="text--disabled">Description</div>
                            <template v-slot:input>
                                <v-text-field
                                    v-model="formEntry.description"
                                    :rules="[v => v.length <= 150 || 'Input too long!']"
                                    label="Edit Description"
                                    single-line
                                    counter="150"
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    
                    <template v-slot:item.account="{ item }">
                        <v-edit-dialog
                            large
                            @save="saveEdit(item, 'account')"
                            @open="openEdit(item.account, 'account')"
                            @close="closeEdit('account')"
                        >
                            <!-- @close="close" -->
                            <div v-if="item.account !== '' && item.account !== null">{{ item.account.name }}</div>
                            <div v-else class="text--disabled">Account</div>
                            <template v-slot:input>
                                <v-autocomplete
                                    v-model="formEntry.account"
                                    :items="fillAccounts"
                                    label="Edit Account"
                                    item-text="name"
                                    return-object
                                ></v-autocomplete>
                            </template>
                        </v-edit-dialog>
                    </template>
                    
                    <template v-slot:item.category="{ item }">
                        <v-edit-dialog
                            large
                            @save="saveEdit(item, 'category')"
                            @open="openEdit(item.category, 'category')"
                            @close="closeEdit('category')"
                        >
                            <!-- @close="close" -->
                            <div v-if="item.category !== '' && item.category !== null">{{ item.category.name }}</div>
                            <div v-else class="text--disabled">Category</div>
                            <template v-slot:input>
                                <v-autocomplete
                                    v-model="formEntry.category"
                                    :items="fillCategories(item.type)"
                                    label="Edit Category"
                                    item-text="name"
                                    return-object
                                ></v-autocomplete>
                            </template>
                        </v-edit-dialog>
                    </template>
                    
                    <template v-slot:item.amount="{ item }">
                        <v-edit-dialog
                            large
                            @save="saveEdit(item, 'amount')"
                            @open="openEdit(item.amount, 'amount')"
                            @close="closeEdit('amount')"
                        >
                            <!-- @close="close" -->
                            <div v-if="item.amount !== '' && item.amount !== null">{{ parseFloat(item.amount).toFixed(2) }}</div>
                            <div v-else class="text--disabled">Amount</div>
                            <template v-slot:input>
                                <v-text-field
                                    v-model="formEntry.amount"
                                    label="Edit Amount"
                                    type="number"
                                    single-line
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
                        <span v-if="item.editing">
                            <v-icon
                                small
                                class="mr-2"
                                @click="confirmAll(item)"
                            >
                                mdi-check
                            </v-icon>
                            <v-icon
                                small
                                class="mr-2"
                                @click="cancelAll(item, expand)"
                            >
                                mdi-close
                            </v-icon>
                        </span>
                        <v-icon
                            @click="toggleExpanded(item, expand, isExpanded)"
                        >
                            {{isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                    </template>

                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length">
                            <v-card class="mx-auto my-4" width="100%" flat>
                                <v-row no-gutters>
                                    <v-combobox
                                        v-model="formEntry.type"
                                        :items="transaction_type"
                                        :value="item.type"></v-combobox>
                                    <v-spacer></v-spacer>
                                    <v-textarea
                                        v-model="formEntry.notes"
                                        outlined
                                        label="Notes"
                                        :rules="[v => v.length <= 300 || 'Input too long!']"
                                        counter="300"
                                        autoGrow
                                        dense
                                        rows="3"
                                    ></v-textarea>
                                </v-row>
                                <v-divider class="mx-auto"></v-divider>
                                <v-card-actions class="d-flex flex-row-reverse">
                                    <v-btn
                                        outlined
                                        text
                                        @click="deleteItem=item; deleteDialog=true"
                                    >
                                        Delete
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </td>
                    </template>
                </v-data-table>
            </v-card>
                    
            <v-menu
                v-model="datepicker"
                :position-x="datepicker_X"
                :position-y="datepicker_Y"
                z-index="10"
                absolute
                transition="scale-transition"
                offset-y
            >
                <v-date-picker
                    v-model="formEntry.date"
                ></v-date-picker>
            </v-menu>

            <v-dialog
                v-model="deleteDialog"
                max-width="290"
            >
                <v-card>
                    <v-card-title class="headline">
                        Delete Transaction
                    </v-card-title>

                    <v-card-text>
                        Do you want to DELETE the transaction {{ deleteItem !== null ? deleteItem.description : '' }} on {{ deleteItem !== null ? deleteItem.date : '' }}?
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        text
                        @click="deleteItem = null; deleteDialog = false"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        color="red darken-1"
                        text
                        @click="deleteRecord"
                    >
                        DELETE
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-row
                class="toolbar-container"
                no-gutters
            >
                <v-col
                    md="10"
                    class="ml-md-auto"
                >
                    <v-sheet
                        color="transparent"
                        class="form-toolbar">
                        <v-toolbar
                            dark
                            height="60">
                            <!-- <v-btn
                                outlined
                                :small="$vuetify.breakpoint.smAndDown"
                            >
                                <v-icon :small="$vuetify.breakpoint.smAndDown">mdi-magnify</v-icon>
                            </v-btn> -->

                            <v-spacer></v-spacer>

                            <v-btn
                                outlined
                                :small="$vuetify.breakpoint.smAndDown"
                                @click="addEntry('Deposit')"
                            >
                                <!-- @click="addEntryModal = !addEntryModal" -->
                                Add Income
                            </v-btn>

                            <v-btn
                                outlined
                                :small="$vuetify.breakpoint.smAndDown"
                                @click="addEntry('Withdraw')"
                                class="ml-md-1"
                            >
                                Add Expense
                            </v-btn>

                            <v-menu offset-y top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        dark
                                        outlined
                                        :small="$vuetify.breakpoint.smAndDown"
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ml-md-1"
                                    >
                                        More
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title>Journal Entry</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title>Blank</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                            <v-bottom-sheet v-model="addEntryModal" scrollable transition="dialog-bottom-transition">
                                    <v-card class="rounded-t-xl">
                                        <v-toolbar dark dense class="rounded-t-xl">
                                            <v-btn icon dark @click="addEntryModal = !addEntryModal">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                            <v-toolbar-title>{{ editingTransaction ? 'Edit' : 'Add'}} an Account</v-toolbar-title>
                                        </v-toolbar>

                                        <v-card-text class="my-md-16">
                                            <v-container>
                                                <v-form ref="form" v-model="validate">
                                                    <v-row>
                                                        <v-col
                                                            cols="12"
                                                            md="6"
                                                            offset-md="3"
                                                        >
                                                            <v-text-field
                                                                v-model="formEntry.name"
                                                                label="Account Name *"
                                                                :rules="[v => !!v || 'Account Name is required']"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <v-col
                                                            cols="12"
                                                            md="6"
                                                            offset-md="3"
                                                        >
                                                            <v-textarea
                                                                v-model="formEntry.description"
                                                                label="Description"
                                                                autoGrow
                                                                dense
                                                                hide-details
                                                                rows="3"
                                                            ></v-textarea>
                                                        </v-col>
                                                        <v-col
                                                            cols="12"
                                                            md="6"
                                                            offset-md="3"
                                                            class="d-flex flex-row-reverse"
                                                        >
                                                            <span class="button-overlay-color ml-2">
                                                                <v-btn
                                                                    dark
                                                                    :loading="submittingForm"
                                                                    :disabled="submittingForm"
                                                                >{{ editingTransaction ? 'Edit' : 'Submit' }}</v-btn>
                                                            </span>
                                                            <span class="button-overlay-color">
                                                            <v-btn
                                                                v-if="editingTransaction"
                                                                dark
                                                                @click="archiveAccount"
                                                                :loading="submittingForm"
                                                                :disabled="submittingForm"
                                                            >Archieve</v-btn>
                                                            </span>
                                                        </v-col>
                                                        <v-col
                                                            cols="12"
                                                            md="6"
                                                            offset-md="3"
                                                        >
                                                            <small>* indicates required field</small>
                                                        </v-col>
                                                    </v-row>
                                                </v-form>
                                            </v-container>
                                        </v-card-text>
                                    </v-card>
                                </v-bottom-sheet>

                        </v-toolbar>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
    data () {
        return {
            search: '',
            headers: [
                { text: 'Date', value: 'date' },
                { text: 'Description', value: 'description' },
                { text: 'Account', value: 'account' },
                { text: 'Category', value: 'category' },
                { text: 'Amount', value: 'amount' },
                { text: '', value: 'data-table-expand', width: 'auto' }
            ],
            addEntryModal: false,
            account_types: [
                { item: 'Inventory', value: 'Inventory' },
                { item: 'Cash and Bank', value: 'Cash and Bank' },
                { item: 'Credit Card', value: 'Credit Card' },
            ],
            category_types: {
                Deposit: [
                    { item: 'Income', value: 'Income Accounts' }
                ],
                Withdraw: [
                    { item: 'Operating Expense', value: 'Expense Accounts' }
                ]
            },
            transaction_type: ['Deposit', 'Withdraw'],
            selected: [],
            expanded: [],
            datepicker: false,
            datepicker_X: 0,
            datepicker_Y: 0,
            formEntry: {
                date: moment().format('YYYY-MM-DD'),
                description: '',
                account: null,
                category: null,
                amount: 0,
                type: null,
                notes: ''
            },
            editItemDefaults: {},
            validate: false,
            editingMode: false,
            deleteDialog: false,
            deleteItem: null,
            submittingForm: false,
            editingTransaction: false,
            numberRule: v  => {
                if (!v.trim()) return true;
                if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
                return 'Number has to be between 0 and 999';
            }
        }
    },
    methods: {
        addEntry (type) {
            console.log('Add Entry');
            this.$store.dispatch('transactions/add', {
                newTransaction: {
                    date: moment(moment().format('YYYY-MM-DD')).toDate(),
                    description: '',
                    account: null,
                    category: null,
                    amount: 0,
                    notes: '',
                    type,
                    created_by: {
                        id: this.loggeduser.id,
                        name: this.loggeduser.name
                    },
                    // id: Date.now(), // temporary id
                },
                tenantid: this.loggeduser.tenantid
            });
        },
        saveEdit (obj, key) {
            let _value = this.formEntry[key];
            if (key === 'amount') _value = parseFloat(_value);
            if (!this.editItemDefaults.hasOwnProperty(obj.id)) this.editItemDefaults[obj.id] = {};
            if (!this.editItemDefaults[obj.id].hasOwnProperty(key)) this.editItemDefaults[obj.id] = { ...this.editItemDefaults[obj.id], [key]: obj[key] };
            this.$store.commit('transactions/update', { id: obj.id, updates: { [key]: _value } });
        },
        openEdit (value, key) {
            if (key === 'date') this.formEntry[key] = moment(value).format('YYYY-MM-DD');
            else if (key === 'amount') this.formEntry[key] = parseFloat(value).toFixed(2);
            else this.formEntry[key] = value;
        },
        closeEdit (key) {
            if (key === 'date') this.formEntry[key] = moment().format('YYYY-MM-DD');
            else if (key === 'amount') this.formEntry[key] = 0;
            else this.formEntry[key] = '';
        },
        cancelAll (obj, expand) {
            let _reverts = { ...this.editItemDefaults[obj.id], editing: false };
            this.$store.commit('transactions/update', { id: obj.id, updates: _reverts });

            // removes the object/transaction from the editItemDefaults
            this.editItemDefaults = Object.keys(this.editItemDefaults).reduce((accumulator, key) => {
                if(key !== obj.id){
                    accumulator[key] = this.editItemDefaults[key];
                }
                return accumulator
            }, {});

            expand(false);
        },
        confirmAll (obj) {
            this.$store.dispatch('transactions/edit', { transaction: obj.id, updates: this.editItemDefaults[obj.id] })
                .then(() => {
                    console.log('Update Successful!');
                    this.editItemDefaults = Object.keys(this.editItemDefaults).reduce((accumulator, key) => {
                        console.log(key);
                        console.log(obj.id);
                        if(key !== obj.id){
                            accumulator[key] = this.editItemDefaults[key];
                        }
                        return accumulator
                    }, {});
                })
                .catch(err => {
                    console.log('Update Unsuccessful!');
                });
        },
        deleteRecord () {
            this.$store.dispatch('transactions/delete', { transaction: this.deleteItem })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.deleteItem = null;
                    this.deleteDialog = false;
                });
        },
        toggleExpanded (item, expand, isExpanded) {
            expand(!isExpanded);

            // turn off editing mode when the expanded is different from the current trigger of expand
            if (this.expanded.length > 0 && this.expanded[0].id !== item.id) this.editingMode = false;

            // Editing Mode is on by default when expanded var has data
            // returns a promise after loading the transaction data to formEntry
            // needs a promise, so turning on editingMode will be reflected in the next cycle
            this.loadTransactionData(item)
                .then(() => {
                    this.editingMode = true;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        loadTransactionData (item) {
            return new Promise((resolve, reject) => {
                try {
                    this.formEntry.type = item.type;
                    this.formEntry.notes = item.notes;
                    resolve('Success!');
                } catch (err) {
                    reject(err);
                }
            })
        },
        showDatepicker(e) {
            e.preventDefault();
            this.datepicker = false;
            this.datepicker_X = e.clientX;
            this.datepicker_Y = e.clientY;
            this.$nextTick(() => {
                this.datepicker = true;
            })
        },
        groupKeys(list, key) {
            return list.reduce(function(collection, elem) {
                collection.includes(elem[key]) || collection.push(elem[key]);
                return collection;
            }, []);
        },
        itemRowStyle: function (item) {
            return item.editing ? 'row-editing' : '';
        }
    },
    computed: {
        ...mapState({
            transactions: state => state.transactions.list,
            loggeduser: state => state.auth.loggeduser,
            accounts: state => state.accounts.list
        }),
        tenant() {
            return this.loggeduser.tenantid.split('/')[1];
        },
        fillAccounts() {
            let _accounts = [];
            this.account_types.forEach(group => {
                let _temp = [];
                Object.entries(this.accounts).filter(elem => elem[1].account_type === group.item).forEach(elem => {
                    let { name, currency } = elem[1];
                    _temp.push({ name, currency, id: `tenant_accounts/${this.tenant}/accounts/${elem[0]}` });
                });
                if (_temp.length > 0) {
                    _accounts.push({ header: group.value });
                    _accounts = _accounts.concat(_temp);
                }
            });
            return _accounts;
        },
        fillCategories() {
            return type => {
                let _categories = [];
                this.category_types[type].forEach(group => {
                    let _temp = [];
                    Object.entries(this.accounts).filter(elem => elem[1].account_type === group.item).forEach(elem => {
                    let { name, account_type } = elem[1];
                        _temp.push({ name, account_type, id: `tenant_accounts/${this.tenant}/accounts/${elem[0]}` });
                    });
                    if (_temp.length > 0) {
                        _categories.push({ header: group.value });
                        _categories = _categories.concat(_temp);
                    }
                });
                return _categories;
            }
        },
        dateToDisplay() {
            return moment(this.formEntry.date).format('MMMM Do YYYY');
        },
        entryType() {
            return this.formEntry.type;
        },
        entryNotes() {
            return this.formEntry.notes;
        }
    },
    watch: {
        entryType: function (newItem, item) {
            if (this.expanded.length > 0 && this.editingMode) {
                let { id, editing } = this.expanded[0];
                let updates = { type: newItem };
                if (!editing) updates.editing = true;
                if (!this.editItemDefaults.hasOwnProperty(id)) this.editItemDefaults[id] = {};
                if (!this.editItemDefaults[id].hasOwnProperty('type')) this.editItemDefaults[id] = { ...this.editItemDefaults[id], type: item };
                this.$store.commit('transactions/update', { id, updates });
            }
        },
        entryNotes: function (newItem, item) {
            if (this.expanded.length > 0 && this.editingMode) {
                let { id, editing } = this.expanded[0];
                let updates = { notes: newItem };
                if (!editing) updates.editing = true;
                if (!this.editItemDefaults.hasOwnProperty(id)) this.editItemDefaults[id] = {};
                if (!this.editItemDefaults[id].hasOwnProperty('notes')) this.editItemDefaults[id] = { ...this.editItemDefaults[id], notes: item };
                this.$store.commit('transactions/update', { id, updates });
            }
        }
    },
    async created() {
        await this.$store.dispatch('transactions/get', { tenant: this.loggeduser.tenantid });
        if (!(Object.values(this.accounts).length > 0))
            await this.$store.dispatch('accounts/get', this.tenant);
    }
}
</script>

<style scoped>
    .toolbar-container {
        width:                  100%;
        position:               fixed;
        z-index:                4;
        bottom:                 35px;
        right:                  0;
    }
    .toolbar-container .col {
        width:                  100%;
    }
    .form-toolbar {
        width:                  100%;
    }
    .form-toolbar .v-toolbar {
        /* v-sheet default color is white, need to turn it transparent to remove for the border-radius apply its design */
        /* v-sheet need to contain the toolbar in order for the border radius to take effect */
        box-shadow:             0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -2px 5px 0px rgb(0 0 0 / 14%);
        border-radius:          15px 15px 0 0;
    }
</style>