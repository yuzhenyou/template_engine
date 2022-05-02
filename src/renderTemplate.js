import lookup from "./lookup";
import parseArray from "./parseArray";

export default function renderTemplate(tokens, data) {
    let result = '';
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (token[0] == 'text') {

            result += token[1];

        } else if (token[0] == 'name') {
            //lookup解决a.b.c的数据格式
            //name可能存在是.的情况，单纯遍历直接返回结果
            if (token[1] == '.') {
                result += data;
            } else {
                result += lookup(data, token[1]);
            }
        } else if (token[0] == '#') {
            //判断[#,show,[xxx]]类型，token[1]可能为布尔值;直接递归调用
            let bool = lookup(data, token[1]);
            if (typeof bool == 'boolean' && bool) {
                result += renderTemplate(token[2], data);
            } else {
                result += parseArray(token, data);
            }
        }
    }
    return result;
}