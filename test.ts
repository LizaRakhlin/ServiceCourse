import { expect } from 'chai';
import { TokenFetch, myTenant, myApplicationId } from "./token_fetch";
import * as sinon from 'sinon';
import { AuthenticationContext } from 'adal-node';

//const tenant = "992d8d2f-5bb8-4131-9791-1f4b4a48e6d0";
//const applicationId = "9e6d8f78-eb08-40a6-b8ff-a9dcf9d2f038";

describe("TokenFetch liveliness", () => {
	it("should call acquireTokenWithClientCredentials once", () => {
		let authenticationContextMock = sinon.mock(AuthenticationContext.prototype);
		authenticationContextMock.expects('acquireTokenWithClientCredentials').once();

		TokenFetch(myTenant, myApplicationId);
		authenticationContextMock.verify();		
	});
});
