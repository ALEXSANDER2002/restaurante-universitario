import React, { useEffect } from 'react';
import { onReadyDefault } from '../util/initial';
import { initBrick } from '../util/renderBrick';
import { DEBOUNCE_TIME_RENDER } from '../util/constants';
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
const Brand = ({ onReady = onReadyDefault, customization, locale, id = 'brandBrick_container', }) => {
    useEffect(() => {
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
            initBrick(BrandBrickConfig);
        }, DEBOUNCE_TIME_RENDER);
        return () => {
            var _a;
            clearTimeout(timer);
            (_a = window.brandBrickController) === null || _a === void 0 ? void 0 : _a.unmount();
        };
    }, [customization, onReady]);
    return React.createElement("div", { id: id });
};
export default Brand;
