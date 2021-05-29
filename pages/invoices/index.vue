<template>
    <v-row no-gutters="">
        <v-col>
            <v-card>
                <v-card-title>
                    <v-row no-gutters>
                        <!-- <v-col cols="12"  md="6" class="pa-2">
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-col> -->
                        <v-col cols="12" md="6" class="pa-2">
                            <date-range :suggests="suggests" :setDates="datefilter" @update-range="updateDateFilter" />
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="invoices"
                    :search="search"
                    @click:row="open"
                >
                    <template slot="body.append">
                        <tr>
                            <th class="d-flex justify-space-between align-center">TOTAL <span class="d-sm-none">{{total}}</span></th>
                            <th colspan="2" class="pa-0"></th>
                            <th class="d-none d-sm-block align-center">{{total.toFixed(2)}}</th> 
                            <th colspan="2" class="pa-0"></th>
                        </tr>
                    </template>
                    <template v-slot:item.date="{ item }">
                        {{ item.date | moment("dddd, MMMM Do YYYY") }}
                    </template>
                    <template v-slot:item.customer="{ item }">
                        {{ item.customer.account }}
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import moment from 'moment';
    import DateRange from '~/components/DateRange';
    import { mapState } from 'vuex';

    export default {
        data () {
            return {
                datefilter: [],
                suggests: [],
                search: '',
                headers: [
                    {
                        text: 'Invoice No.',
                        align: 'start',
                        sortable: false,
                        value: 'invoice_code',
                    },
                    { text: 'Date', value: 'date' },
                    { text: 'Customer', value: 'customer' },
                    { text: 'Total', value: 'total' },
                    { text: 'Author', value: 'author' },
                    { text: 'Remarks', value: 'remarks' }
                ]
            }
        },
        methods: {
            updateDateFilter(range) {
                this.datefilter = range;
                this.$router.push({path: this.$route.path, query: { start: range[0], end: range[1] }});
                this.filterData();
            },
            open(invoice) {
                this.$store.commit('invoices/setInvoice', invoice);
                this.$router.push({ path: `/invoices/${invoice.invoice_code}` });
            },
            filterData() {
                this.$store.dispatch('invoices/get', { dates: this.datefilter, tenant: this.tenant });
            }
        },
        computed: {
            total: function() {
                return this.invoices.reduce(function(a, c) { return a + Number((c.total) || 0) }, 0);
            },
            tenant() {
                return this.loggeduser.tenantid;
            },
            ...mapState({
                invoices: state => state.invoices.list,
                loggeduser: state => state.auth.loggeduser
            })
        },
        async created() {
            if (this.$route.query.hasOwnProperty('start') && this.$route.query.hasOwnProperty('end')) {
                let { start, end } = this.$route.query;
                this.datefilter = [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')];
            }
            else {
                let start = moment().startOf('week').format('YYYY-MM-DD');
                let end = moment().endOf('week').format('YYYY-MM-DD');

                this.$router.push({path: this.$route.path, query: { start, end }});
                this.datefilter = [start, end]
            }
        },
        // async mounted() {
            //await this.$store.dispatch('invoices/get', this.datefilter);
        // },
        // async asyncData({store}) {
        //     await store.dispatch('invoices/get', this.datefilter);
        // },
        components: {
            DateRange
        }
    }
</script>

<style>

</style>