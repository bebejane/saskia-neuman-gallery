"use strict";
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
exports.__esModule = true;
var enzyme_1 = require("enzyme");
var React = __importStar(require("react"));
var index_1 = require("../index");
var datocms_structured_text_utils_1 = require("datocms-structured-text-utils");
var datocms_structured_text_generic_html_renderer_1 = require("datocms-structured-text-generic-html-renderer");
describe('StructuredText', function () {
    describe('with no value', function () {
        it('renders null', function () {
            var wrapper = (0, enzyme_1.mount)(React.createElement(index_1.StructuredText, { data: null }));
            expect(wrapper).toMatchSnapshot();
        });
    });
    describe('simple dast /2', function () {
        var structuredText = {
            schema: 'dast',
            document: {
                type: 'root',
                children: [
                    {
                        type: 'heading',
                        level: 1,
                        children: [
                            {
                                type: 'span',
                                value: 'This\nis a '
                            },
                            {
                                type: 'span',
                                marks: ['strong'],
                                value: 'title'
                            },
                        ]
                    },
                ]
            }
        };
        describe('with default rules', function () {
            it('renders the document', function () {
                var wrapper = (0, enzyme_1.mount)(React.createElement(index_1.StructuredText, { data: structuredText }));
                expect(wrapper).toMatchSnapshot();
            });
        });
        describe('with custom mark rules', function () {
            it('renders the document', function () {
                var wrapper = (0, enzyme_1.mount)(React.createElement(index_1.StructuredText, { data: structuredText, customMarkRules: [
                        (0, datocms_structured_text_generic_html_renderer_1.renderMarkRule)('strong', function (_a) {
                            var children = _a.children, key = _a.key;
                            return (React.createElement("b", { key: key }, children));
                        }),
                    ] }));
                expect(wrapper).toMatchSnapshot();
            });
        });
    });
    describe('simple dast with no links/blocks', function () {
        var structuredText = {
            value: {
                schema: 'dast',
                document: {
                    type: 'root',
                    children: [
                        {
                            type: 'heading',
                            level: 1,
                            children: [
                                {
                                    type: 'span',
                                    value: 'This\nis a '
                                },
                                {
                                    type: 'span',
                                    marks: ['strong'],
                                    value: 'title'
                                },
                            ]
                        },
                    ]
                }
            }
        };
        describe('with default rules', function () {
            it('renders the document', function () {
                var wrapper = (0, enzyme_1.mount)(React.createElement(index_1.StructuredText, { data: structuredText }));
                expect(wrapper).toMatchSnapshot();
            });
        });
        describe('with custom rules', function () {
            it('renders the document', function () {
                var wrapper = (0, enzyme_1.mount)(React.createElement(index_1.StructuredText, { data: structuredText, renderText: function (text, key) {
                        return (React.createElement(React.Fragment, { key: key }, text.replace(/This/, 'That')));
                    }, customNodeRules: [
                        (0, index_1.renderNodeRule)(datocms_structured_text_utils_1.isHeading, function (_a) {
                            var renderNode = _a.adapter.renderNode, node = _a.node, children = _a.children, key = _a.key;
                            return renderNode("h".concat(node.level + 1), { key: key }, children);
                        }),
                    ] }));
                expect(wrapper).toMatchSnapshot();
            });
        });
    });
    describe('with links/blocks', function () {
        var structuredText = {
            value: {
                schema: 'dast',
                document: {
                    type: 'root',
                    children: [
                        {
                            type: 'heading',
                            level: 1,
                            children: [
                                {
                                    type: 'span',
                                    value: 'This is a'
                                },
                                {
                                    type: 'span',
                                    marks: ['highlight'],
                                    value: 'title'
                                },
                                {
                                    type: 'inlineItem',
                                    item: '123'
                                },
                                {
                                    type: 'itemLink',
                                    item: '123',
                                    meta: [{ id: 'target', value: '_blank' }],
                                    children: [{ type: 'span', value: 'here!' }]
                                },
                            ]
                        },
                        {
                            type: 'block',
                            item: '456'
                        },
                    ]
                }
            },
            blocks: [
                {
                    id: '456',
                    __typename: 'QuoteRecord',
                    quote: 'Foo bar.',
                    author: 'Mark Smith'
                },
            ],
            links: [
                {
                    id: '123',
                    __typename: 'DocPageRecord',
                    title: 'How to code',
                    slug: 'how-to-code'
                },
            ]
        };
        describe('with default rules', function () {
            it('renders the document', function () {
                var wrapper = (0, enzyme_1.mount)(React.createElement(index_1.StructuredText, { data: structuredText, renderInlineRecord: function (_a) {
                        var record = _a.record;
                        switch (record.__typename) {
                            case 'DocPageRecord':
                                return React.createElement("a", { href: "/docs/".concat(record.slug) }, record.title);
                            default:
                                return null;
                        }
                    }, renderLinkToRecord: function (_a) {
                        var record = _a.record, children = _a.children, transformedMeta = _a.transformedMeta;
                        switch (record.__typename) {
                            case 'DocPageRecord':
                                return (React.createElement("a", __assign({}, transformedMeta, { href: "/docs/".concat(record.slug) }), children));
                            default:
                                return null;
                        }
                    }, renderBlock: function (_a) {
                        var record = _a.record;
                        switch (record.__typename) {
                            case 'QuoteRecord':
                                return (React.createElement("figure", null,
                                    React.createElement("blockquote", null, record.quote),
                                    React.createElement("figcaption", null, record.author)));
                            default:
                                return null;
                        }
                    } }));
                expect(wrapper).toMatchSnapshot();
            });
        });
        describe('with missing renderInlineRecord prop', function () {
            it('raises an error', function () {
                expect(function () {
                    (0, enzyme_1.shallow)(React.createElement(index_1.StructuredText, { data: structuredText }));
                }).toThrow(index_1.RenderError);
            });
        });
        describe('with missing record', function () {
            it('raises an error', function () {
                expect(function () {
                    (0, enzyme_1.shallow)(React.createElement(index_1.StructuredText, { data: __assign(__assign({}, structuredText), { links: [] }), renderInlineRecord: function () {
                            return null;
                        } }));
                }).toThrow(index_1.RenderError);
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map