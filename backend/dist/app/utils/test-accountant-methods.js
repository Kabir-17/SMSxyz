"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const credentialGenerator_1 = require("./credentialGenerator");
async function testAccountantMethods() {
    const hasGenerateId = typeof credentialGenerator_1.CredentialGenerator.generateUniqueAccountantId === 'function';
    const hasGenerateCredentials = typeof credentialGenerator_1.CredentialGenerator.generateAccountantCredentials === 'function';
    if (hasGenerateId && hasGenerateCredentials) {
    }
    else {
    }
}
testAccountantMethods();
//# sourceMappingURL=test-accountant-methods.js.map