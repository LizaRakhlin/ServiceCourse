import { expect } from "chai";
import { TokenFetch } from "./token_fetch";

describe("TokenFetch liveliness", () => {
	it("should run", () => {
		TokenFetch();
	});
});
