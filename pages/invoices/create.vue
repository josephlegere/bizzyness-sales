<template>
    <v-row no-gutters>
        <v-col class="text-center">

            <h3>Invoice</h3>
            <h2>{{invoice_number}}</h2>

            <v-form
                ref="form"
                v-model="validate"
            >
                <v-container>
                    <v-autocomplete
                        v-model="recipient"
                        :rules="recipientRules"
                        :items="customers"
                        :loading="isLoadingCustomers"
                        hide-no-data
                        chips
                        label="Customers"
                        item-text="name"
                        item-value="name"
                        return-object
                        class="mb-4"
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="remove(data.item)"
                            >
                                {{ data.item.name }}
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <template v-if="(typeof data.item !== 'object')">
                                <v-list-item-content v-text="data.item"></v-list-item-content>
                            </template>
                            <template v-else>
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                    <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </template>
                    </v-autocomplete>

                    <v-row no-gutters>
                        <v-col cols="12" md="6" class="pr-md-2">
                            <v-dialog
                                ref="dialogDate"
                                v-model="datepicker_date"
                                :return-value.sync="date"
                                persistent
                                width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="invoiceDate_str"
                                        label="Invoice Date"
                                        readonly
                                        dense
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="date" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="datepicker_date = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogDate.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-col>
                        <v-col cols="12" md="6" class="pl-md-2">
                            <v-dialog
                                ref="dialogDateDue"
                                v-model="datepicker_dateDue"
                                :return-value.sync="dateDue"
                                persistent
                                width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="invoiceDateDue_str"
                                        label="Due Date"
                                        readonly
                                        dense
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="dateDue" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="datepicker_dateDue = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialogDateDue.save(dateDue)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container>
                    <v-toolbar
                        class="mb-1"
                        height="30"
                        elevation="2"
                        collapse
                    >
                        <v-btn icon @click="add">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn icon @click="tablemenu">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <draggable-nested class="drag-list mt-md-3" :headers="headers" :items="list" />
                </v-container>
                <v-menu
                    v-model="showTablemenu"
                    :position-x="tablemenu_X"
                    :position-y="tablemenu_Y"
                    absolute
                    offset-y
                >
                    <v-list>
                        <v-list-item link>
                            <v-list-item-title @click="addNewline">New Line</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <br>
                <br>
                
                <v-row
                    class="toolbar-container"
                    no-gutters
                >
                    <v-col
                        md="5"
                        class="ml-md-auto"
                    >
                        <v-sheet
                            color="transparent"
                            class="form-toolbar">
                            <v-toolbar
                                dark
                                height="60">

                                <v-toolbar-title class="mr-4">Total:</v-toolbar-title>

                                <v-spacer></v-spacer>

                                <!-- Total: -->
                                <v-text-field
                                    v-model="accumulate"
                                    :rules="[v => parseInt(v) > 0 || 'Total is required']"
                                    label="Total"
                                    readonly
                                    solo
                                    flat
                                    dense
                                    hide-details="auto"
                                    background-color="rgba(255,255,255, 0)"
                                    style="width:120px; margin: auto 0"
                                ></v-text-field>

                                <v-spacer></v-spacer>
                                
                                <v-btn
                                    icon
                                    @click="checkValidation(true, 'preview')"
                                >
                                    <v-icon>mdi-printer-search</v-icon>
                                </v-btn>
                                <v-btn
                                    icon
                                    @click="checkValidation(true, 'print')"
                                >
                                    <v-icon>mdi-send-circle-outline</v-icon>
                                </v-btn>

                                <v-dialog v-model="preview" fullscreen hide-overlay transition="dialog-bottom-transition"> <!-- Preview -->
                                    <v-card dark>
                                        <v-toolbar dark color="primary">
                                            <v-btn icon dark @click="preview = false">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                            <v-toolbar-title>Invoice</v-toolbar-title>
                                        </v-toolbar>
                                        <div v-if="preview">
                                            <InvoiceView :invoice="invoice" :key="viewerwKey" :toPrint=false />
                                        </div>

                                    </v-card>
                                </v-dialog>
                                
                                <v-dialog v-model="print" fullscreen hide-overlay transition="dialog-bottom-transition"> <!-- Print -->
                                    <v-card dark>
                                        <v-toolbar dark color="primary">
                                            <v-btn icon dark @click="onSubmit">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                            <v-toolbar-title>Invoice</v-toolbar-title>
                                        </v-toolbar>
                                        <div v-if="print">
                                            <InvoiceView :invoice="invoice" :key="viewerwKey" />
                                        </div>
                                    </v-card>
                                </v-dialog>

                                <v-dialog
                                    v-model="confirmPrint"
                                    max-width="290"
                                >
                                    <v-card>
                                        <v-card-title class="headline">Confirm Submit</v-card-title>

                                        <v-card-text>
                                            Are you sure you want to submit? Check all the details of the invoice before submission.
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                                color="red darken-1"
                                                text
                                                @click="confirmPrint = false"
                                            >
                                                Cancel
                                            </v-btn>

                                            <v-btn
                                                color="primary"
                                                text
                                                @click="confirmPrint = false; print = true"
                                            >
                                                Confirm
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                            </v-toolbar>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import DraggableNested from '~/components/DraggableNested';
import InvoiceView from '~/components/InvoiceView';
import _ from 'lodash';
import { mapActions, mapState } from 'vuex';
import moment from 'moment';

export default {
    data () {
        return {
            validate: false,
            name: 'invoice-create',
            date: new Date().toISOString().substr(0, 10), //no need to specify time as date is user defined
            dateDue: new Date().toISOString().substr(0, 10), //no need to specify time as date is user defined
            datepicker_date: false,
            datepicker_dateDue: false,
            recipient: null,
            recipientRules: [
                v => !!v || 'Recipient is required'
            ],
            // customers: [],
            isLoadingCustomers: false,
            showTablemenu: false,
            tablemenu_X: 0,
            tablemenu_Y: 0,
            rowtypes: ['entry'],
            headers: [
                { value: 'key', text: 'Key' },
                { value: 'description', text: 'Description', colsize: 2 },
                { value: 'quantity', text: 'Quantity' },
                { value: 'price', text: 'Price', colsize: 2 },
                {
                    value: 'amount',
                    text: 'Amount',
                    colsize: 2,
                    readonly: true,
                    input: {
                        items: ['quantity', 'price'],
                        compute: function (a, c) { return a * c }
                    },
                    accumulate: 'sum'
                }
            ],
            list: [],
            currency: 'QR',
            preview: false,
            confirmPrint: false,
            print: false
        }
    },
    methods: {
        add: function() {
            /*let _temp = {};
            
            this.headers.forEach(elem => {
                _temp[elem.value] = '';
            });
            _temp.items = [];
            _temp.rowtype = '';*/

            this.list.push({ rowtype: 'entry', key: 0, description: '', quantity: 0, price: 0, amount: 0, items: [] });
        },
        addNewline: function() {
            this.list.push({ rowtype: 'newline', size: 1, items: [] });
        },
        tablemenu: function (e) {
            e.preventDefault()
            this.showTablemenu = false;
            this.tablemenu_X = e.clientX;
            this.tablemenu_Y = e.clientY;
            this.$nextTick(() => {
                this.showTablemenu = true;
            })
        },
        presets() {
            this.list = [
                { rowtype: 'entry', key: 1, description: 'Job Information Sample', quantity: '', price: '', amount: '', items: [] },
                { rowtype: 'newline', size: 1, items: [] },
                { rowtype: 'entry', key: 4, description: 'Material Item', quantity: 4, price: 5, amount: 20, items: [
                    { rowtype: 'entry', key: 4.1, description: 'Object 1', quantity: 2, price: 3, amount: 6, items: [] }
                ] }
            ];
        },
        temp_customers() {
            this.customers = [
                { header: 'Group 1' },
                { name: 'Sandra Adams', group: 'Group 1' },
                { name: 'Ali Connors', group: 'Group 1' },
                { divider: true },
                { header: 'Group 2' },
                { name: 'Britta Holt', group: 'Group 2' },
                { name: 'Jane Smith ', group: 'Group 2' }
            ];
        },
        remove (item) {
            this.recipient = null;
        },
        accumulate_list (list, headers) { //list => layout, headers => format
            return list.reduce((acc, curr) => {
                let _total;
                headers.forEach(heads => {
                    if (heads.hasOwnProperty('accumulate')) {
                        _total = Number((curr[heads.value]) || 0);
                    }
                });
                if (curr.items.length > 0)
                    _total += this.accumulate_list(curr.items, headers);

                return acc + _total;
            }, 0);
        },
        extractData(list, len = 0) { // extracts data from the displayed data and turn to storable data
            let _items = {};
            let _layout = [];

            list.forEach((elem, key) => {
                let _source = {};
                let _children = [];
                let _push = {};

                if (elem.items.length > 0) {
                    let _child = this.extractData(elem.items, len+1);
                    _children = _child.layout;
                    _items = _.merge(_items, _child.items);
                }

                // if (this.rowtypes.includes(elem.rowtype)) {
                if (elem.rowtype === 'entry') {
                    if (!(_items.hasOwnProperty(elem.rowtype)))
                        _items[elem.rowtype] = {};

                    _items.entry[`${key}${len}`] = {
                        currency: this.currency,
                        name: elem.description,
                        price: elem.price,
                        quantity: elem.quantity
                    }
                    _source.origin = `items/${elem.rowtype}/${key}${len}`;
                }
                else if (elem.rowtype === 'newline') {
                    _source.size = elem.size;
                }
                else
                    _source.content = elem.description;

                if (elem.hasOwnProperty('key')) _push.key = elem.key;
                _push.children = _children;
                _push.source = _source;

                _layout.push(_push);
            });

            return {
                items: _items,
                layout: _layout
            };
        },
        submitInvoice() {
            let { date, dateDue, invoice_code, items, layout, remarks, total } = this.invoice;
            let { account, id, name, tenantid } = this.loggeduser;

            let _invoice = { //invoice format for database
                active: true,
                agent: { account, id, name },
                customer: this.recipient.customer,
                date: this.$fireModule.firestore.Timestamp.fromDate(new Date(date)), //this format is set date from server side
                dateDue: this.$fireModule.firestore.Timestamp.fromDate(new Date(dateDue)), //this format is set date from server side
                invoice_code,
                items,
                layout,
                remarks,
                created: this.$fireModule.firestore.FieldValue.serverTimestamp(),
                tenant: tenantid,
                total
            };

            // console.log(_invoice);
            this.$store.dispatch('invoices/add', _invoice)
            .then((ref) => {
                console.log(ref);
                console.log('Redirect');
            })
            .catch(err => {
                console.error('Error in Store!');
            });
        },
        onSubmit() {
            this.$router.push({ path: `/invoices` });
        },
        checkValidation (isOpen, type) {
            this.$refs.form.validate();

            if (this.validate && isOpen) {
                if (type === 'preview')
                    this.preview = true;
                else if (type === 'print')
                    this.confirmPrint = true;
            }
        }
    },
    computed: {
        invoiceDate_str () {
            return new Date(this.date).toDateString().substr(3, 12);
        },
        invoiceDateDue_str () {
            return new Date(this.dateDue).toDateString().substr(3, 12);
        },
        accumulate () {
            return this.accumulate_list(this.list, this.headers).toFixed(2);
        },
        invoice () {            
            let _records = this.extractData(this.list);

            return {
                author: 'Joseph Legere',
                customer: this.recipient.customer,
                date: this.date,
                dateDue: this.dateDue,
                invoice_code: this.invoice_number,
                items: _records.items, //local
                layout: _records.layout,
                remarks: '',
                total: this.accumulate
            }
        },
        viewerwKey () { //initially to enable rerender of component, now mainly triggers a function (but still need to return a date)
            if (this.print) {
                this.submitInvoice();
            }
            else if (this.preview)
                return Date.now(); //opened
            else
                return 0; //closed
        },
        ...mapState({
            customers: state => state.customers.list,
            loggeduser: state => state.auth.loggeduser,
            invoice_number: state => state.invoices.current
        }),
        tenant() {
            return this.loggeduser.tenantid.split('/')[1];
        }
    },
    watch: {
        date: function (newItem) {
            if (moment(this.dateDue).isBefore(newItem)) {
                this.dateDue = newItem;
            }
        }
    },
    async created() {
        this.presets();
        await this.$store.dispatch('customers/get', this.tenant);
        await this.$store.dispatch('invoices/next', this.tenant);
        // this.temp_customers();
        //console.log(this.extractData(this.list));
    },
    components: {
        DraggableNested,
        InvoiceView
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
        box-shadow:             0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -2px 5px 0px rgb(0 0 0 / 14%);
        border-radius:          15px 15px 0 0;
    }
    .drag-list {
        padding:                0 !important;
    }
</style>