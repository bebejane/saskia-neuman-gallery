"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.StructuredText = exports.appendKeyToValidElement = exports.defaultAdapter = exports.renderRule = exports.RenderError = exports.renderMarkRule = exports.renderNodeRule = void 0;
var datocms_structured_text_generic_html_renderer_1 = require("datocms-structured-text-generic-html-renderer");
exports.renderNodeRule = datocms_structured_text_generic_html_renderer_1.renderNodeRule;
exports.renderRule = datocms_structured_text_generic_html_renderer_1.renderNodeRule;
exports.renderMarkRule = datocms_structured_text_generic_html_renderer_1.renderMarkRule;
var datocms_structured_text_utils_1 = require("datocms-structured-text-utils");
exports.RenderError = datocms_structured_text_utils_1.RenderError;
var react_1 = __importStar(require("react"));
exports.defaultAdapter = {
    renderNode: react_1["default"].createElement,
    renderFragment: function (children, key) { return react_1["default"].createElement(react_1["default"].Fragment, { key: key }, children); },
    renderText: function (text, key) { return text; }
};
function appendKeyToValidElement(element, key) {
    if ((0, react_1.isValidElement)(element) && element.key === null) {
        return (0, react_1.cloneElement)(element, { key: key });
    }
    return element;
}
exports.appendKeyToValidElement = appendKeyToValidElement;
function StructuredText(_a) {
    var data = _a.data, renderInlineRecord = _a.renderInlineRecord, renderLinkToRecord = _a.renderLinkToRecord, renderBlock = _a.renderBlock, renderText = _a.renderText, renderNode = _a.renderNode, renderFragment = _a.renderFragment, customMarkRules = _a.customMarkRules, customRules = _a.customRules, customNodeRules = _a.customNodeRules, metaTransformer = _a.metaTransformer;
    var result = (0, datocms_structured_text_generic_html_renderer_1.render)(data, {
        adapter: {
            renderText: renderText || exports.defaultAdapter.renderText,
            renderNode: renderNode || exports.defaultAdapter.renderNode,
            renderFragment: renderFragment || exports.defaultAdapter.renderFragment
        },
        metaTransformer: metaTransformer,
        customMarkRules: customMarkRules,
        customNodeRules: __spreadArray([
            (0, datocms_structured_text_generic_html_renderer_1.renderNodeRule)(datocms_structured_text_utils_1.isInlineItem, function (_a) {
                var node = _a.node, key = _a.key;
                if (!renderInlineRecord) {
                    throw new datocms_structured_text_utils_1.RenderError("The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!", node);
                }
                if (!(0, datocms_structured_text_utils_1.isStructuredText)(data) || !data.links) {
                    throw new datocms_structured_text_utils_1.RenderError("The document contains an 'itemLink' node, but the passed data prop is not a Structured Text GraphQL response, or data.links is not present!", node);
                }
                var item = data.links.find(function (item) { return item.id === node.item; });
                if (!item) {
                    throw new datocms_structured_text_utils_1.RenderError("The Structured Text document contains an 'inlineItem' node, but cannot find a record with ID ".concat(node.item, " inside data.links!"), node);
                }
                return appendKeyToValidElement(renderInlineRecord({ record: item }), key);
            }),
            (0, datocms_structured_text_generic_html_renderer_1.renderNodeRule)(datocms_structured_text_utils_1.isItemLink, function (_a) {
                var node = _a.node, key = _a.key, children = _a.children;
                if (!renderLinkToRecord) {
                    throw new datocms_structured_text_utils_1.RenderError("The Structured Text document contains an 'itemLink' node, but no 'renderLinkToRecord' prop is specified!", node);
                }
                if (!(0, datocms_structured_text_utils_1.isStructuredText)(data) || !data.links) {
                    throw new datocms_structured_text_utils_1.RenderError("The document contains an 'itemLink' node, but the passed data prop is not a Structured Text GraphQL response, or data.links is not present!", node);
                }
                var item = data.links.find(function (item) { return item.id === node.item; });
                if (!item) {
                    throw new datocms_structured_text_utils_1.RenderError("The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ".concat(node.item, " inside data.links!"), node);
                }
                return appendKeyToValidElement(renderLinkToRecord({
                    record: item,
                    children: children,
                    transformedMeta: node.meta
                        ? (metaTransformer || datocms_structured_text_generic_html_renderer_1.defaultMetaTransformer)({
                            node: node,
                            meta: node.meta
                        })
                        : null
                }), key);
            }),
            (0, datocms_structured_text_generic_html_renderer_1.renderNodeRule)(datocms_structured_text_utils_1.isBlock, function (_a) {
                var node = _a.node, key = _a.key;
                if (!renderBlock) {
                    throw new datocms_structured_text_utils_1.RenderError("The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!", node);
                }
                if (!(0, datocms_structured_text_utils_1.isStructuredText)(data) || !data.blocks) {
                    throw new datocms_structured_text_utils_1.RenderError("The document contains an 'block' node, but the passed data prop is not a Structured Text GraphQL response, or data.blocks is not present!", node);
                }
                var item = data.blocks.find(function (item) { return item.id === node.item; });
                if (!item) {
                    throw new datocms_structured_text_utils_1.RenderError("The Structured Text document contains a 'block' node, but cannot find a record with ID ".concat(node.item, " inside data.blocks!"), node);
                }
                return appendKeyToValidElement(renderBlock({ record: item }), key);
            })
        ], (customNodeRules || customRules || []), true)
    });
    if (typeof result === 'string') {
        return react_1["default"].createElement(react_1["default"].Fragment, null, result);
    }
    return result || null;
}
exports.StructuredText = StructuredText;
//# sourceMappingURL=index.js.map