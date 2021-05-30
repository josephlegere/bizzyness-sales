<template>
    <div>
        <v-btn
            v-if="updateButton"
            fab
            x-small
            color="#663b0e"
            dark
            elevation="1"
            class="mr-2"
            @click="updateItem(item)"
        >
            <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn
            v-if="deleteButton"
            fab
            x-small
            color="#663b0e"
            dark
            elevation="1"
            @click="confirmDelete = true"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-dialog
            v-model="confirmDelete"
            max-width="290"
        >
            <v-card rounded="xl">
                <v-card-title class="headline">Delete Customer</v-card-title>

                <v-card-text>
                    Are you sure you want to delete the customer <b>{{ itemData.name }}</b>?
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
                        @click="deleteItem"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        itemData: {
            type: Object,
            required: true
        },
        updateButton: {
            type: Boolean
        },
        deleteButton: {
            type: Boolean
        }
    },
    data() {
        return {
            confirmDelete: false
        }
    },
    methods: {
        updateItem(item) {

        },
        deleteItem() {
            this.$emit('delete', this.itemData);
        }
    },
    computed: {
    }
}
</script>

<style>

</style>