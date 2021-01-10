var checkoutButton = document.getElementById('checkout-button')
var list = document.getElementById('ul')
var addBtn = document.getElementById('add-button')
// var deleteBtn = document.getElementById('minus-button')
var size = document.getElementById('size')
let num = 1
var quantity = document.getElementById('quantity')
var row = document.getElementById('selection-row')

//Stripe publishing key
var stripe = Stripe(
  'pk_test_51I7XskGD6wn1FE2sFBOYFDTjEDELj9w1QsgWwPqyJNmQJF1S2GTP9etucoaBhUxYk0Y0g2tibWxDFfn8IMoWQl7K00Uqua01Dg',
)

//Adds another field to the list of orders
addBtn.addEventListener('click', function () {
  num = num + 1
  let newLi = document.createElement('li')
  newLi.innerHTML = row.innerHTML
  newLi.classList.add('more', 'li')
  newLi.setAttribute('id', num)
  list.append(newLi)
  let deleteBtn = newLi.children[3].children[1]
  console.log(deleteBtn)
  deleteBtn.setAttribute('onClick', 'removeOrder("' + num + '")')
})

//Removes chosen order from the list
function removeOrder(itemid) {
  var item = document.getElementById(itemid)
  list.removeChild(item)
}

checkoutButton.addEventListener('click', function () {
  let details = {
    size: size.value,
    quantity: quantity.value,
  }
  // Create a new Checkout Session using the server-side endpoint you
  // created in step 3.
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      details,
    }),
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id })
    })
    .then(function (result) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using `error.message`.
      if (result.error) {
        alert(result.error.message)
      }
    })
    .catch(function (error) {
      console.error('Error:', error)
    })
})
