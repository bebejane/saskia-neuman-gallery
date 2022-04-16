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
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { StructuredText, RenderError, renderNodeRule, } from '../index';
import { isHeading } from 'datocms-structured-text-utils';
import { renderMarkRule } from 'datocms-structured-text-generic-html-renderer';
describe('StructuredText', function () {
    describe('with no value', function () {
        it('renders null', function () {
            var wrapper = mount(React.createElement(StructuredText, { data: null }));
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
                var wrapper = mount(React.createElement(StructuredText, { data: structuredText }));
                expect(wrapper).toMatchSnapshot();
            });
        });
        describe('with custom mark rules', function () {
            it('renders the document', function () {
                var wrapper = mount(React.createElement(StructuredText, { data: structuredText, customMarkRules: [
                        renderMarkRule('strong', function (_a) {
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
                var wrapper = mount(React.createElement(StructuredText, { data: structuredText }));
                expect(wrapper).toMatchSnapshot();
            });
        });
        describe('with custom rules', function () {
            it('renders the document', function () {
                var wrapper = mount(React.createElement(StructuredText, { data: structuredText, renderText: function (text, key) {
                        return (React.createElement(React.Fragment, { key: key }, text.replace(/This/, 'That')));
                    }, customNodeRules: [
                        renderNodeRule(isHeading, function (_a) {
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
                var wrapper = mount(React.createElement(StructuredText, { data: structuredText, renderInlineRecord: function (_a) {
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
                    shallow(React.createElement(StructuredText, { data: structuredText }));
                }).toThrow(RenderError);
            });
        });
        describe('with missing record', function () {
            it('raises an error', function () {
                expect(function () {
                    shallow(React.createElement(StructuredText, { data: __assign(__assign({}, structuredText), { links: [] }), renderInlineRecord: function () {
                            return null;
                        } }));
                }).toThrow(RenderError);
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map