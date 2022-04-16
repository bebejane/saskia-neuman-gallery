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
exports.__esModule = true;
var React = __importStar(require("react"));
var enzyme_1 = require("enzyme");
var __1 = require("..");
var metaTags = [
    {
        "content": "Remix CMS - The easiest way to manage content with Remix",
        "attributes": null,
        "tag": "title"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:title",
            "content": "Remix CMS - The easiest way to manage content with Remix"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "name": "twitter:title",
            "content": "Remix CMS - The easiest way to manage content with Remix"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "name": "description",
            "content": "Remix makes building scalable and fast React apps simple, pair it with a CMS that shares the same intuitiveness. Start a new Remix + Dato project now."
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:description",
            "content": "Remix makes building scalable and fast React apps simple, pair it with a CMS that shares the same intuitiveness. Start a new Remix + Dato project now."
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "name": "twitter:description",
            "content": "Remix makes building scalable and fast React apps simple, pair it with a CMS that shares the same intuitiveness. Start a new Remix + Dato project now."
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:image",
            "content": "https://www.datocms-assets.com/205/1642515293-full-logo.svg?fit=max&fm=jpg&w=1000"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:image:width",
            "content": "746"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:image:height",
            "content": "186"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "name": "twitter:image",
            "content": "https://www.datocms-assets.com/205/1642515293-full-logo.svg?fit=max&fm=jpg&w=1000"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:locale",
            "content": "en"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:type",
            "content": "article"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "og:site_name",
            "content": "DatoCMS"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "property": "article:modified_time",
            "content": "2022-01-18T14:02:47Z"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "name": "twitter:card",
            "content": "summary_large_image"
        },
        "tag": "meta"
    },
    {
        "content": null,
        "attributes": {
            "name": "twitter:site",
            "content": "@datocms"
        },
        "tag": "meta"
    },
    {
        "attributes": {
            "sizes": "16x16",
            "type": "image/png",
            "rel": "icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=16&w=16"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "32x32",
            "type": "image/png",
            "rel": "icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=32&w=32"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "96x96",
            "type": "image/png",
            "rel": "icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=96&w=96"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "192x192",
            "type": "image/png",
            "rel": "icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=192&w=192"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "57x57",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=57&w=57"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "60x60",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=60&w=60"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "72x72",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=72&w=72"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "76x76",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=76&w=76"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "114x114",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=114&w=114"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "120x120",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=120&w=120"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "144x144",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=144&w=144"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "152x152",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=152&w=152"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "sizes": "180x180",
            "rel": "apple-touch-icon",
            "href": "https://www.datocms-assets.com/205/1525789775-dato.png?h=180&w=180"
        },
        "content": null,
        "tag": "link"
    },
    {
        "attributes": {
            "name": "msapplication-square70x70logo",
            "content": "https://www.datocms-assets.com/205/1525789775-dato.png?h=70&w=70"
        },
        "content": null,
        "tag": "meta"
    },
    {
        "attributes": {
            "name": "msapplication-square150x150logo",
            "content": "https://www.datocms-assets.com/205/1525789775-dato.png?h=150&w=150"
        },
        "content": null,
        "tag": "meta"
    },
    {
        "attributes": {
            "name": "msapplication-square310x310logo",
            "content": "https://www.datocms-assets.com/205/1525789775-dato.png?h=310&w=310"
        },
        "content": null,
        "tag": "meta"
    },
    {
        "attributes": {
            "name": "msapplication-square310x150logo",
            "content": "https://www.datocms-assets.com/205/1525789775-dato.png?h=150&w=310"
        },
        "content": null,
        "tag": "meta"
    }
];
describe("renderMetaTags", function () {
    it("generates an array of meta tags", function () {
        var wrapper = (0, enzyme_1.shallow)(React.createElement("head", null, (0, __1.renderMetaTags)(metaTags)));
        expect(wrapper).toMatchSnapshot();
    });
});
describe("renderMetaTagsToString", function () {
    it("generates an array of meta tags", function () {
        expect((0, __1.renderMetaTagsToString)(metaTags)).toMatchSnapshot();
    });
});
describe("toRemixMeta", function () {
    it("generates a meta descriptor", function () {
        expect((0, __1.toRemixMeta)(metaTags)).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.test.js.map