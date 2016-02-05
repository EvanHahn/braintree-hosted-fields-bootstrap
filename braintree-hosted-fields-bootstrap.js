/* global $ */

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
        }
      }
    }

    $.each(FIELD_NAMES, function (i, field) {
      var $fieldEl = $form.find(options[field])

      $fieldEl.addClass('form-control')

      braintreeSetupOptions.hostedFields[field] = {
        selector: options[field],
        placeholder: $fieldEl.attr('placeholder') || ''
      }
    })

    bt.setup(options.authorization, 'custom', braintreeSetupOptions)
  }

  $.fn.hostedFields.defaults = {}
})(jQuery)
