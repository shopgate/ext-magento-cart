{
  "version": "1",
  "pipeline": {
    "id": "getProduct_v1",
    "public": true,
    "input": [
      {"key": "productId", "id": "1"},
      {"key": "characteristics", "id": "2", "optional": true},
      {"key": "sgxsMeta", "id": "750"}
    ],
    "output": [
      {"key": "id", "id": "100"},
      {"key": "name", "id": "101"},
      {"key": "manufacturer", "id": "104"},
      {"key": "identifiers", "id": "105"},
      {"key": "ageRating", "id": "106"},
      {"key": "stock", "id": "107"},
      {"key": "rating", "id": "108"},
      {"key": "flags", "id": "109"},
      {"key": "parent", "id": "301", "optional": true},
      {"key": "featuredImageUrl", "id": "200"},
      {"key": "price", "id": "300"},
      {"key": "liveshoppings", "id": "310"},
      {"key": "highlight", "id": "320"},
      {"key": "availability", "id": "330"},
      {"key": "active", "id": "340"},
      {"key": "characteristics", "id": "350", "optional": true}
    ],
    "steps": [
      {
        "type": "staticValue",
        "input": [{"key": "value", "id": "1"}],
        "values": [{"key": "values", "toArray": "value"}],
        "output": [{"key": "values", "id": "10"}]
      }, {
        "type": "pipeline",
        "id": "getProducts_v1",
        "input": [
          {"key": "productIds", "id": "10"},
          {"key": "characteristics", "id": "2", "optional": true},
          {"key": "sgxsMeta", "id": "750"}
        ],
        "output": [{"key": "products", "id": "20"}]
      }, {
        "type": "extension",
        "id": "@shopgate/products",
        "path": "@shopgate/products/helpers/firstElementOfArray.js",
        "input": [{"key": "array", "id": "20"}],
        "output": [
          {"key": "id", "id": "100"},
          {"key": "name", "id": "101"},
          {"key": "manufacturer", "id": "104"},
          {"key": "identifiers", "id": "105"},
          {"key": "ageRating", "id": "106"},
          {"key": "stock", "id": "107"},
          {"key": "rating", "id": "108"},
          {"key": "flags", "id": "109"},
          {"key": "parent", "id": "301", "optional": true},
          {"key": "featuredImageUrl", "id": "200"},
          {"key": "price", "id": "300"},
          {"key": "liveshoppings", "id": "310"},
          {"key": "highlight", "id": "320"},
          {"key": "availability", "id": "330"},
          {"key": "active", "id": "340"},
          {"key": "characteristics", "id": "350", "optional": true}
        ]
      }
    ]
  }
}