type TGenericRenderBrick = {
    settings: Record<string, any>;
    name: string;
    containerId: string;
    controller: string;
};
export declare const initBrick: ({ settings, name, containerId, controller, }: TGenericRenderBrick) => Promise<void>;
export {};
