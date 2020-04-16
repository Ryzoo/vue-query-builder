<template>
    <div class="vue-query-builder vue-query-builder-styled">
        <query-builder-group
            :index="0"
            :query.sync="query"
            :ruleTypes="ruleTypes"
            :rules="mergedRules"
            :maxDepth="maxDepth"
            :depth="depth"
            :labels="mergedLabels"
            type="query-builder-group"
        />
    </div>
</template>

<script>
  import QueryBuilderGroup from './components/QueryBuilderGroup.vue';
  import {deepClone, RuleTypes, OperatorType} from './utilities.js';

  const defaultLabels = {
    matchType: "Match Type",
    matchTypeAll: "All",
    matchTypeAny: "Any",
    addRule: "Add Rule",
    removeRule: "&times;",
    addGroup: "Add Group",
    removeGroup: "&times;",
    textInputPlaceholder: "value",
  };

  export default {
    name: 'vue-query-builder',

    components: {
      QueryBuilderGroup
    },

    props: {
      rules: Array,
      labels: {
        type: Object,
        default() {
          return defaultLabels;
        }
      },
      maxDepth: {
        type: Number,
        default: 3,
        validator: function (value) {
          return value >= 1
        }
      },
      value: Object
    },

    data() {
      return {
        depth: 1,
        query: {
          operator: "All",
          children: []
        },
        ruleTypes: {
          [RuleTypes.AGGREGATE]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.EMPTY, OperatorType.N_EMPTY, OperatorType.GREATER, OperatorType.GREATER_OR_EQUAL, OperatorType.SMALLER, OperatorType.SMALLER_OR_EQUAL],
            inputType: RuleTypes.AGGREGATE,
          },
          [RuleTypes.DATE]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.EMPTY, OperatorType.N_EMPTY, OperatorType.GREATER, OperatorType.GREATER_OR_EQUAL, OperatorType.SMALLER, OperatorType.SMALLER_OR_EQUAL],
            inputType: RuleTypes.DATE,
          },
          [RuleTypes.TIME]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.EMPTY, OperatorType.N_EMPTY, OperatorType.GREATER, OperatorType.GREATER_OR_EQUAL, OperatorType.SMALLER, OperatorType.SMALLER_OR_EQUAL],
            inputType: RuleTypes.TIME,
          },
          [RuleTypes.BOOL]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.EMPTY, OperatorType.N_EMPTY],
            inputType: RuleTypes.BOOL,
          },
          [RuleTypes.BOOL_INPUT]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.EMPTY, OperatorType.N_EMPTY],
            inputType: RuleTypes.BOOL_INPUT,
          },
          [RuleTypes.TEXT]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.CONTAINS, OperatorType.N_CONTAINS, OperatorType.EMPTY, OperatorType.N_EMPTY, OperatorType.BEGINS_WITH, OperatorType.ENDS_WITH],
            inputType: RuleTypes.TEXT,
          },
          [RuleTypes.NUMBER]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.CONTAINS, OperatorType.N_CONTAINS, OperatorType.GREATER, OperatorType.GREATER_OR_EQUAL, OperatorType.SMALLER, OperatorType.SMALLER_OR_EQUAL],
            inputType: RuleTypes.NUMBER,
          },
          [RuleTypes.SELECT]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL],
            inputType: RuleTypes.SELECT,
          },
          [RuleTypes.MULTI_SELECT]: {
            operators: [OperatorType.EQUAL, OperatorType.N_EQUAL, OperatorType.CONTAINS, OperatorType.N_CONTAINS, OperatorType.GREATER, OperatorType.GREATER_OR_EQUAL, OperatorType.SMALLER, OperatorType.SMALLER_OR_EQUAL],
            inputType: RuleTypes.MULTI_SELECT,
          },
        }
      }
    },

    computed: {
      mergedLabels() {
        return Object.assign({}, defaultLabels, this.labels);
      },

      mergedRules() {
        let mergedRules = [];
        const self = this;

        this.rules.forEach(function (rule) {
          if (typeof self.ruleTypes[rule.type] !== "undefined") {
            mergedRules.push(Object.assign({}, self.ruleTypes[rule.type], rule));
          }
          else {
            mergedRules.push(rule);
          }
        });

        return mergedRules;
      }
    },

    mounted() {
      this.$watch(
          'query',
          newQuery => {
            this.$emit('input', deepClone(newQuery))
          },
          {deep: true}
      );

      if (typeof this.$options.propsData.value !== "undefined") {
        this.query = Object.assign(this.query, this.$options.propsData.value)
      }
    }
  }
</script>

<style>
    .vue-query-builder-styled .vqb-group .rule-actions {
        margin-bottom: 20px;
    }

    .vue-query-builder-styled .vqb-rule {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .vue-query-builder-styled .vqb-rule label {
        margin-right: 10px;
    }

    .vue-query-builder-styled .vqb-group.depth-1 .vqb-rule,
    .vue-query-builder-styled .vqb-group.depth-2 {
        border-left: 2px solid #8bc34a;
    }

    .vue-query-builder-styled .vqb-group.depth-2 .vqb-rule,
    .vue-query-builder-styled .vqb-group.depth-3 {
        border-left: 2px solid #00bcd4;
    }

    .vue-query-builder-styled .vqb-group.depth-3 .vqb-rule,
    .vue-query-builder-styled .vqb-group.depth-4 {
        border-left: 2px solid #ff5722;
    }
</style>