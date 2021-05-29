<template>
    <v-container>
        <div v-if="loading">
            <v-skeleton-loader
                type="article"
            ></v-skeleton-loader>

            <v-divider class="my-7"></v-divider>

            <v-skeleton-loader
                elevation="1"
                type="article, article, actions"
            ></v-skeleton-loader>
        </div>
        <div v-else>
            <v-row no-gutters="" v-if="invoice !== null">

                <v-col class="pt-2">
                    <v-card flat>
                        <v-row no-gutters>
                            <v-col cols="6">
                                <div class="text-h4" v-text="`Invoice #${invoice.invoice_code}`"></div>
                            </v-col>
                            <v-col cols="6" class="d-flex flex-row-reverse">
                                <v-btn rounded outlined small @click="confirmDelete = true">Delete</v-btn>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12" md="6" class="d-flex flex-row">
                                <div class="mr-4"><b>Status:</b> {{status}}</div>
                                <div><b>Customer:</b> {{invoice.customer.account}}</div>
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex justify-md-end">
                                <div class="mr-4"><b>Amount Due:</b> {{amountdue}}</div>
                                <div><b>Due On:</b> {{ invoice.dateDue | moment("MMMM Do, YYYY") }}</div>
                            </v-col>
                        </v-row>

                        <v-divider class="my-5"></v-divider>
                    </v-card>
                </v-col>

                <v-col cols="12" class="my-4">
                    <v-card>
                        <PaymentRecord
                            @payment="addPayment"
                            absolute
                            outlined
                            rounded
                            small
                            buttonText="Add Payment"
                            buttonStyle="top: 22px; right: 22px" />

                        <v-card-title>Payments</v-card-title>

                        <v-card-text>
                            <div class="mx-8 mb-2">
                                <div class="mb-1">
                                    <strong>Amount Due:</strong> {{amountdue}}
                                </div>

                                <div>
                                    <strong>Status:</strong> {{ status_detailed }}
                                </div>
                            </div>
                        </v-card-text>

                        <div v-if="invoice.payments.length > 0">
                            <v-divider class="mx-8"></v-divider>

                            <v-card-text>
                                <div class="font-weight-bold ml-8 mb-2">
                                    Payments received:
                                </div>

                                <v-timeline
                                    align-top
                                    dense
                                >
                                    <PaymentListItem
                                        v-for="(payment, i) in invoice.payments"
                                        :key="i"
                                        :payment="payment"
                                        :key_item="i"
                                        @delete="deletePayment"
                                        @update="editPayment" />
                                </v-timeline>
                            </v-card-text>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" class="my-4">
                    <v-card dark>
                        <InvoiceView :invoice="invoice" />
                    </v-card>
                </v-col>

                <v-dialog
                    v-model="confirmDelete"
                    max-width="290"
                >
                    <v-card rounded="xl">
                        <v-card-title class="headline">Delete Invoice</v-card-title>

                        <v-card-text>
                            Are you sure you want to delete this Invoice?
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="#303030"
                                text
                                @click="confirmDelete = false"
                            >
                                Cancel
                            </v-btn>

                            <v-btn
                                color="#663b0e"
                                dark
                                @click="deleteInvoice"
                            >
                                Delete
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row no-gutters v-else>
                <v-col>
                    <v-card flat class="pa-4">
                        <v-card-title>Document Error</v-card-title>
                        <v-card-subtitle>{{ errors }}</v-card-subtitle>
                        <v-divider class="my-5"></v-divider>
                        <v-card-actions>
                            <v-btn outlined rounded @click="goToInvoices">Go Back to Invoices</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import InvoiceView from '~/components/InvoiceView';
import PaymentRecord from '~/components/PaymentRecord';
import PaymentListItem from '~/components/PaymentListItem';
import { mapState } from 'vuex';

export default {
    data () {
        return {
            loading: false,
            errors: '',
            confirmDelete: false,
            newPayment: null
        }
    },
    methods: {
        goToInvoices () {
            this.$router.push({ path: `/invoices` });
        },
        deleteInvoice () {
            this.$store.dispatch('invoices/delete', { invoice: this.invoice })
                .then(elem => {
                    this.$router.push({ path: `/invoices` });
                })
                .catch(err => {
                    this.errors = err;
                });
        },
        addPayment (payment) {
            this.$store.dispatch('invoices/payment_add', { invoice: this.invoice, payment, user: this.loggeduser })
                .catch(err => {
                    this.errors = err;
                });
        },
        editPayment ({ payment, updates }) {
            console.log(payment);
            console.log(updates);
            this.$store.dispatch('invoices/payment_edit', { invoice: this.invoice.id, payment, updates })
                .catch(err => {
                    this.errors = err;
                });
        },
        deletePayment (payment) {
            this.$store.dispatch('invoices/payment_delete', { invoice: this.invoice.id, payment })
                .catch(err => {
                    this.errors = err;
                });
        }
    },
    computed: {
        ...mapState({
            invoice: state => state.invoices.invoice,
            loggeduser: state => state.auth.loggeduser
        }),
        tenant() {
            return this.loggeduser.tenantid;
        },
        amountdue() {
            let total_paid = 0;
            this.invoice.payments.forEach(elem => {
                total_paid += parseFloat(elem.amount);
            });
            return (parseFloat(this.invoice.total) - parseFloat(total_paid)).toFixed(2);
        },
        status() {
            if (parseFloat(this.amountdue) == parseFloat(this.invoice.total)) return 'Pending';
            if (parseFloat(this.invoice.total) > parseFloat(this.amountdue) && parseFloat(this.amountdue) > 0) return 'Partial';
            return 'Paid';
        },
        status_detailed() {
            if (parseFloat(this.amountdue) == parseFloat(this.invoice.total)) return 'Payment for your invoice is pending.';
            if (parseFloat(this.invoice.total) > parseFloat(this.amountdue) && parseFloat(this.amountdue) > 0) return 'Your invoice is partially paid.';
            return 'Your invoice is fully paid';
        }
    },
    created() {
        if (this.invoice === null) {
            this.loading = true;
            this.$store.dispatch('invoices/details', { code: this.$route.params.id, tenant: this.tenant })
                .catch(err => {
                    this.errors = err;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
        else {
            this.loading = true;
            this.$store.dispatch('invoices/payments', this.invoice.id)
                .catch(err => {
                    this.errors = err;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    components: {
        InvoiceView,
        PaymentRecord,
        PaymentListItem
    }
}
</script>

<style scoped>
</style>