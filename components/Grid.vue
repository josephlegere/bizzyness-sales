<template>
    <div>
        <v-row
            no-gutters
            v-for="(row, i) in rows"
            :key="i"
            cols="12"
        >
            <v-col
                v-for="(record, j) in row"
                :key="j"
                cols="12"
                :sm="Math.floor(12/columns_init)"
            >
                <v-card
                    class="pa-2 ma-2"
                >
                    <v-list-item three-line class="px-2">
                        <v-list-item-content>
                            <v-list-item-title class="text-h5 mb-1">
                                {{ record.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{ record.price }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar
                            tile
                            size="80"
                            color="grey"
                            class="my-2"
                        ></v-list-item-avatar>
                    </v-list-item>
                    <v-card-actions class="d-flex justify-end">
                        <div class="d-flex flex-row align-center elevation-2 px-2 rounded">
                            <v-text-field
                                v-model="quantity"
                                type="number"
                                solo
                                flat
                                dense
                                single-line
                                hide-details
                                :rules="[v => v > 0 || 'Must be 1 or greater!']"
                                style="width: 70px;"
                            ></v-text-field>
                            <div class="ml-1">
                                Qty.
                            </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="#663b0e"
                            dark
                        >
                            Add
                            <v-icon right>mdi-cart</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        records: {
            type: Array,
            required: true
        },
        columns: {
            type: Number
        }
    },
    data () {
        return {
            columns_default: 3,
            quantity: 1
        }
    },
    computed: {
        rows() {
            let _rows = [];
            let section = 0;
            console.log(this.columns_init);
            for (let i = 0; i < Math.ceil(this.records.length / this.columns_init); i++) {
                _rows.push(this.records.slice(section, section + this.columns_init));
                section += this.columns_init;
            }
            return _rows;
        },
        columns_init() {
            return this.columns || this.columns_default;
        }
    },
    created() {
        console.log(this.rows);
    }
}
</script>

<style>

</style>