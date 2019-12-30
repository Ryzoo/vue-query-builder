<template>
    <v-card class="vqb-rule">
        <v-card-text>
            <v-btn
                    class="remove-button"
                    color="error"
                    x-small
                    @click="remove"
            >
                <v-icon x-small>fa-times</v-icon>
            </v-btn>

            <v-row>
                <v-col cols="12" sm="6" md="2" class="d-flex align-center">
                    <b>{{ rule.label }}</b>
                </v-col>
                <v-col cols="12" sm="6" md="4" >
                    <v-select
                            hide-details
                            v-model="query.operator"
                            :items="mappedOperators"
                            outlined
                            dense
                            label="Rule"
                    />
                </v-col>
                <v-col cols="12" sm="12" md="6">
                    <v-text-field
                            hide-details
                            outlined
                            v-if="rule.inputType === RuleTypes.TEXT"
                            type="text"
                            v-model="query.value"
                            dense
                            label="Value"
                    />
                    <v-text-field
                            hide-details
                            outlined
                            v-if="rule.inputType === RuleTypes.NUMBER"
                            type="number"
                            v-model="query.value"
                            dense
                            label="Value"
                    />

                    <v-select
                            hide-details
                            dense
                            v-if="rule.inputType === RuleTypes.SELECT || rule.inputType === RuleTypes.MULTI_SELECT"
                            v-model="query.value"
                            :items="selectOptions"
                            :multiple="rule.inputType === RuleTypes.MULTI_SELECT"
                            outlined
                            label="Value"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
	import {deepClone, RuleTypes, mapOperators} from '../utilities.js';

	export default {
		name: "query-builder-rule",

		props: ['query', 'index', 'rule', 'labels'],

		data() {
			return {
				RuleTypes,
				mappedOperators: mapOperators(this.rule.operators)
			}
		},

		beforeMount() {
			if (this.rule.type === 'custom-component') {
				this.$options.components[this.id] = this.rule.component;
			}
		},

		methods: {
			remove: function () {
				this.$emit('child-deletion-requested', this.index);
			},
			updateQuery(value) {
				let updated_query = deepClone(this.query);
				updated_query.value = value;
				this.$emit('update:query', updated_query);
			},
		},

		computed: {
			isCustomComponent() {
				return this.rule.type === 'custom-component';
			},

			selectOptions() {
				if (typeof this.rule.options === 'undefined') {
					return {};
				}
				return this.rule.options.map((x) => ({
					text: x.label,
					value: x.value
				}));
			},
		},

		mounted() {
			let updated_query = deepClone(this.query);

			// Set a default value for these types if one isn't provided already
			if (this.query.value === null) {
				if (this.rule.inputType === 'checkbox') {
					updated_query.value = [];
				}
				if (this.rule.type === 'select') {
					updated_query.value = this.rule.choices[0].value;
				}
				if (this.rule.type === 'custom-component') {
					updated_query.value = this.rule.default || null;
				}

				this.$emit('update:query', updated_query);
			}
		}
	}
</script>
