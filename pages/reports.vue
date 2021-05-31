<template>
    <v-container>
        <v-row no-gutters>
            <v-col>

				<div class="text-h4 my-5" v-text="'Reports'"></div>

                <v-card class="mb-9 mx-md-5">
                    <v-card-title>Company Assets, Profits</v-card-title>
                    <v-list>
                        <v-list-item-group>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title v-text="'Profit & Loss (Income Statement)'"></v-list-item-title>
                                    <v-list-item-subtitle v-text="'This is a summary of your revenue and expenses, which is used to calculate your profit.'"></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon v-text="'mdi-chevron-right'"></v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title v-text="'Balance Sheet'"></v-list-item-title>
                                    <v-list-item-subtitle v-text="'To calculate the profit made by the company, a summary of revenue and expenditures must be provided.'"></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon v-text="'mdi-chevron-right'"></v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>

                <v-card class="mb-9 mx-md-5">
                    <v-card-title>Bookkeeping</v-card-title>
                    <v-list>
                        <v-list-item-group>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title v-text="'Account Transactions (General Ledger)'"></v-list-item-title>
                                    <v-list-item-subtitle v-text="'All transactions are listed in detail, along with their totals, by account - Every transactions in the Chart of Account.'"></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon v-text="'mdi-chevron-right'"></v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    
}
</script>

<style>

</style>