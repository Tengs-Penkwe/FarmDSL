import {Type} from "../ast/Type";
import {FunctionError} from "../Error";
import path from "path";
import fs from "fs";
import {platform} from "os";
import {exec} from "child_process";
import logger from "../Log";

export class Crop {
    static propertiesMetadata = {
        Name: {type: "String", required: true},
        Season: {type: "String", required: true},
        WaterRequirement: {type: "Num", required: true},
        Yield: {type: "Num", required: true},
        SellPrice: {type: "Num", required: true},
    };

    static properties = Object.keys(Crop.propertiesMetadata);

    Name: string;
    Season: "Spring" | "Summer" | "Fall" | "Winter" | "All";
    WaterRequirement: number;
    Yield: number;
    SellPrice: number;

    constructor(props: {[key: string]: Type}) {
        this.Name = props.Name as string;
        this.Season = props.Season as "Spring" | "Summer" | "Fall" | "Winter" | "All";
        this.WaterRequirement = props.WaterRequirement as number;
        this.Yield = props.Yield as number;
        this.SellPrice = props.SellPrice as number;
    }

    getYield(): number {
        return this.Yield;
    }

    getName(): string {
        return this.Name;
    }

    getWater(): number {
        return this.WaterRequirement;
    }

    getPrice(): number {
        return this.SellPrice;
    }

    getSeason(): "Spring" | "Summer" | "Fall" | "Winter" | "All" {
        return this.Season;
    }

    call(funcName: string, args: Type[]): Type {
        if (typeof this[funcName as keyof this] === "function") {
            return (this[funcName as keyof this] as Function)(...args);
        } else {
            throw new FunctionError(`Function ${funcName} does not exist in Crop class`);
        }
    }

    displayCrop() {
        const srcDir = path.join(__dirname, "../static");
        const srcPaths: Set<string> = new Set(fs.readdirSync(srcDir));
        const srcName = `${this.Name.toLowerCase().replace(" ", "_")}.png`;
        const src = srcPaths.has(srcName) ? srcName : "custom.png";
        this.openImage(path.join(srcDir, src));
    }

    private openImage(imagePath: string) {
        let command;
        switch (platform()) {
            case "win32": // Windows
                command = `start ${imagePath}`;
                break;
            case "darwin": // macOS
                command = `open ${imagePath}`;
                break;
            case "linux": // Linux
                command = `xdg-open ${imagePath}`;
                break;
            default:
                throw new Error(`Unsupported platform: ${platform()}`);
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Error opening image: ${error.message}`);
                return;
            }
            logger.info(`Image opened: ${stdout}`);
        });
    }

    OOPCallTest(): number {
        return 1919810;
    }
}
