export default class StringUtil {
    // static titleCase(str: string="") {
    //     return str
    //         .toLowerCase()
    //         .split(" ")
    //         .map(function (word) {
    //             return word.replace(word[0], word[0].toUpperCase());
    //         })
    //         .join(" ");
    // }
    static titleCase(str: string = "") {
        return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
    }
}
