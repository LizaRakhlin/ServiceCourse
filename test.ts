import { assert, expect } from 'chai';
import { TokenFetch, myTenant, myApplicationId, getLabels } from "./token_fetch";
import * as sinon from 'sinon';
import { AuthenticationContext } from 'adal-node';


describe("TokenFetch liveliness", () => {
	it("should call acquireTokenWithClientCredentials once", () => {
		let authenticationContextMock = sinon.mock(AuthenticationContext.prototype);
		authenticationContextMock.expects('acquireTokenWithClientCredentials').once();

		TokenFetch(myTenant, myApplicationId);
		authenticationContextMock.verify();		
	});
});

describe("Get policy labels", () => {
	it("Should return labels as expected", () => {
		var expectedLabelId = 'cab4fc72-41fb-46e1-b2e8-520397b79446';
		var expectedLabelName = 'Dummy Label';

		getLabels(myTenant, myApplicationId).then((labels) => {
			assert(labels.length == 1, 'Number of labels is not correct, expected 1, was ' + labels.length);
			assert(labels[0].name == expectedLabelName, 'Label\'s name is not correct, expected ' 
				+ expectedLabelName + ', was ' + labels[0].name);
			assert(labels[0].id == expectedLabelId, 'Label\'s id is not correct, expected ' 
				+ expectedLabelId + ', was ' + labels[0].id);
		});
			
	})
})
