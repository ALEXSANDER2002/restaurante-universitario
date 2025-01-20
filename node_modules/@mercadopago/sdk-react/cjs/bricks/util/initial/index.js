"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRenderPreviousStepDefault = exports.onRenderNextStepDefault = exports.onClickEditBillingDataDefault = exports.onClickEditShippingDataDefault = exports.onBinChangeDefault = exports.onSubmitDefault = exports.onReadyDefault = exports.onErrorDefault = void 0;
const onSubmitDefault = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.onSubmitDefault = onSubmitDefault;
const onReadyDefault = () => { };
exports.onReadyDefault = onReadyDefault;
const onErrorDefault = (error) => {
    console.error(error);
};
exports.onErrorDefault = onErrorDefault;
const onBinChangeDefault = (bin) => {
    {
        console.log(bin);
    }
};
exports.onBinChangeDefault = onBinChangeDefault;
const onClickEditShippingDataDefault = () => {
    console.log('onClickEditShippingData default implementation');
};
exports.onClickEditShippingDataDefault = onClickEditShippingDataDefault;
const onClickEditBillingDataDefault = () => {
    console.log('onClickEditShippingData default implementation');
};
exports.onClickEditBillingDataDefault = onClickEditBillingDataDefault;
const onRenderNextStepDefault = (currentStep) => {
    console.log(currentStep);
};
exports.onRenderNextStepDefault = onRenderNextStepDefault;
const onRenderPreviousStepDefault = (currentStep) => {
    console.log(currentStep);
};
exports.onRenderPreviousStepDefault = onRenderPreviousStepDefault;
