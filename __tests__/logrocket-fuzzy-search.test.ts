import FuzzySearch from "../src";

const networkReqRes = {
  body: "{}",
  headers: {},
  method: "POST",
};

test("setup method returns request/response logrocket sanitizers", () => {
  const lrfs = FuzzySearch.setup([]);

  expect(lrfs.requestSanitizer);
  expect(lrfs.responseSanitizer);
});

test("passed in keynames are masked", () => {
  const lrfs = new FuzzySearch(["privateKeyName"]);

  networkReqRes.body = JSON.stringify({
    resource: { privateKeyName: 42, publicKeyName: 0 },
  });

  const result = lrfs.requestSanitizer(networkReqRes);

  expect(result.body.resource.privateKeyName).toMatch("*");
  expect(result.body.resource.publicKeyName).toBe(0);
});

test("GET requests are ignored", () => {
  const lrfs = new FuzzySearch(["privateKeyName"]);

  networkReqRes.method = "GET";

  const result = lrfs.requestSanitizer(networkReqRes);

  expect(result).toEqual(networkReqRes);
});

test("type value pairs in request/request body are masked", () => {
  const lrfs = new FuzzySearch(["email"]);

  networkReqRes.body = JSON.stringify({
    contact: { type: "email", value: "secret@ex.com" },
  });

  const result = lrfs.responseSanitizer(networkReqRes);

  expect(result.body.contact.value).toMatch("*");
});
