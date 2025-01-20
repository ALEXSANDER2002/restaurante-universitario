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
exports.useCardPaymentBrick = void 0;
const react_1 = __importStar(require("react"));
const constants_1 = require("../util/constants");
const initial_1 = require("../util/initial");
const renderBrick_1 = require("../util/renderBrick");
/**
 * Card Payment Brick allows you to offer payments with credit and debit card at yout checkout.
 *
 * Usage:
 *
 * ```ts
 * import CardPayment, {initMercadoPago} from '@mercadopago/sdk-react'
 *
 * initMercadoPago('YOUR_PUBLIC_KEY')
 *
 * const Example = () => {
 *   return(
 *      <CardPayment
 *       initialization={{amount: AMOUNT}} // AMOUNT is the value from the purchase, its the minium data to initialize CardPayment brick
 *       onSubmit={} // Receives a function that send the payment to backend and, through it, to MercadoPago
 *       />
 *  )
 * }
 * export default Example
 * ```
 *
 * @see {@link https://www.mercadopago.com/developers/en/docs/checkout-bricks/card-payment-brick/introduction Card Payment Brick documentation} for more information.
 */
const CardPayment = ({ onReady = initial_1.onReadyDefault, onError = initial_1.onErrorDefault, onSubmit = initial_1.onSubmitDefault, onBinChange = initial_1.onBinChangeDefault, initialization, customization, locale, id = 'cardPaymentBrick_container', }) => {
    (0, react_1.useEffect)(() => {
        // CardPayment uses a debounce to prevent unnecessary reRenders.
        const CardPaymentBrickConfig = {
            settings: {
                initialization,
                customization,
                callbacks: {
                    onReady,
                    onSubmit,
                    onError,
                    onBinChange,
                },
                locale,
            },
            name: 'cardPayment',
            containerId: id,
            controller: 'cardPaymentBrickController',
        };
        const timer = setTimeout(() => {
            (0, renderBrick_1.initBrick)(CardPaymentBrickConfig);
        }, constants_1.DEBOUNCE_TIME_RENDER);
        return () => {
            var _a;
            clearTimeout(timer);
            (_a = window.cardPaymentBrickController) === null || _a === void 0 ? void 0 : _a.unmount();
        };
    }, [initialization, customization, onBinChange, onReady, onError, onSubmit]);
    return react_1.default.createElement("div", { id: id });
};
const useCardPaymentBrick = () => {
    const update = (updateValues) => {
        if (window.cardPaymentBrickController) {
            window.cardPaymentBrickController.update(updateValues);
        }
        else {
            console.warn('[Checkout Bricks] Card Payment Brick is not initialized yet, please try again after a few seconds.');
        }
    };
    return { update };
};
exports.useCardPaymentBrick = useCardPaymentBrick;
exports.default = CardPayment;
