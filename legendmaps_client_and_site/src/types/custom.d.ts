declare module "phaser-react-tools";

declare module "phaser3-rex-plugins/plugins/webfontloader-plugin";
declare module "phaser3-rex-plugins/plugins/canvas-plugin";

declare module "*.svg" {
    const content: any;
    //@ts-ignore
    export default content;
}
