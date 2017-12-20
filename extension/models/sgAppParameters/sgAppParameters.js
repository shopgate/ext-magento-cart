class SgAppParameters {
  constructor () {
    this._sgcloud_inapp = null
  }

  set sgcloudInapp (value) {
    this._sgcloud_inapp = value
  }

  get sgcloudInapp () {
    return this._sgcloud_inapp
  }

  getQueryParameters () {
    let queryParameters = ''
    if (this._sgcloud_inapp) {
      queryParameters += 'sgcloud_inapp/' + this._sgcloud_inapp + '/'
    }
    return queryParameters
  }
}

module.exports = SgAppParameters
