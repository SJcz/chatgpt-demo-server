module.exports = {
	'root': true,
	'env': {
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint'
	],
	'rules': {
		'indent': [
			'warn',
			'tab',
			{ 'SwitchCase': 1 }
			//强制统一缩进
		],
		'quotes': [
			'warn',
			'single'
			//单引号
		],
		'semi': [
			'warn',
			'never'
			//不加分号
		],
	}
}
