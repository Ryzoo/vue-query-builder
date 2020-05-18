<template>
    <v-card class="vqb-group" :class="classObject">
        <v-card-title>
            <v-select
                v-model="query.operator"
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
                <v-col cols="12">
                    <v-divider/>
                </v-col>
                <v-col cols="12" class="speed-dial-container">
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
                </v-col>
                <v-col cols="12">
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
                            :is="child.type === 'rule' ? 'query-builder-rule' : 'query-builder-group' "
                            :type="child.type"
                            :query.sync="child.query"
                            :ruleTypes="ruleTypes"
                            :rules="rules"
                            :rule="ruleById(child.query.id)"
                            :index="index"
                            :maxDepth="maxDepth"
                            :depth="depth + 1"
                            :labels="labels"
                            v-on:child-deletion-requested="removeChild">
                        </component>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-dialog v-model="showRuleDialog" persistent max-width="800">
            <v-card>
                <v-card-title class="headline">Add new rule</v-card-title>
                <v-card-text>
                    <p>Select an element to describe the rules</p>
                    <v-autocomplete
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
  import {deepClone} from '../utilities.js';

  export default {
    name: "query-builder-group",
    components: {
      QueryBuilderRule
    },
    props: ['ruleTypes', 'type', 'query', 'rules', 'index', 'maxDepth', 'depth', 'labels'],
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

        updated_query.children.push({
          type: 'rule',
          query: {
            id: this.selectedRule.id,
            operator: this.selectedRule.operators[0],
            value: null,
            ruleType: this.selectedRule.type
          }
        });

        this.$emit('update:query', updated_query);
      },
      addGroup() {
        let updated_query = deepClone(this.query);
        if (this.depth < this.maxDepth) {
          updated_query.children.push({
            type: 'group',
            query: {
              operator: this.labels.matchTypeAll,
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
      },
      prepareRules(newValue) {
        const rulesId = this.rulesList.map(x => `${x.value.id}`)
        let updated_query = deepClone(newValue);
        const startCount = updated_query.children.length;
        updated_query.children = updated_query.children.filter((x) => x.type !== 'rule' || rulesId.includes(`${x.query.id}`))
        const endCount = updated_query.children.length;
        if(startCount !== endCount )
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
    watch:{
      query:{
        deep: true,
        handler(newValue){
          this.prepareRules(newValue)
        }
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
        classObject['depth-' + this.depth.toString()] = true;
        return classObject;
      }
    },
    mounted() {
      this.prepareRules(this.query)
    }
  }
</script>

<style lang="scss">
    .group-child > div {
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
        margin-top: -39px;

        button {
            margin-right: 5px;
        }
    }
</style>
