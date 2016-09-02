/* Braintree Hosted Fields + Bootstrap
 * by Evan Hahn
 * licensed under the Unlicense
 */

/* global jQuery, braintree */

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
    var formEl = $form.get(0)

    var bt = options.braintree || window.braintree
    if (!bt) {
      throw new Error('Cannot find braintree. Make sure to load the Client and Hosted Fields files!')
    } else if (!bt.client) {
      throw new Error('Cannot find braintree.client. Make sure to load it!')
    } else if (!bt.hostedFields) {
      throw new Error('Cannot find braintree.hostedFields. Make sure to load it!')
    }

    REQUIRED_PROPERTIES.forEach(function (property) {
      if (!(property in options)) {
        throw new Error(property + ' option not found')
      }
    })

    var $submitButton = $form.find('[type="submit"]')
    $submitButton.prop('disabled', true)

    braintree.client.create({
      authorization: options.authorization
    }, function (clientErr, clientInstance) {
      if (clientErr) { throw clientErr }

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          input: {
            'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
            'font-size': '14px'
          },
          '::-moz-placeholder': { color: '#999' },
          ':-ms-input-placeholder': { color: '#999' },
          '::-webkit-input-placeholder': { color: '#999' }
        },
        fields: FIELD_NAMES.reduce(function (result, field) {
          if (!(field in options)) { return result }

          var $fieldEl = $form.find(options[field])

          $fieldEl.addClass('form-control').addClass('braintree-hosted-fields-bootstrap-container')

          result[field] = {
            selector: options[field],
            placeholder: $fieldEl.attr('placeholder') || ''
          }
          return result
        }, {})
      }, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) { throw hostedFieldsErr }

        addCss()

        hostedFieldsInstance.on('validityChange', function (event) {
          var field = event.fields[event.emittedBy]
          var $parentGroup = $(field.container).parents('.form-group')

          $parentGroup.toggleClass('has-success', field.isValid)
          $parentGroup.toggleClass('has-error', !field.isPotentiallyValid)

          $submitButton.prop('disabled', !isEverythingValid(event))
        })

        $form.on('submit', function (event) {
          event.preventDefault()

          $submitButton.prop('disabled', true)

          hostedFieldsInstance.tokenize(function (tokenizeErr, tokenizedPayload) {
            if (tokenizeErr) {
              $submitButton.prop('disabled', false)
              throw tokenizeErr
            }

            var $paymentMethodNonce = $(document.createElement('input'))
            $paymentMethodNonce.attr('type', 'hidden')
            $paymentMethodNonce.attr('name', 'payment_method_nonce')
            $paymentMethodNonce.val(tokenizedPayload.nonce)
            $form.append($paymentMethodNonce)

            formEl.submit()
          })
        })
      })
    })
  }

  $.fn.hostedFields.defaults = {}

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

  function isEverythingValid (event) {
    return Object.keys(event.fields).every(function (fieldKey) {
      return event.fields[fieldKey].isValid
    })
  }
})(jQuery)
