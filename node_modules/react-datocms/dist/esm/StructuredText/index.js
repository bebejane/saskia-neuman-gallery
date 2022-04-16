var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defaultMetaTransformer, render, renderNodeRule, renderMarkRule, } from 'datocms-structured-text-generic-html-renderer';
import { isBlock, isInlineItem, isItemLink, RenderError, isStructuredText, } from 'datocms-structured-text-utils';
import React, { cloneElement, isValidElement } from 'react';
export { renderNodeRule, renderMarkRule, RenderError };
// deprecated
export { renderNodeRule as renderRule };
export var defaultAdapter = {
    renderNode: React.createElement,
    renderFragment: function (children, key) { return React.createElement(React.Fragment, { key: key }, children); },
    renderText: function (text, key) { return text; }
};
export function appendKeyToValidElement(element, key) {
    if (isValidElement(element) && element.key === null) {
        return cloneElement(element, { key: key });
    }
    return element;
}
export function StructuredText(_a) {
    var data = _a.data, renderInlineRecord = _a.renderInlineRecord, renderLinkToRecord = _a.renderLinkToRecord, renderBlock = _a.renderBlock, renderText = _a.renderText, renderNode = _a.renderNode, renderFragment = _a.renderFragment, customMarkRules = _a.customMarkRules, customRules = _a.customRules, customNodeRules = _a.customNodeRules, metaTransformer = _a.metaTransformer;
    var result = render(data, {
        adapter: {
            renderText: renderText || defaultAdapter.renderText,
            renderNode: renderNode || defaultAdapter.renderNode,
            renderFragment: renderFragment || defaultAdapter.renderFragment
        },
        metaTransformer: metaTransformer,
        customMarkRules: customMarkRules,
        customNodeRules: __spreadArray([
            renderNodeRule(isInlineItem, function (_a) {
                var node = _a.node, key = _a.key;
                if (!renderInlineRecord) {
                    throw new RenderError("The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!", node);
                }
                if (!isStructuredText(data) || !data.links) {
                    throw new RenderError("The document contains an 'itemLink' node, but the passed data prop is not a Structured Text GraphQL response, or data.links is not present!", node);
                }
                var item = data.links.find(function (item) { return item.id === node.item; });
                if (!item) {
                    throw new RenderError("The Structured Text document contains an 'inlineItem' node, but cannot find a record with ID ".concat(node.item, " inside data.links!"), node);
                }
                return appendKeyToValidElement(renderInlineRecord({ record: item }), key);
            }),
            renderNodeRule(isItemLink, function (_a) {
                var node = _a.node, key = _a.key, children = _a.children;
                if (!renderLinkToRecord) {
                    throw new RenderError("The Structured Text document contains an 'itemLink' node, but no 'renderLinkToRecord' prop is specified!", node);
                }
                if (!isStructuredText(data) || !data.links) {
                    throw new RenderError("The document contains an 'itemLink' node, but the passed data prop is not a Structured Text GraphQL response, or data.links is not present!", node);
                }
                var item = data.links.find(function (item) { return item.id === node.item; });
                if (!item) {
                    throw new RenderError("The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ".concat(node.item, " inside data.links!"), node);
                }
                return appendKeyToValidElement(renderLinkToRecord({
                    record: item,
                    children: children,
                    transformedMeta: node.meta
                        ? (metaTransformer || defaultMetaTransformer)({
                            node: node,
                            meta: node.meta
                        })
                        : null
                }), key);
            }),
            renderNodeRule(isBlock, function (_a) {
                var node = _a.node, key = _a.key;
                if (!renderBlock) {
                    throw new RenderError("The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!", node);
                }
                if (!isStructuredText(data) || !data.blocks) {
                    throw new RenderError("The document contains an 'block' node, but the passed data prop is not a Structured Text GraphQL response, or data.blocks is not present!", node);
                }
                var item = data.blocks.find(function (item) { return item.id === node.item; });
                if (!item) {
                    throw new RenderError("The Structured Text document contains a 'block' node, but cannot find a record with ID ".concat(node.item, " inside data.blocks!"), node);
                }
                return appendKeyToValidElement(renderBlock({ record: item }), key);
            })
        ], (customNodeRules || customRules || []), true)
    });
    if (typeof result === 'string') {
        return React.createElement(React.Fragment, null, result);
    }
    return result || null;
}
//# sourceMappingURL=index.js.map