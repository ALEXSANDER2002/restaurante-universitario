"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const util_1 = require("../util");
const constants_1 = require("../../bricks/util/constants");
const CardNumber = (params) => {
    const initializationDependencies = (0, util_1.getInitializationDependencies)(params, ['placeholder', 'length']);
    (0, react_1.useEffect)(() => {
        // SecureField uses a debounce to prevent unnecessary reRenders.
        let timer;
        timer = setTimeout(() => {
            (0, util_1.initSecureField)('cardNumber', params)
                .then(instance => window.cardNumberInstance = instance);
        }, constants_1.DEBOUNCE_TIME_RENDER);
        return () => {
            var _a;
            clearTimeout(timer);
            (_a = window.cardNumberInstance) === null || _a === void 0 ? void 0 : _a.unmount();
            window.cardNumberInstance = undefined;
        };
    }, initializationDependencies);
    return react_1.default.createElement("div", { id: "cardNumberSecureField_container" });
};
exports.default = CardNumber;
