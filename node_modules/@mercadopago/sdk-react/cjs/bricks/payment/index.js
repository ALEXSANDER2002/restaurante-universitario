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
exports.usePaymentBrick = void 0;
const react_1 = __importStar(require("react"));
const constants_1 = require("../util/constants");
const initial_1 = require("../util/initial");
const renderBrick_1 = require("../util/renderBrick");
/**
 * Payment Brick allows you to add several payment methods to a store and save card data for future purchases with just one Brick.
 *
 * Usage:
 *
 * ```ts
 * import Payment, {initMercadoPago} from '@mercadopago/sdk-react'
 *
 * initMercadoPago('YOUR_PUBLIC_KEY')
 *
 * const Example = () => {
 *   return(
 *    <Payment
        initialization:{{ amount: AMOUNT }}, // AMOUNT is the value from the purchase, its the minium data to initialize CardPayment brick
        onSubmit={async () => {}} // Callback called when clicking on the data submission button
      />
 *   )
 * }
 * export default Example
 * ```
 *
 * @see {@link https://www.mercadopago.com/developers/en/docs/checkout-bricks/payment-brick/introduction Payment Brick documentation} for more information.
 */
const Payment = ({ onReady = initial_1.onReadyDefault, onError = initial_1.onErrorDefault, onSubmit = initial_1.onSubmitDefault, onBinChange = initial_1.onBinChangeDefault, onClickEditShippingData = initial_1.onClickEditShippingDataDefault, onClickEditBillingData = initial_1.onClickEditBillingDataDefault, onRenderNextStep = initial_1.onRenderNextStepDefault, onRenderPreviousStep = initial_1.onRenderPreviousStepDefault, initialization, customization, locale, id = 'paymentBrick_container', }) => {
    (0, react_1.useEffect)(() => {
        // Payment uses a debounce to prevent unnecessary reRenders.
        const PaymentBrickController = {
            settings: {
                initialization,
                customization,
                locale,
                callbacks: {
                    onReady,
                    onError,
                    onSubmit,
                    onBinChange,
                    onClickEditShippingData,
                    onClickEditBillingData,
                    onRenderNextStep,
                    onRenderPreviousStep,
                },
            },
            name: 'payment',
            containerId: id,
            controller: 'paymentBrickController',
        };
        const timer = setTimeout(() => {
            (0, renderBrick_1.initBrick)(PaymentBrickController);
        }, constants_1.DEBOUNCE_TIME_RENDER);
        return () => {
            var _a;
            clearTimeout(timer);
            (_a = window.paymentBrickController) === null || _a === void 0 ? void 0 : _a.unmount();
        };
    }, [initialization, customization, onReady, onError, onSubmit, onBinChange]);
    return react_1.default.createElement("div", { id: id });
};
const usePaymentBrick = () => {
    const update = (updateValues) => {
        if (window.paymentBrickController) {
            window.paymentBrickController.update(updateValues);
        }
        else {
            console.warn('[Checkout Bricks] Payment Brick is not initialized yet, please try again after a few seconds.');
        }
    };
    return { update };
};
exports.usePaymentBrick = usePaymentBrick;
exports.default = Payment;
