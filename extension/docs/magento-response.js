/**
 * @typedef {object} MagentoErrorResponseBody
 * @property {MagentoErrorResponseBodyMessages} messages
 */
/**
 * @typedef {object} MagentoErrorResponseBodyMessages
 * @property {MagentoResponseBodyMessagesError[]} error
 */
/**
 * @typedef {object} MagentoResponseBodyMessagesError
 * @property {string} code - this is not accurate, use the response HTTP code instead
 * @property {string} message - error message, sometimes not very nicely worded
 */
/**
 * @typedef {object} MagentoResponseCart
 * @property {string} applied_rule_ids - comma delimited ID's of sale rules (coupons and other discounts) applied to the cart
 * @property {string} base_currency_code - default store currency setting, e.g. EUR, USD
 * @property {string} base_grand_total - default store currency grand total, total price in format "399.9800"
 * @property {string} base_subtotal - default store price before taxes, shipping, discounts in format "399.9800"
 * @property {string} base_subtotal_with_discount - default store subtotal with discount
 * @property {string} base_to_global_rate - conversion rate of currencies
 * @property {string} base_to_quote_rate
 * @property {string} cart_price_display_settings
 * @property {string} checkout_method
 * @property {string} converted_at - this is *possibly* the time the cart was purchased
 * @property {string} coupon_code - coupon code applied to the cart, by default only one coupon can be applied
 * @property {string} created_at - when the cart was created
 * @property {string} customer_dob - customer date of birth
 * @property {string} customer_email - customer email, unique per website, e.g. 2 websites can have the same email
 * @property {string} customer_prefix
 * @property {string} customer_firstname - customer first name
 * @property {string} customer_middlename - customer middle name
 * @property {string} customer_lastname - customer last name
 * @property {string} customer_suffix
 * @property {string} customer_gender - "m" or "f"
 * @property {string} customer_group_id - magento internal group ID applied to the customer, there can be custom groups created
 * @property {string} customer_id - id of the customer, unique index, can be used as reference
 * @property {string} customer_is_guest - is set to 0 if the customer is logged in
 * @property {string} customer_note
 * @property {string} customer_note_notify
 * @property {string} customer_taxvat
 * @property {string} customer_tax_class_id - internal Mage id for tax class used, e.g. "3"
 * @property {string} entity_id - the unique index Quote ID, this can be used as reference
 * @property {string} ext_shipping_info
 * @property {string} gift_message_id
 * @property {string} global_currency_code - e.g. EUR, USD
 * @property {string} grand_total - current currency grand total, format "399.9800"
 * @property {string} is_active - whether quote is active/enabled or not. Format "0" or "1". Caveat: a purchased quote is not enabled.
 * @property {string} is_changed - Format "0" or "1"
 * @property {string} is_multi_shipping - shipping to multiple destinations is enabled or not
 * @property {string} is_persistent
 * @property {string} is_virtual
 * @property {MagentoResponseItem[]} items
 * @property {string} items_count - number of unique items in cart, does not account for quantities
 * @property {string} items_qty - takes into account quantities of all items
 * @property {string} orig_order_id - is set to "0" on a non-purchased cart
 * @property {null} password_hash - not sure if this is ever populated
 * @property {string} quote_currency_code - current cart currency setting, e.g. "EUR", "USD"
 * @property {string} remote_ip - populated if the cart is not created by us
 * @property {string} reserved_order_id - can be used as reference for the order, only shows up if the cart is purchased
 * @property {string} shopgate_cart_type - framework plugin specific setting
 * @property {string} shopgate_payment_fee - framework plugin specific setting
 * @property {string} store_currency_code - current store currency code, e.g. EUR
 * @property {string} store_id - id of the store that is used to connect to, unique index and can be referenced
 * @property {string} store_to_base_rate - e.g. 1.0000
 * @property {string} store_to_quote_rate - e.g. 1.0000
 * @property {string} subtotal - current store subtotal
 * @property {string} subtotal_with_discount - current store subtotal with discount
 * @property {MagentoResponseTotals} totals - totals details
 * @property {string} updated_at - when the cart was updated last, e.g. "2018-02-28 03:59:05"
 */
/**
 * @typedef {object} MagentoResponseItem
 * @property {string} additional_data
 * @property {string} applied_rule_ids
 * @property {string} base_cost
 * @property {string} base_discount_amount
 * @property {string} base_hidden_tax_amount
 * @property {string} base_price
 * @property {string} base_price_incl_tax
 * @property {string} base_row_total
 * @property {string} base_row_total_incl_tax
 * @property {string} base_tax_amount
 * @property {string} base_tax_before_discount
 * @property {string} base_weee_tax_applied_amount
 * @property {string} base_weee_tax_applied_row_amnt
 * @property {string} base_weee_tax_disposition
 * @property {string} base_weee_tax_row_disposition
 * @property {string} created_at - when the item was added to cart, e.g 2018-02-28 03:45:32
 * @property {string} custom_price
 * @property {string} description
 * @property {string} discount_amount
 * @property {string} discount_percent
 * @property {string} free_shipping
 * @property {string} gift_message_id
 * @property {boolean} has_error - false by default
 * @property {string} hidden_tax_amount
 * @property {string} is_qty_decimal
 * @property {string} is_recurring
 * @property {string} is_virtual - virtual are item types that do not need to be shipped, e.g. downloadable music
 * @property {string} item_id - cart item ID, not the product's ID
 * @property {string} name - title of the product
 * @property {string} no_discount - seems to be "0" for true
 * @property {string} original_custom_price
 * @property {string} parent_item_id
 * @property {string} price
 * @property {string} price_incl_tax
 * @property {object} product
 * @property {string} product_id - actual unique index product ID as it is in the mage database
 * @property {string} product_type - e.g. "simple"
 * @property {number} qty - e.g. 2
 * @property {objects[]} qty_options
 * @property {string} quote_id - just a reference upwards
 * @property {string} redirect_url
 * @property {string} row_total
 * @property {string} row_total_incl_tax
 * @property {string} row_total_with_discount - "0.0000" when no discount
 * @property {string} row_weight - total weight in whatever units are assigned
 * @property {string} sku
 * @property {string} store_id
 * @property {string} tax_amount
 * @property {string} tax_before_discount
 * @property {string} tax_class_id
 * @property {string} tax_percent
 * @property {string} updated_at
 * @property {string} weee_tax_applied - serialized string
 * @property {string} weee_tax_applied_amount
 * @property {string} weee_tax_disposition
 * @property {string} weee_tax_row_disposition
 * @property {string} weight - weight of 1 of such product
 */
/**
 * @typedef {object} MagentoResponseTotals
 * @property {MagentoResponseTotalsLineItem} grand_total
 * @property {MagentoResponseTotalsLineItem} subtotal
 */
/**
 * @typedef {object} MagentoResponseTotalsLineItem
 * @property {string} area - e.g. "footer"
 * @property {string} code - e.g. "grand_total", "subtotal"
 * @property {string} title - e.g. "Grand Total", "Subtotal"
 * @property {float} value - e.g. 399.98
 */
