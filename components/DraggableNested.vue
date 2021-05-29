<template>
    <draggable class="dragArea" tag="ul" :list="items" :group="{ name: 'g1' }" handle=".handle">
        <li v-for="(el, i) in itemConfig" :key="i">
            <v-card
                dense
                class="mb-1"
            >
                <v-row no-gutters>
                    <v-col
                        cols="1"
                        class="d-flex justify-center"
                    >
                        <v-icon class="handle align-self-center">mdi-drag-horizontal</v-icon>
                    </v-col>
                    <!-- <v-col
                        cols="10"
                        md="2"
                    >
                        <v-select
                            :items="rowtypes"
                            v-model="el.rowtype"
                            placeholder="type"
                            dense
                            hide-details
                            hide-selected
                            solo
                            flat
                            clearable
                            clear-icon="mdi-close-circle"
                        ></v-select>
                    </v-col> -->
                    <v-col
                        v-if="el.hasOwnProperty('rowtype') && focusRowTypes.includes(el.rowtype)"
                        v-for="(data, i) in headers"
                        :key="i"
                        cols="10"
                        :md="data.colsize ? data.colsize : 1"
                        offset="1"
                        offset-md="0"
                    ><!-- offsets will be null if its the first element -->
                        <v-textarea
                            class="design-textarea"
                            :placeholder="data.text"
                            v-model="el[data.value]"
                            :readonly="data.readonly"
                            autoGrow
                            dense
                            hide-details
                            rows="1"
                        ></v-textarea>
                    </v-col>

                    <v-col 
                        v-if="el.hasOwnProperty('rowtype') && el.rowtype === 'newline'"
                        cols="1"
                        offset="1"
                        offset-md="0"
                    >
                        <v-text-field
                            class="design-textarea"
                            type="number"
                            placeholder="Rows"
                            v-model="el.size"
                            dense
                            rows="1"
                            :rules="[v => !!v || 'Required', v => ( v && v >= 1 ) || '>= 1', v => ( v && v <= 10 ) || '<= 10']"
                        ></v-text-field>
                    </v-col>
                    <v-col 
                        v-if="el.hasOwnProperty('rowtype') && el.rowtype === 'newline'"
                        cols="8"
                        md="7"
                    >
                        <v-textarea
                            class="design-textarea"
                            placeholder="New Line"
                            readonly
                            no-resize
                            dense
                            hide-details
                            :rows="el.size"
                        ></v-textarea>
                    </v-col>

                    <!-- This will be the v-else, including a v-else below a v-if inline with a v-for  -->
                    <!-- will create a v-else for all the v-if inline with v-for  -->
                    <v-col 
                        v-if="!el.hasOwnProperty('rowtype') || el.rowtype === null"
                        cols="10"
                        md="8"
                        offset="1"
                        offset-md="0"
                    ></v-col>
                    <v-col
                        cols="1"
                    >
                        <v-btn
                            icon
                        >
                            <client-only>
                                <v-icon class="handle" @click="removeAt(i)">mdi-close</v-icon>
                            </client-only>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
                
            <draggable-nested :headers="headers" :items="el.items" />
        </li>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';

export default {
    name: 'draggable-nested',
    props: {
        items: {
            type: Array,
            required: true
        },
        headers: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        rowtypes: [
            {
                text: 'Material / Job',
                value: 'entry'
            },
            {
                text: 'New Line',
                value: 'newline'
            }
        ],
        focusRowTypes: ['entry'] //entry is material or job, all focus items will go here
    }),
    methods: {
        removeAt(i) {
            //console.log(`delete ${i}`)
            this.items.splice(i, 1);
        }
    },
    computed: {
        itemConfig: function () {
            return this.items.map(elem => {
                this.headers.forEach(heads => {
                    if (heads.hasOwnProperty('input')) {
                        if (heads.input.hasOwnProperty('compute')) { //for computations
                            let _items = heads.input.items.map(x => parseFloat(elem[x]));
                            let _value = _items.reduce(heads.input.compute);
                            elem[heads.value] = isNaN(_value) || parseInt(_value) === 0 ? '' : _value.toFixed(2);
                        }
                        else if (heads.input.hasOwnProperty('join')) { //for concatinating string
                            let _items = heads.input.items.map(x => elem[x]);
                            let _value = _items.reduce(heads.input.join);
                            elem[heads.value] = _value;
                        }
                        else {
                            console.error(`Add "Compute" or "Join" property in your input object for "${heads.value}"!`);
                        }
                        //console.log(elem)
                    }
                });
                return elem;
            });
        }
    },
    components: {
        draggable
    }
}
</script>

<style>
    .drag-list {
        padding:                    0 !important;
    }
    .dragArea li {
        /* outline:                    1px solid; */
        list-style:                 none;
    }
    .design-textarea.v-text-field > .v-input__control > .v-input__slot:before {
        border-style:               none;
    }
    .design-textarea.v-text-field > .v-input__control > .v-input__slot:after {
        border-style:               none;
    }
</style>