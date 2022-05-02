export default function lookup(obj, keyName) {

    let splitArr = [];
    let temp = obj;

    if (keyName.indexOf('.') != -1) {

        splitArr = keyName.split('.');
        
        for (let i = 0; i < splitArr.length; i++) {

            temp = temp[splitArr[i]]
        }
        return temp;
    }
    return obj[keyName];

}