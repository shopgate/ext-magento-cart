/**
 * Creates specific UTM-Parameters to be added to an URL.
 * As Magento uses not URL-Query-Parameters, but Router-Parameters, the format of these are fitting for the
 * Magento-Routing.
 *
 * @example /utm_source/yourSource/utm_medium/yourMedium
 */
class UtmParameters {

  constructor () {
    this._source = null
    this._medium = null
    this._campaign = null
    this._term = null
    this._content = null
  }

  get source () {
    return this._source
  }

  set source (value) {
    this._source = value
  }

  get medium () {
    return this._medium
  }

  set medium (value) {
    this._medium = value
  }

  get campaign () {
    return this._campaign
  }

  set campaign (value) {
    this._campaign = value
  }

  get term () {
    return this._term
  }

  set term (value) {
    this._term = value
  }

  get content () {
    return this._content
  }

  set content (value) {
    this._content = value
  }

  /**
   * Concats all parameters to URL-Query, which can be added to an URL
   * @returns {string}
   */
  getQueryParameters() {
    let queryParameters = '';

    if (this.source)
      queryParameters += 'utm_source/' + this.source + '/'

    if (this.medium)
      queryParameters += 'utm_medium/' + this.medium + '/'

    if (this.campaign)
      queryParameters += 'utm_campaign/' + this.campaign + '/'

    if (this.term)
      queryParameters += 'utm_term/' + this.term + '/'

    if (this.content)
      queryParameters += 'utm_content/' + this.content + '/'

    return queryParameters
  }
}

module.exports = UtmParameters