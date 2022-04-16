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
export function toRemixMeta(metaTags) {
    if (!metaTags) {
        return {};
    }
    return metaTags.reduce(function (acc, tag) {
        var _a;
        if (tag.tag === 'title') {
            return tag.content ? __assign(__assign({}, acc), { title: tag.content }) : acc;
        }
        if (tag.tag === 'link') {
            return acc;
        }
        if (!tag.attributes) {
            return acc;
        }
        return __assign(__assign({}, acc), (_a = {}, _a['property' in tag.attributes
            ? tag.attributes.property
            : tag.attributes.name] = tag.attributes.content, _a));
    }, {});
}
//# sourceMappingURL=remixUtils.js.map