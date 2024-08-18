declare module "*.module.css";
declare module "*.module.scss";

declare module "*.svg?react" {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default ReactComponent;
}
