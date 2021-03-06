'use strict';

var orderJSON;
var orderItems = [];

$( () => {
	
	var req = new XMLHttpRequest(); //XHR
	req.open('Get', 'http://localhost/cart.json');
	req.setRequestHeader( 'Content-Type', 'application/json');
	req.onload = ()=>{
		if(req.status == 200) {
			try {
				orderJSON = JSON.parse(req.response);

				//CUSTOMER OBJECT

				var currentCustomer = new Customer(orderJSON.customer.name, orderJSON.customer.location, orderJSON.customer.hasPaid);

				//ITEM OBJECT

				for (var i = 0; i < orderJSON.lineItems.length; i++) {
					var currentItem = orderJSON.lineItems[i];
					orderItems[i] = new Item(currentItem.itemname, currentItem.type, currentItem.qty, currentItem.unitPrice, i);
					}

				//showing the representation of the Order

				var myOrder = new Order(currentCustomer, orderItems);
				myOrder.showOrder ();
				myOrder.calculateTotalPrice ();
			}

			catch ( e ) {
				alert(e.message);
			}
		}
		else {
			alert (req.status + "error:\n" + req.status);
		}
	}
	req.onerror = ()=> {
		alert("Could not reach the server");
	}

	req.send();

});


//ORDER CLASS

function Order ( customer, lineItems, i ) {
	this.customer = customer;
	this.lineItems = lineItems;
	this.showOrder = function ( i ) {
		this.customer.showCustomerinHTML ();
		for (i = 0; i < this.lineItems.length; i++) {
			this.lineItems[i].showLineItemsinHTML ( i );
		}
	}
	this.calculateTotalPrice = function () {
		var totalPrice = 0.0;
		for (var i = 0; i < this.lineItems.length; i++) {
			var currentItem = this.lineItems[i];
			totalPrice += (currentItem.qty * currentItem.unitPrice);
		}
		$("#invoiceTotal").html(totalPrice.toFixed(2));
	}
}

//CUSTOMER CLASS

function Customer( name, location, hasPaid ) {
	this.name = name;
	this.location = location;
	this.hasPaid = hasPaid;
	this.showCustomerinHTML = function( id ) {
		document.getElementById("customerInfo").innerHTML =
			'<div id=#customerDiv>' +
			'Customer Name: ' + this.name + '<br/>' +
			'Customer Location: ' + this.location + '<br/>' +
			'</div>'
			;
	}
}

//LINEITEM CLASS

function Item( itemname, type, qty, unitPrice, i ) {
	this.itemname = itemname;
	this.type = type;
	this.qty = qty;
	this.unitPrice = unitPrice;
	this.showLineItemsinHTML = function ( i ) {
		document.getElementById("orderInvoice").innerHTML +=
		'<br/>'
		+ '<div id="itemInvoice'+ i +'" class="invoice">'
		+ '<div class="name">'
		+ this.itemname
		+ '</div>'
		+ " "
		+ '<div class="type">'
		+ this.type
		+ '</div>'
		+ " "
		+ '<div id="quantity'+ i +'" class="qty">'
		+ this.qty
		+ '</div>'
		+ " "
		+ '<button id="down" type="button" onclick="adjustAmount('+ i +', -1);"> - </button>'
		+ " "
		+ '<button id="up" type="button" onclick="adjustAmount('+ i +', 1);"> + </button>'
		+ " "
		+ '<div class="price">'
		+ this.unitPrice.toFixed(2)
		+ '</div>'
		+ " "
		+ '<div id="finalPrice' + i +'" class="totalCost">'
		+ (unitPrice * qty).toFixed(2)
		+ '</div>'
		+ "</div>"
		;
	}
}

//adds and subtracts when the button is clicked

function adjustAmount ( i, amount ) {
	var newAmount = (orderItems[i].qty += amount);
	if (newAmount == 0) {
		$("#itemInvoice" + i).hide(1000)
	}

	$("#quantity" + i).html(newAmount);

	adjustItemTotal(i);

	$('#finalPrice' + i).html(adjustItemTotal(i).toFixed(2));

	adjustGrandTotal();

	$("#invoiceTotal").html(adjustGrandTotal().toFixed(2));

	if (adjustGrandTotal() == 0) {
		$("#orderInvoice").text("Your cart is empty");	
	}
}

//recalculate lineItem total

function adjustItemTotal ( i ) {
	
	var newItemTotal = 0.0;

	newItemTotal += (orderItems[i].qty * orderItems[i].unitPrice);
	
	if (newItemTotal < 0) {
		newItemTotal = 0;
	}
	
	return newItemTotal;
}

//recalculate grand total

function adjustGrandTotal ( i ) {
	var newTotalPrice = 0.0;
	for (var i = 0; i < orderItems.length; i++) {
		newTotalPrice += (orderItems[i].qty * orderItems[i].unitPrice);
	}

	if (newTotalPrice < 0) {
		newTotalPrice = 0;
	}

	return newTotalPrice;
}