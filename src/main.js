import Vue from 'vue'
import VueQueryBuilder from './VueQueryBuilder.vue'
import Vuetify from 'vuetify'
import "vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false
Vue.use(Vuetify)

import {RuleTypes} from './utilities.js';

let rules = [
	{
		type: RuleTypes.TEXT,
		id: 1,
		label: "First Name",
	},
	{
		type: RuleTypes.NUMBER,
		id: 2,
		label: "Age",
	},
	{
		type: RuleTypes.SELECT,
		id: 3,
		label: 'Color',
		options: [
			{label: "red", value: 'Red'},
			{label: "orange", value: 'Orange'},
			{label: "yellow", value: 'Yellow'},
			{label: "green", value: 'Green'},
			{label: "blue", value: 'Blue'},
			{label: "indigo", value: 'Indigo'},
			{label: "violet", value: 'Violet'},
		]
	},
	{
		type: RuleTypes.MULTI_SELECT,
		id: 4,
		label: 'Multi Color',
		options: [
			{label: "red", value: 'Red'},
			{label: "orange", value: 'Orange'},
			{label: "yellow", value: 'Yellow'},
			{label: "green", value: 'Green'},
			{label: "blue", value: 'Blue'},
			{label: "indigo", value: 'Indigo'},
			{label: "violet", value: 'Violet'},
		]
	},
	{
		type: RuleTypes.DATE,
		id: 5,
		label: 'Date'
	},
	{
		type: RuleTypes.TIME,
		id: 6,
		label: 'Time'
	},
	{
		type: RuleTypes.BOOL,
		id: 7,
		label: 'Bool'
	},
	{
		type: RuleTypes.AGGREGATE,
		id: 8,
		label: 'Aggregate'
	},
	{
		type: RuleTypes.BOOL_INPUT,
		id: 9,
		label: 'Bool input'
	},
];

new Vue({
	el: '#app',
	vuetify: new Vuetify({
		icons: {
			iconfont: 'fa',
		},
	}),
	components: {VueQueryBuilder},

	data: {
		rules: rules,
		output: {},
	},

	methods: {
		updateQuery: function (value) {
			this.output = value;
		}
	},

	computed: {
		outputFormatted() {
			return JSON.stringify(this.output, null, 2);
		},
	},
});
