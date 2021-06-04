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
                    <v-card-title>{{ record.name }}</v-card-title>
                    <v-card-subtitle>{{ record.price }}</v-card-subtitle>
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
            columns_default: 3
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