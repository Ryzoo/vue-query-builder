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
                <v-col cols="12" sm="6" md="2" class="d-flex align-center text-break">
                    <b>{{ rule.label }}</b>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-select
                        hide-details
                        v-model="query.operator"
                        :items="mappedOperators"
                        outlined
                        dense
                        label="Rule"
                    />
                </v-col>
                <v-col cols="12" sm="12" md="6"
                       v-if="query.operator !== OperatorType.EMPTY && query.operator !== OperatorType.N_EMPTY">
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
                        v-if="rule.inputType === RuleTypes.NUMBER || rule.inputType === RuleTypes.AGGREGATE || rule.inputType === RuleTypes.CURRENCY"
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
                    <v-select
                        hide-details
                        dense
                        v-if="rule.inputType === RuleTypes.BOOL || rule.inputType === RuleTypes.BOOL_INPUT"
                        v-model="query.value"
                        :items="boolOptions"
                        outlined
                        label="Value"
                    />
                    <v-dialog
                        v-if="rule.inputType === RuleTypes.DATE"
                        ref="dialog2"
                        v-model="modal"
                        :return-value.sync="query.value"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="query.value"
                                outlined
                                label="Value"
                                dense
                                prepend-icon="far fa-calendar-alt"
                                readonly
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-if="modal"
                            v-model="query.value"
                            full-width
                        >
                            <v-spacer></v-spacer>
                            <v-btn outlined color="primary" @click="modal = false">Cancel</v-btn>
                            <v-btn color="primary" @click="$refs.dialog2.save(query.value)">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>

                    <v-dialog
                        v-if="rule.inputType === RuleTypes.TIME"
                        ref="dialog"
                        v-model="modal2"
                        :return-value.sync="query.value"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="query.value"
                                outlined
                                label="Value"
                                dense
                                prepend-icon="far fa-clock"
                                readonly
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-time-picker
                            v-if="modal2"
                            v-model="query.value"
                            full-width
                        >
                            <v-spacer></v-spacer>
                            <v-btn outlined color="primary" @click="modal2 = false">Cancel</v-btn>
                            <v-btn color="primary" @click="$refs.dialog.save(query.value)">OK</v-btn>
                        </v-time-picker>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
  import {deepClone, RuleTypes, mapOperators, OperatorType} from '../utilities.js';

  export default {
    name: "query-builder-rule",
    props: ['query', 'index', 'rule', 'labels'],
    data() {
      return {
        modal: false,
        date: null,
        modal2: false,
        time: null,
        boolOptions: [
          {text: "TRUE", value: true},
          {text: "FALSE", value: false},
        ],
        RuleTypes,
        OperatorType,
        mappedOperators: mapOperators(this.rule.operators)
      }
    },
    beforeMount() {
      if (this.rule.type === 'custom-component') {
        this.$options.components[this.id] = this.rule.component;
      }
    },
    methods: {
      remove() {
        this.$emit('child-deletion-requested', this.index);
      },
      updateQuery(value) {
        let updated_query = deepClone(this.query);
        updated_query.value = value;
        this.$emit('update:query', updated_query);
      },
    },
    computed: {
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
