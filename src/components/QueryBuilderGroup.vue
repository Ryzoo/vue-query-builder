<template>
    <v-card  class="vqb-group" :class="classObject">
        <v-card-title>
            <v-select
                    v-model="query.logicalOperator"
                    :items="logicalOperatorList"
                    :label="labels.matchType"
                    outlined
                    hide-details
                    dense
            />
            <v-btn
                    class="remove-button"
                    color="error"
                    x-small
                    v-if="this.depth > 1"
                    @click="remove"
            >
                <v-icon x-small>fa-times</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col sm="12" class="mb-2 speed-dial-container">
                    <v-divider/>
                    <v-speed-dial
                            v-model="fab"
                            bottom
                            left
                            direction="right"
                    >
                        <template v-slot:activator>
                            <v-btn
                                    v-model="fab"
                                    color="primary"
                                    x-small
                                    fab
                            >
                                <v-icon v-if="fab">fa-times</v-icon>
                                <v-icon v-else>fa-plus</v-icon>
                            </v-btn>
                        </template>
                        <v-btn
                                color="primary"
                                small
                                @click="tryAddRule"
                        >
                            Add Rule
                        </v-btn>
                        <v-btn
                                color="primary"
                                small
                                v-if="this.depth < this.maxDepth"
                                @click="addGroup"
                        >
                            Add Groups
                        </v-btn>
                    </v-speed-dial>
                </v-col>
                <v-col sm="12" >
                    <div class="group-child px-5 py-2">
                        <v-alert
                                v-if="query.children.length === 0"
                            dense
                            text
                            type="info"
                        >
                            No rules here! Add some <b>rules</b> or <b>group of rules</b> using button above.
                        </v-alert>
                        <component
                                v-for="(child, index) in query.children"
                                :key="index"
                                :is="child.type"
                                :type="child.type"
                                :query.sync="child.query"
                                :ruleTypes="ruleTypes"
                                :rules="rules"
                                :rule="ruleById(child.query.rule)"
                                :index="index"
                                :maxDepth="maxDepth"
                                :depth="depth + 1"
                                :styled="styled"
                                :labels="labels"
                                v-on:child-deletion-requested="removeChild">
                        </component>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-dialog v-model="showRuleDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Add new rule</v-card-title>
                <v-card-text>
                    <p>Select an element to describe the rules</p>
                    <v-select
                            v-model="selectedRule"
                            :items="rulesList"
                            label="Select rule"
                            outlined
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" text @click="showRuleDialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="addRule">Add new rule</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
	import QueryBuilderRule from './QueryBuilderRule.vue';
	import deepClone from '../utilities.js';

	export default {
		name: "query-builder-group",

		components: {
			QueryBuilderRule
		},

		props: ['ruleTypes', 'type', 'query', 'rules', 'index', 'maxDepth', 'depth', 'styled', 'labels'],

		methods: {
			tryAddRule() {
				this.showRuleDialog = true;
			},
			ruleById(ruleId) {
				return this.rules.find(x => x.id === ruleId);
			},

			addRule() {
				this.showRuleDialog = false;
				let updated_query = deepClone(this.query);
				let child = {
					type: 'query-builder-rule',
					query: {
						rule: this.selectedRule.id,
						selectedOperator: this.selectedRule.operators[0],
						selectedOperand: typeof this.selectedRule.operands === "undefined" ? this.selectedRule.label : this.selectedRule.operands[0],
						value: null
					}
				};
				// A bit hacky, but `v-model` on `select` requires an array.
				if (this.ruleById(child.query.rule).type === 'multi-select') {
					child.query.value = [];
				}
				updated_query.children.push(child);
				this.$emit('update:query', updated_query);
			},

			addGroup() {
				let updated_query = deepClone(this.query);
				if (this.depth < this.maxDepth) {
					updated_query.children.push({
						type: 'query-builder-group',
						query: {
							logicalOperator: this.labels.matchTypeAll,
							children: []
						}
					});
					this.$emit('update:query', updated_query);
				}
			},

			remove() {
				this.$emit('child-deletion-requested', this.index);
			},

			removeChild(index) {
				let updated_query = deepClone(this.query);
				updated_query.children.splice(index, 1);
				this.$emit('update:query', updated_query);
			}
		},

		data() {
			return {
				showRuleDialog: false,
				fab: false,
				selectedRule: this.rules[0],
				logicalOperatorList: [
					this.labels.matchTypeAll, this.labels.matchTypeAny
				]
			}
		},

		computed: {
			rulesList() {
				return this.rules.map((x) => ({
					text: x.label,
					value: x
				}))
			},
			classObject() {
				let classObject = {}
				classObject['depth-' + this.depth.toString()] = this.styled;
				return classObject;
			}
		}
	}
</script>

<style lang="scss">
    .group-child > div{
        &:not(:first-of-type) {
            margin-top: 25px;
        }
    }

    .vqb-group {
        .remove-button {
            position: absolute;
            right: 10px;
            top: -10px;
        }
    }

    .speed-dial-container {
        position: relative;

        .v-speed-dial {
            position: absolute;
            left: 10px;
            bottom: -3px;
        }
    }
</style>
