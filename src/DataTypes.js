"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataType = exports.init = exports.DataTypesObject = exports.DataTypes = void 0;
var DataTypes;
(function (DataTypes) {
    DataTypes["register"] = "register";
    DataTypes["error"] = "error";
    DataTypes["name"] = "name";
    DataTypes["message"] = "message";
    DataTypes["request"] = "request";
    DataTypes["answer"] = "answer";
    DataTypes["deploy"] = "deploy";
    DataTypes["send"] = "send";
})(DataTypes = exports.DataTypes || (exports.DataTypes = {}));
exports.DataTypesObject = "{";
var init = function () {
    var i = 0;
    for (var key in DataTypes) {
        exports.DataTypesObject = exports.DataTypesObject.concat((i > 0 ? ", " : ""), key, " = \"", DataTypes[key], "\"");
        i += 1;
    }
    exports.DataTypesObject = exports.DataTypesObject.concat("}");
};
exports.init = init;
var getDataType = function (dataType) {
    for (var key in DataTypes) {
        if (dataType === key) {
            return DataTypes[key];
        }
    }
    return undefined;
};
exports.getDataType = getDataType;
//# sourceMappingURL=DataTypes.js.map