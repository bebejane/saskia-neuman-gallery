var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
export function renderMetaTags(data) {
    return data.map(function (_a) {
        var tag = _a.tag, attributes = _a.attributes, content = _a.content;
        var key = [tag];
        if (attributes && 'property' in attributes) {
            key.push(attributes.property);
        }
        if (attributes && 'name' in attributes) {
            key.push(attributes.name);
        }
        if (attributes && 'rel' in attributes) {
            key.push(attributes.rel);
        }
        if (attributes && 'sizes' in attributes) {
            key.push(attributes.sizes);
        }
        var Tag = tag;
        return (React.createElement(Tag, __assign({ key: key.join('-') }, attributes), content));
    });
}
//# sourceMappingURL=renderMetaTags.js.map