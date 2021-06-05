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
                <ProductCard :record="record" />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import ProductCard from '../components/ProductCard';

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
    },
    components: {
        ProductCard
    }
}
</script>

<style>

</style>