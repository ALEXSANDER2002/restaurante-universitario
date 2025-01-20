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
const initial_1 = require("../util/initial");
const renderBrick_1 = require("../util/renderBrick");
const constants_1 = require("../util/constants");
/**
 * Brand Brick allows you to communicate different messages related to the payment methods available via Mercado Pago in your store.
 *
 * Usage:
 *
 * ```ts
 * import Brand, {initMercadoPago} from '@mercadopago/sdk-react'
 *
 * initMercadoPago('YOUR_PUBLIC_KEY')
 *
 * const Example = () => {
 *   return(
 *     <Brand />
 *   )
 * }
 * export default Example
 * ```
 *
 * @see {@link https://www.mercadopago.com.ar/developers/en/docs/checkout-bricks/brand-brick/introduction Brand Brick documentation} for more information.
 */
const Brand = ({ onReady = initial_1.onReadyDefault, customization, locale, id = 'brandBrick_container', }) => {
    (0, react_1.useEffect)(() => {
        // Brand uses a debounce to prevent unnecessary reRenders.
        const BrandBrickConfig = {
            settings: {
                customization,
                locale,
                callbacks: {
                    onReady: onReady,
                },
            },
            name: 'brand',
            containerId: id,
            controller: 'brandBrickController',
        };
        const timer = setTimeout(() => {
            (0, renderBrick_1.initBrick)(BrandBrickConfig);
        }, constants_1.DEBOUNCE_TIME_RENDER);
        return () => {
            var _a;
            clearTimeout(timer);
            (_a = window.brandBrickController) === null || _a === void 0 ? void 0 : _a.unmount();
        };
    }, [customization, onReady]);
    return react_1.default.createElement("div", { id: id });
};
exports.default = Brand;
