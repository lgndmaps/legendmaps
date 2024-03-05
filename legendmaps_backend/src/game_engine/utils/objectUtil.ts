export default class ObjectUtil {
    /**
     * Equality test which check if two objects have equal properties
     * does NOT handle arrays or child objects, primitives only
     * @param obj1 E
     * @param obj2
     * @returns
     */
    static shallowEqual(obj1: Object, obj2: Object): boolean {
        let isChanged: boolean = false;
        Object.entries(obj1).forEach(([key1, value1]) => {
            let keyFound: boolean = false;
            const value2 = obj2[key1 as keyof Object];

            if (typeof value2 !== "undefined") {
                keyFound = true;
                if (value1 != value2) {
                    isChanged = true;
                }
            }

            if (!keyFound) {
                isChanged = true;
            }
        });
        return !isChanged;
    }

    /**
     * Shallow copies a set of selected values from one object to another
     * @param sourceObject object to copy from
     * @param targetObject object to copy to
     * @param keys list of keys to copy (strings, numbers, bools only)
     */
    static copyValues(sourceObject: Object, targetObject: Object, keys: string[]) {
        Object.entries(sourceObject).forEach(([key1, value1]) => {
            if (keys.includes(key1)) {
                targetObject[key1] = value1;
            }
        });
    }

    /**
     * Similar to Object.assign, but with exception
     * Shallow copies all string, number, and boolean values from one object to another
     * @param sourceObject object to copy from
     * @param targetObject object to copy to
     * @param includeEmpties any null, undefined or empty string values are not copied
     */
    static copyAllCommonPrimitiveValues(
        sourceObject: Object,
        targetObject: Object,
        excludeKeys: string[] = [],
        includeEmpties: boolean = false,
    ) {
        try {
            Object.entries(sourceObject).forEach(([key1, value1]) => {
                if (key1.charAt(0) == "$") {
                    //ignoring any params that start with $'
                    //console.log("ignoring " + key1);
                } else if (
                    typeof sourceObject[key1] === "number" ||
                    typeof sourceObject[key1] === "string" ||
                    typeof sourceObject[key1] === "boolean"
                ) {
                    if (!includeEmpties && (value1 === undefined || value1 === null || value1 === "")) {
                        // console.log("ignoring " + key1 + " value is " + value1);
                    } else if (excludeKeys.includes(key1)) {
                        // console.log("ignoring " + key1 + " since not on target");
                    } else {
                        targetObject[key1] = value1;
                    }
                } else {
                    // console.log("unsupported type in objected copy: " + typeof sourceObject[key1]);
                }
            });
        } catch (e) {
            console.log(e + " Failed to copy primitive values");
        }
    }

    static enumContainsString(enumCheck: Object, str: string): boolean {
        if (enumCheck != undefined && Object.values(enumCheck) != undefined && Object.values(enumCheck).includes(str)) {
            return true;
        }
        return false;
    }

    static EnumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
        return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
    }
}
