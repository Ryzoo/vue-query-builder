export const deepClone = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map(deepClone)
	} else if (obj && typeof obj === 'object') {
		let cloned = {}

		Object.keys(obj).forEach(key => {
			cloned[key] = deepClone(obj[key])
		})

		return cloned
	} else {
		return obj
	}
}

const operatorToText = (operator) => {
	switch (operator) {
		case OperatorType.EQUAL:
			return "is equal"
		case OperatorType.N_EQUAL:
			return "is not equal"
		case OperatorType.CONTAINS:
			return "contains"
		case OperatorType.N_CONTAINS:
			return "not contains"
		case OperatorType.EMPTY:
			return "is empty"
		case OperatorType.N_EMPTY:
			return "is not empty"
		case OperatorType.BEGINS_WITH:
			return "begins with"
		case OperatorType.ENDS_WITH:
			return "ends with"
		case OperatorType.GREATER:
			return "is greater"
		case OperatorType.GREATER_OR_EQUAL:
			return "is greater or equals"
		case OperatorType.SMALLER:
			return "is smaller"
		case OperatorType.SMALLER_OR_EQUAL:
			return "is smaller or equals"
	}
	return "--- error, not defined ---";
}

export const mapOperators = (operatorsArray) => {
	return operatorsArray.map(x => ({
		text: operatorToText(x),
		value: x
	}))
}

export class RuleTypes {
	static NUMBER = 0;
	static TEXT = 1;
	static SELECT = 2;
	static MULTI_SELECT = 3;
	static DATE = 4;
	static TIME = 5;
	static BOOL = 6;
}

export class OperatorType {
	static EQUAL = 0;
	static N_EQUAL = 1;
	static CONTAINS = 2;
	static N_CONTAINS = 3;
	static EMPTY = 4;
	static N_EMPTY = 5;
	static BEGINS_WITH = 6;
	static ENDS_WITH = 7;
	static GREATER = 8;
	static GREATER_OR_EQUAL = 9;
	static SMALLER = 10;
	static SMALLER_OR_EQUAL = 11;
}