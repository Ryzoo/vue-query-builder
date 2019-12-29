<template>
    <v-card  class="vqb-rule">
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
                <v-col cols="auto" class="d-flex align-center">
                    <b>{{ rule.label }}</b>
                </v-col>
                <v-col v-if="rule.operands || !isMultipleChoice">
                    <v-select
                            hide-details
                            v-if="rule.operands"
                            v-model="query.selectedOperand"
                            :items="rule.operands"
                            :label="rule.label"
                            outlined
                            dense
                    />
                    <v-select
                            hide-details
                            v-if="!isMultipleChoice"
                            v-model="query.selectedOperator"
                            :items="rule.operators"
                            outlined
                            dense
                    />
                </v-col>
                <v-col>
                    <v-text-field
                            hide-details
                            outlined
                            v-if="rule.inputType === 'text'"
                            type="text"
                            v-model="query.value"
                            dense
                            :placeholder="labels.textInputPlaceholder"
                    />
                    <v-text-field
                            hide-details
                            outlined
                            v-if="rule.inputType === 'number'"
                            type="number"
                            v-model="query.value"
                            dense
                    />

                    <template v-if="isCustomComponent">
                        <component
                                :value="query.value"
                                @input="updateQuery"
                                :is="rule.component"
                        />
                    </template>

                    <div class="checkbox" v-if="rule.inputType === 'checkbox'">
                        <v-checkbox
                                hide-details
                                v-for="choice in rule.choices"
                                :key="choice.value"
                                dense
                                v-model="query.value"
                                :value="choice.value"
                                :label="choice.label"
                        />
                    </div>

                    <div class="radio" v-if="rule.inputType === 'radio'">
                        <v-radio-group
                                class="mt-0"
                                hide-details
                                v-model="query.value"
                                :mandatory="false"
                                dense
                        >
                            <v-radio
                                    hide-details
                                    v-for="choice in rule.choices"
                                    dense
                                    :key="choice.value"
                                    :label="choice.label"
                                    :value="choice.value"
                            />
                        </v-radio-group>
                    </div>

                    <v-select
                            hide-details
                            dense
                            v-if="rule.inputType === 'select'"
                            v-model="query.value"
                            :items="selectOptions"
                            :multiple="rule.type === 'multi-select'"
                            outlined
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
	import deepClone from '../utilities.js';

	export default {
		name: "query-builder-rule",

		props: ['query', 'index', 'rule', 'styled', 'labels'],

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
			isMultipleChoice() {
				return ['radio', 'checkbox', 'select'].indexOf(this.rule.inputType) >= 0;
			},

			isCustomComponent() {
				return this.rule.type === 'custom-component';
			},

			selectOptions() {
				if (typeof this.rule.choices === 'undefined') {
					return {};
				}
                return this.rule.choices.map((x) => ({
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
