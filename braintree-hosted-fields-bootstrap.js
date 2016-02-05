/* global jQuery */

;(function ($) {
  var REQUIRED_PROPERTIES = ['authorization']
  var FIELD_NAMES = [
    'number',
    'cvv',
    'expirationDate',
    'expirationMonth',
    'expirationYear',
    'postalCode'
  ]
  var PASS_THROUGH_TO_SETUP = [
    'coinbase',
    'paypal',
    'onPaymentMethodReceived'
  ]

  $.fn.hostedFields = function (options) {
    options = $.extend({}, $.fn.hostedFields.defaults, options)

    var $form = this

    var bt = options.braintree || window.braintree
    if (!bt) {
      throw new Error('Cannot find braintree')
    }
    $.each(REQUIRED_PROPERTIES, function (i, property) {
      if (!(property in options)) {
        throw new Error(property + ' option not found')
      }
    })

    var braintreeSetupOptions = {
      id: $form.prop('id'),
      hostedFields: {
        styles: {
          input: {
            'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
            'font-size': '14px'
          },
          '::-moz-placeholder': { color: '#999' },
          ':-ms-input-placeholder': { color: '#999' },
          '::-webkit-input-placeholder': { color: '#999' }
        },
        onFieldEvent: function (event) {
          var $target = $(event.target.container)
          var $parentGroup = $target.parents('.form-group')

          $parentGroup.toggleClass('has-success', event.isValid)
          $parentGroup.toggleClass('has-error', !event.isPotentiallyValid)

          options.onFieldEvent.apply(this, arguments)
        }
      }
    }

    $.each(PASS_THROUGH_TO_SETUP, function (i, option) {
      braintreeSetupOptions[option] = options[option]
    })

    $.each(FIELD_NAMES, function (i, field) {
      if (!(field in options)) { return }

      var $fieldEl = $form.find(options[field])

      $fieldEl.addClass('form-control').addClass('braintree-hosted-fields-bootstrap-container')

      braintreeSetupOptions.hostedFields[field] = {
        selector: options[field],
        placeholder: $fieldEl.attr('placeholder') || ''
      }
    })

    bt.setup(options.authorization, 'custom', braintreeSetupOptions)

    addCss()
  }

  $.fn.hostedFields.defaults = {
    onFieldEvent: $.noop
  }

  var hasAddedCss = false
  function addCss () {
    if (hasAddedCss) { return }

    hasAddedCss = true

    var styleEl = document.createElement('style')
    styleEl.innerHTML = [
      '.braintree-hosted-fields-bootstrap-container.braintree-hosted-fields-focused {',
      'border-color: #66afe9;',
      'outline: 0;',
      '-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);',
      'box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);',
      '}',
      '.braintree-hosted-fields-bootstrap-container.braintree-hosted-fields-valid {',
      'border-color: #3c763d;',
      '-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);',
      'box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);',
      '}',
      '.braintree-hosted-fields-bootstrap-container.braintree-hosted-fields-valid.braintree-hosted-fields-focused {',
      'border-color: #2b542c;',
      '-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;',
      'box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;',
      '}',
      '.braintree-hosted-fields-bootstrap-container.braintree-hosted-fields-invalid {',
      'border-color: #a94442;',
      '-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);',
      'box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);',
      '}',
      '.braintree-hosted-fields-bootstrap-container.braintree-hosted-fields-invalid.braintree-hosted-fields-focused {',
      'border-color: #843534;',
      '-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;',
      'box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;',
      '}'
    ].join('')

    $('head').append(styleEl)
  }
})(jQuery)
