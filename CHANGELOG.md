# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
## [1.2.1] - 2019-04-12
### Fixed
- issue when a cart was deleted from Magento database, now it creates a new one instead of throwing a hard error
- issue inconsistency with customer carts that resulted in "cart does not belong to customer" error

## [1.2.0] - 2019-03-14
### Added
- support for product text input for field and area

## [1.1.3] - 2019-02-27
### Fixed
- Cart item quantity update

## [1.1.2] - 2019-02-21
### Added
- A portal to prevent display of the coupon code when one does not exist

### Changed
- Remove coupon code when a discount does not require a code

## [1.1.1] - 2019-02-08
### Added
- localisation for the message a coupon is invalid

### Changed
- changed pipelines `shopgate.cart.updateProducts.v1` and `shopgate.cart.deleteProducts.v1` to meet specification in the Shopgate developer portal

## [1.1.0] - 2018-10-01
### Added
- support for guest checkout

[Unreleased]: https://github.com/shopgate/ext-magento-cart/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/shopgate/ext-magento-cart/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/shopgate/ext-magento-cart/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/shopgate/ext-magento-cart/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/shopgate/ext-magento-cart/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/shopgate/ext-magento-cart/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/shopgate/ext-magento-cart/compare/v1.0.1...v1.1.0
