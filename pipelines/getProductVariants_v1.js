{
  "version": "1",
  "pipeline": {
    "id": "getProductVariants_v1",
    "public": true,
    "input": [
      {"key": "productId", "id": "1"},
      {"key": "showInactive", "id": "2", "optional": true}
    ],
    "output": [
      {"key": "products", "id": "1000"},
      {"key": "characteristics", "id": "1001"}
    ],
    "steps": [
      {
        "type": "extension",
        "id": "@shopgate/products",
        "path": "@shopgate/products/products/getProductVariants.js",
        "input": [
          {"key": "productId", "id": "1"},
          {"key": "showInactive", "id": "2", "optional": true}
        ],
        "output": [
          {"key": "service", "id": "10"},
          {"key": "version", "id": "11"},
          {"key": "path", "id": "12"},
          {"key": "method", "id": "13"},
          {"key": "query", "id": "14"}
        ]
      }, {
        "type": "extension",
        "id": "@shopgate/bigapi",
        "path": "@shopgate/bigapi/big-api/getBigApiResult.js",
        "input": [
          {"key": "service", "id": "10"},
          {"key": "version", "id": "11"},
          {"key": "path", "id": "12"},
          {"key": "method", "id": "13"},
          {"key": "query", "id": "14"}
        ],
        "output": [
          {"key": "products", "id": "100"},
          {"key": "characteristics", "id": "101"}
        ]
      }, {
        "type": "extension",
        "id": "@shopgate/products",
        "path": "@shopgate/products/products/updateAvailableText.js",
        "input": [
          {"key": "products", "id": "100"}
        ],
        "output": [
          {"key": "products", "id": "200"}
        ]
      }, {
        "type": "extension",
        "id": "@shopgate/products",
        "path": "@shopgate/products/products/formatProductVariants.js",
        "input": [{"key": "products", "id": "200"}],
        "output": [{"key": "products", "id": "1000"}]
      }, {
        "type": "extension",
        "id": "@shopgate/products",
        "path": "@shopgate/products/products/sortCharacteristics.js",
        "input": [{"key": "characteristics", "id": "101"}],
        "output": [{"key": "characteristics", "id": "1001"}]
      }
    ]
  }
}