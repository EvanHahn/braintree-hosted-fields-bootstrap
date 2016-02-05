Braintree Hosted Fields + Bootstrap
===================================

Combine [Braintree's Hosted Fields](https://www.braintreepayments.com/features/hosted-fields) and [Bootstrap](https://getbootstrap.com/) for a slick form.

Usage:

```js
$('#my-checkout-form').hostedFields({
  authorization: 'YOUR BRAINTREE CLIENT TOKEN',
  number: '#my-hosted-field-number',
  cvv: '#my-hosted-field-cvv',
  expirationDate: '#my-hosted-field-expiration-date'
})
```

Take a look at the [example checkout](https://evanhahn.github.io/braintree-hosted-fields-bootstrap/) for more!
