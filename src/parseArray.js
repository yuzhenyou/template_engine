/*
    递归调用 renderTemplate，调用次数由data决定
*/
import lookup from "./lookup";
import renderTemplate from "./renderTemplate";

export default function parseArray(token, data) {
    let result = '';
    let dataTemp = lookup(data, token[1]);
    for (let i = 0; i < dataTemp.length; i++) {
        result += renderTemplate(token[2], dataTemp[i]);
    }
    return result;
}