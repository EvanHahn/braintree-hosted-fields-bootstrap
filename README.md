Braintree Hosted Fields + Bootstrap
===================================

Combine [Braintree's Hosted Fields](https://www.braintreepayments.com/features/hosted-fields) and [Bootstrap](https://getbootstrap.com/) for a slick form.

**This uses Braintree.js version 2. For the latest version, see the [master branch](https://github.com/EvanHahn/braintree-hosted-fields-bootstrap/tree/master).**

Usage
-----

Here's some example usage:

### Form HTML

```html
<form id="my-checkout-form">

<div class="form-group">
  <label class="control-label" for="email">Email address</label>
  <input type="email" class="form-control" id="email" placeholder="foo@boo.biz">
</div>

<div class="form-group">
  <label class="control-label" for="hosted-field-number">Credit Card Number</label>
  <div id="hosted-field-number" placeholder="4111 1111 1111 1111"></div>
</div>

<div class="form-group">
  <label class="control-label" for="hosted-field-cvv">CVV</label>
  <div id="hosted-field-cvv" placeholder="123"></div>
</div>

<div class="form-group">
  <label class="control-label" for="hosted-field-expiration-date">Expiration Date</label>
  <div id="hosted-field-expiration-date" placeholder="04 / 2020"></div>
</div>

<div class="form-group">
  <button type="submit" class="btn btn-primary">Pay</button>
</div>

</form>
```

### JavaScript to load

```html
<script src="jquery.js"></script>
<script src="bootstrap.js"></script>
<script src="braintree.js"></script>
<script src="braintree-hosted-fields-bootstrap.js"></script>
```

### JavaScript code

```js
$('#my-checkout-form').hostedFields({
  authorization: 'YOUR BRAINTREE CLIENT TOKEN',
  number: '#my-hosted-field-number',
  cvv: '#my-hosted-field-cvv',
  expirationDate: '#my-hosted-field-expiration-date'
})
```
