var config = {}

config.endpoint = "https://lirakhli.documents.azure.com:443/";
config.primaryKey = "VhY636sJtSoIsFkyp0ucEAdqZgwUnxBCa5DWhIVeHAXU33dxbhwnabePWdEATZaa2i8k05nAQfAJ4El6bKeJwA==";

config.database = {
	'id': 'LabelsDatabase'
};

config.container = {
	'id': 'LabelsContainer'
};

config.items = {
	'Label1': {
		'id': 'cab4fc72-41fb-46e1-b2e8-520397b79446',
		'name': 'Dummy Label'
	},
	'Label2': {
		'id': '04ee6a7b-1748-4c26-8a33-0c76177c0550',
		'name': 'Dummy Label 1'    		
	},
	'Label3': {
		'id': '7abc256d-a4f8-42cd-8519-d292264699df',
		'name': 'Dummy Label 2'    		
	},
	'Label4': {
		'name': 'Dummy Label 3',
		'id': 'f78066b1-e382-43ae-a0d7-a24c4e052b6a'
	}
};

module.exports = config;

